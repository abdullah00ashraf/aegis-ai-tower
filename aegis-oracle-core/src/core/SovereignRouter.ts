import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { DataBroker } from '../agents/DataBroker';
import { PresentationDirector } from '../agents/PresentationDirector';

export class SovereignRouter {
  private wss: WebSocketServer;
  private readonly pythonUrl = 'ws://localhost:8765';
  private dataBroker = new DataBroker();
  private presentationDirector = new PresentationDirector();

  constructor(port: number = 8080) {
    console.log(`[SOVEREIGN_ROUTER] Spawning WebSocket Server on port ${port}...`);
    this.wss = new WebSocketServer({ port });
    this.init();
  }

  private init() {
    this.wss.on('connection', (clientSocket: WebSocket, req: IncomingMessage) => {
      const clientIp = req.socket.remoteAddress;
      console.log(`[SOVEREIGN_ROUTER] Frontend client connected from: ${clientIp}`);

      // Instantly spawn a dedicated WebSocket Client connecting to the local Python engine
      console.log(`[SOVEREIGN_ROUTER] Establishing dedicated tunnel to Python engine at ${this.pythonUrl}...`);
      const pythonSocket = new WebSocket(this.pythonUrl);

      // Latency metric tracker variables
      let binaryUpstreamCount = 0;
      let binaryDownstreamBytes = 0;
      const startTime = Date.now();

      // --- UPSTREAM ROUTING (React Client -> Python Engine) ---
      clientSocket.on('message', (message: Buffer | string | ArrayBuffer | Buffer[], isBinary: boolean) => {
        if (pythonSocket.readyState !== WebSocket.OPEN) {
          console.warn('[SOVEREIGN_ROUTER] Drop warning: Python tunnel socket not open. Buffering dropped.');
          return;
        }

        if (isBinary) {
          // Condition A (Binary): Pipe raw microphone PCM buffer directly
          binaryUpstreamCount++;
          if (binaryUpstreamCount % 50 === 0) {
            console.log(`[SOVEREIGN_ROUTER] [METRIC] Upstream binary chunk count: ${binaryUpstreamCount} (Runtime: ${Date.now() - startTime}ms)`);
          }
          pythonSocket.send(message, { binary: true });
        } else {
          // Condition B (JSON / Text Directives): Intercept CLI commands and route via local GGUF
          const payloadString = message.toString('utf-8');
          try {
            const parsed = JSON.parse(payloadString);
            if (parsed.type === 'CLI_COMMAND') {
              console.log(`[SOVEREIGN_ROUTER] Intercepted CLI command from React: "${parsed.command}"`);
              const cmdLower = parsed.command.toLowerCase();
              
              if (cmdLower.includes('keynote') || cmdLower.includes('presentation')) {
                console.log('[SOVEREIGN_ROUTER] [KEYNOTE] Keynote trigger captured! Delegating to PresentationDirector...');
                this.presentationDirector.startKeynote(clientSocket, pythonSocket).catch(err => {
                  console.error('[SOVEREIGN_ROUTER] ERR running keynote:', err.message);
                });
                return;
              }

              // Forward directly down the local Python GGUF engine as an INFERENCE_REQUEST
              pythonSocket.send(JSON.stringify({ type: 'INFERENCE_REQUEST', text: parsed.command }), { binary: false });
              return; // Halt propagation upstream to Python
            }

            if (parsed.action === 'INTERRUPT') {
              console.log('[SOVEREIGN_ROUTER] [KILL_SWITCH] INTERRUPT command captured. Flushing pipeline context.');
            } else {
              console.log(`[SOVEREIGN_ROUTER] Relaying upstream JSON payload: ${payloadString}`);
            }
          } catch {
            console.log(`[SOVEREIGN_ROUTER] Relaying upstream text payload: ${payloadString}`);
          }
          pythonSocket.send(message, { binary: false });
        }
      });

      // --- DOWNSTREAM ROUTING (Python Engine -> React Client) ---
      pythonSocket.on('message', (message: Buffer | string | ArrayBuffer | Buffer[], isBinary: boolean) => {
        if (clientSocket.readyState !== WebSocket.OPEN) return;

        if (isBinary) {
          // Condition A (Binary): Pipe synthesized Piper TTS Mono PCM bytes down instantly
          const bufferLength = Array.isArray(message) ? message.length : (message as Buffer).length;
          binaryDownstreamBytes += bufferLength;
          clientSocket.send(message, { binary: true });
        } else {
          // Condition B (UI Commands / Tool Calls): Intercept tool requests or relay visual changes
          const payloadString = message.toString('utf-8');
          try {
            const parsed = JSON.parse(payloadString);
            
            // 1. Intercept local GGUF TOOL_EXECUTION for RENDER_MAP
            if (parsed.type === 'TOOL_EXECUTION' && parsed.action === 'RENDER_MAP') {
              console.log(`[SOVEREIGN_ROUTER] GGUF tool call RENDER_MAP captured: lat=${parsed.latitude}, lng=${parsed.longitude}`);
              clientSocket.send(JSON.stringify({
                type: 'RENDER_MAP',
                latitude: parsed.latitude,
                longitude: parsed.longitude
              }), { binary: false });
              return;
            }

            // 2. Intercept local GGUF TEXT_SEGMENT to stream terminal text
            if (parsed.type === 'TEXT_SEGMENT') {
              console.log(`[SOVEREIGN_ROUTER] GGUF text segment captured: "${parsed.text}"`);
              clientSocket.send(JSON.stringify({
                type: 'TEXT_SEGMENT',
                text: parsed.text
              }), { binary: false });
              
              if (this.presentationDirector.isKeynoteRunning()) {
                this.presentationDirector.accumulateText(parsed.text);
              }
              return;
            }

            // 3. Intercept INFERENCE_COMPLETE to notify keynote step transitions
            if (parsed.type === 'INFERENCE_COMPLETE') {
              console.log(`[SOVEREIGN_ROUTER] GGUF inference complete signal received.`);
              clientSocket.send(JSON.stringify({ type: 'VISUAL_LOG', log: '[MASTER_AI] Local inference segment complete.' }));
              
              if (this.presentationDirector.isKeynoteRunning()) {
                this.presentationDirector.notifyInferenceComplete();
              }
              return;
            }

            if (parsed.type === 'TOOL_CALL') {
              console.log(`[SOVEREIGN_ROUTER] Legacy Tool call captured from Python: "${parsed.tool}"`);
              
              // Run the tool asynchronously in the background
              this.dataBroker.handleToolCall(parsed.tool, parsed.arguments).then((res) => {
                const responsePayload = {
                  type: 'TOOL_RESULT',
                  callId: parsed.callId,
                  result: res
                };
                console.log(`[SOVEREIGN_ROUTER] Tool execution complete for "${parsed.tool}". Dispatching results back to Python...`);
                pythonSocket.send(JSON.stringify(responsePayload), { binary: false });
              }).catch(err => {
                const responsePayload = {
                  type: 'TOOL_RESULT',
                  callId: parsed.callId,
                  result: {
                    error: err.message,
                    source: parsed.tool === 'query_internal_knowledge' ? 'IN_HOUSE_REPOS' : 'LIVE_INTERNET',
                    rawText: `Ingestion failed: ${err.message}`
                  }
                };
                pythonSocket.send(JSON.stringify(responsePayload), { binary: false });
              });
              return; // Stop propagation to React client
            }
          } catch {
            // standard non-JSON text
          }
          console.log(`[SOVEREIGN_ROUTER] Relaying downstream JSON visual override: ${payloadString}`);
          clientSocket.send(message, { binary: false });
        }
      });

      // --- ERROR & LIFE-CYCLE MANAGEMENT ---
      pythonSocket.on('open', () => {
        console.log('[SOVEREIGN_ROUTER] Python socket connection successfully bound.');
      });

      pythonSocket.on('error', (err) => {
        console.error('[SOVEREIGN_ROUTER] Python tunnel socket error:', err.message);
        if (clientSocket.readyState === WebSocket.OPEN) {
          clientSocket.send(JSON.stringify({ status: 'SOVEREIGN_NODE_OFFLINE' }));
        }
      });

      pythonSocket.on('close', (code, reason) => {
        console.warn(`[SOVEREIGN_ROUTER] Python tunnel disconnected (Code: ${code}, Reason: ${reason.toString('utf-8') || 'None'})`);
        if (clientSocket.readyState === WebSocket.OPEN) {
          clientSocket.send(JSON.stringify({ status: 'SOVEREIGN_NODE_OFFLINE' }));
        }
      });

      clientSocket.on('error', (err) => {
        console.error('[SOVEREIGN_ROUTER] React client socket error:', err.message);
      });

      clientSocket.on('close', (code) => {
        console.log(`[SOVEREIGN_ROUTER] React client socket disconnected (Code: ${code}). Cleaning up tunnel resources...`);
        // Cleanly terminate Python connection to prevent leaks and ghost voices
        if (pythonSocket.readyState === WebSocket.OPEN || pythonSocket.readyState === WebSocket.CONNECTING) {
          pythonSocket.close(1000, 'Frontend Client Disconnected');
        }
        console.log(`[SOVEREIGN_ROUTER] [SUMMARY] Tunnel closed. Ingested chunks: ${binaryUpstreamCount} // Dispatched audio: ${binaryDownstreamBytes} bytes.`);
      });
    });
  }
}

// Instantiate router if invoked as a main node module directly
if (require.main === module) {
  new SovereignRouter(8080);
}
