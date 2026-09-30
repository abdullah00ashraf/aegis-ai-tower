import { GoogleGenerativeAI, FunctionDeclaration } from '@google/generative-ai';
import { AutonomousWebScraper } from '../agents/WebScraper';
import * as dotenv from 'dotenv';

dotenv.config();

export class GeminiRouter {
  private ai: GoogleGenerativeAI;
  private modelName: string;
  private scraper = new AutonomousWebScraper();
  
  // Callbacks to interact with the connection lifecycle
  private onRenderMap: (lat: number, lng: number) => void;
  private onSynthesizeTTS: (text: string) => void;
  private onVisualLog: (log: string) => void;

  constructor(
    onRenderMap: (lat: number, lng: number) => void,
    onSynthesizeTTS: (text: string) => void,
    onVisualLog: (log: string) => void,
    modelName: string = 'gemini-1.5-pro'
  ) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      console.warn('[GEMINI_ROUTER] WARNING: GEMINI_API_KEY environment variable is not defined.');
    }
    this.ai = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
    this.onRenderMap = onRenderMap;
    this.onSynthesizeTTS = onSynthesizeTTS;
    this.onVisualLog = onVisualLog;
    console.log(`[GEMINI_ROUTER] Initialized Gemini engine targeting model: ${this.modelName}`);
  }

  /**
   * Defines strict schema function calling tools for Gemini
   */
  private getTools() {
    const ingestLiveWeb: FunctionDeclaration = {
      name: 'ingest_live_web',
      description: 'Fetch and parse the raw text content of a live external website or URL. Use this when asked about current events, live metrics, or external sites.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The exact URL to scrape (e.g. "https://example.com")'
          }
        },
        required: ['url']
      }
    } as any;

    const projectGeospatialCanvas: FunctionDeclaration = {
      name: 'project_geospatial_canvas',
      description: 'Project structural maps, radar telemetry, and visual coordinate overlays onto the secondary geospatial canvas. Use this when asked to map, visualize, or show location coordinates.',
      parameters: {
        type: 'object',
        properties: {
          latitude: {
            type: 'number',
            description: 'The target latitude (e.g. 19.0760)'
          },
          longitude: {
            type: 'number',
            description: 'The target longitude (e.g. 72.8777)'
          },
          layerType: {
            type: 'string',
            description: 'The visual styling or map overlay layer (e.g. "RADAR", "GRID", "TERRAIN")'
          }
        },
        required: ['latitude', 'longitude', 'layerType']
      }
    } as any;

    return [{ functionDeclarations: [ingestLiveWeb, projectGeospatialCanvas] }];
  }

  /**
   * Execution loop processing agentic commands with native function calling
   */
  async processSovereignCommand(userPrompt: string): Promise<string> {
    const startTime = Date.now();
    this.onVisualLog(`[GEMINI_ROUTER] Ingesting command: "${userPrompt}"...`);
    console.log(`[GEMINI_ROUTER] Ingested user command: "${userPrompt}"`);

    try {
      const model = this.ai.getGenerativeModel({
        model: this.modelName,
        systemInstruction: 
          "You are the Aegis Sovereign AI Core, a highly analytical and technical deeptech assistant. " +
          "You must use function calling to ingest live web content or project mapping overlays when requested. " +
          "Wait for the function response payload to return before generating your final technical summary. " +
          "Ensure your final responses are concise (under two sentences) for ultra-low latency audio presentation. " +
          "Do not use emojis."
      });

      const chat = model.startChat({
        tools: this.getTools()
      });

      // Send initial prompt to Gemini
      let result = await chat.sendMessage(userPrompt);
      let responseText = result.response.text();
      let functionCalls = result.response.functionCalls();

      // Handle function calling loop
      while (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        const { name, args } = call;
        this.onVisualLog(`[GEMINI_ROUTER] [AGENTIC_CALL] Executing tool: "${name}"`);
        console.log(`[GEMINI_ROUTER] Gemini requested function execution: "${name}" with args:`, args);

        let functionResponse: any;

        if (name === 'ingest_live_web') {
          const url = (args as any).url;
          this.onVisualLog(`[GEMINI_ROUTER] Web scraper dispatched to: ${url}`);
          try {
            const scrapeResult = await this.scraper.scrapeLiveIntel(url);
            functionResponse = {
              response: {
                name: 'ingest_live_web',
                content: {
                  status: 'SUCCESS',
                  source: 'LIVE_INTERNET',
                  rawText: scrapeResult.rawText
                }
              }
            };
          } catch (err: any) {
            functionResponse = {
              response: {
                name: 'ingest_live_web',
                content: {
                  status: 'ERROR',
                  error: err.message
                }
              }
            };
          }
        } else if (name === 'project_geospatial_canvas') {
          const lat = Number((args as any).latitude);
          const lng = Number((args as any).longitude);
          const layer = (args as any).layerType || 'RADAR';

          this.onVisualLog(`[GEMINI_ROUTER] Projecting GIS Radar matrix overlay at [${lat}, ${lng}]`);
          this.onRenderMap(lat, lng);

          functionResponse = {
            response: {
              name: 'project_geospatial_canvas',
              content: {
                status: 'SUCCESS',
                details: `Geospatial radar matrix overlay projected at [${lat}° N, ${lng}° E] using layer: ${layer}`
              }
            }
          };
        } else {
          functionResponse = {
            response: {
              name: name,
              content: {
                status: 'ERROR',
                error: `Unknown tool name: ${name}`
              }
            }
          };
        }

        // Send function execution response back to Gemini to generate final summary
        result = await chat.sendMessage([functionResponse]);
        responseText = result.response.text();
        functionCalls = result.response.functionCalls();
      }

      const latency = Date.now() - startTime;
      this.onVisualLog(`[GEMINI_ROUTER] [METRIC] Command resolved. Latency: ${latency}ms`);
      console.log(`[GEMINI_ROUTER] Synthesized technical response: "${responseText}"`);

      // Trigger TTS Multimodal Audio Pipeline
      this.onSynthesizeTTS(responseText);
      return responseText;

    } catch (error: any) {
      console.error('[GEMINI_ROUTER] ERR in command routing lifecycle:', error.message);
      const apology = `Apologies. An internal error occurred in the Gemini core routing matrix: ${error.message}`;
      this.onSynthesizeTTS(apology);
      return apology;
    }
  }
}
