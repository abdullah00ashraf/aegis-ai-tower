import asyncio
import websockets
import json
import time
from typing import Union
from stt_node import LocalEar
from llm_node import SovereignBrain
from tts_node import LocalVoice

class WebSocketOrchestrator:
    """
    Local WebSocket orchestrator server running at ws://localhost:8765.
    Manages client connection sessions and coordinates real-time audio bytes ingestion,
    Whisper transcription, LLM reasoning, and Piper voice output synthesis.
    Now includes a fast Future-based asynchronous RPC bridge for tool execution.
    """
    def __init__(self, host: str = "localhost", port: int = 8765) -> None:
        self.host = host
        self.port = port
        
        # Instantiate speech-to-speech modules
        self.ear = LocalEar()
        self.brain = SovereignBrain()
        self.voice = LocalVoice()
        
        # Active tool RPC calls mapping: callId -> asyncio.Future
        self.active_tool_calls = {}

    async def execute_tool_rpc(self, tool_name: str, tool_args: dict, websocket: websockets.WebSocketServerProtocol) -> dict:
        call_id = f"tool_{int(time.time() * 1000)}"
        payload = {
            "type": "TOOL_CALL",
            "callId": call_id,
            "tool": tool_name,
            "arguments": tool_args
        }
        print(f"[SERVER] [RPC] Triggering tool request: \"{tool_name}\" with args: {tool_args} (ID: {call_id})")
        
        future = asyncio.get_running_loop().create_future()
        self.active_tool_calls[call_id] = future
        
        # Send downstream to Node.js SovereignRouter
        await websocket.send(json.dumps(payload))
        
        try:
            # Wait for tool result for up to 15.0 seconds
            result = await asyncio.wait_for(future, timeout=15.0)
            return result
        except asyncio.TimeoutError:
            print(f"[SERVER] [RPC] ERR: Tool request timeout for ID: {call_id}")
            return {
                "error": "Timeout",
                "source": "UNKNOWN",
                "rawText": "Error: Local context search timed out."
            }
        finally:
            if call_id in self.active_tool_calls:
                del self.active_tool_calls[call_id]

    async def process_user_query(self, user_text: str, websocket: websockets.WebSocketServerProtocol) -> None:
        if not user_text.strip():
            return
            
        print(f"[SERVER] [QUERY] Processing query: \"{user_text}\"")
        
        # Query local RAG database for matching technical context
        stimulus = user_text
        try:
            from rag_node import retrieve_context
            context = retrieve_context(user_text, n_results=3)
            if context.strip():
                print(f"[SERVER] [RAG] Retrieved matching context: {len(context)} bytes")
                stimulus = (
                    f"Context from internal knowledge base:\n"
                    f"{context}\n\n"
                    f"User Directive: {user_text}"
                )
                
                # Send a visual log to the React CLI console
                log_payload = {
                    "type": "VISUAL_LOG",
                    "log": f"[MASTER_AI] RAG context injected: {len(context)} characters of technical specifications."
                }
                await websocket.send(json.dumps(log_payload))
        except Exception as e:
            print(f"[SERVER] [RAG] Warning: RAG retrieval failed: {e}")
        
        # Stream from GGUF brain (returns sentences or tool execution dicts)
        for item in self.brain.stream_thought(stimulus):
            if isinstance(item, dict) and item.get("type") == "TOOL_EXECUTION":
                print(f"[SERVER] Dispatching local GGUF tool call: {item}")
                await websocket.send(json.dumps(item))
            else:
                sentence_payload = {
                    "type": "TEXT_SEGMENT",
                    "text": item
                }
                await websocket.send(json.dumps(sentence_payload))
                
                # Pipe sentence to LocalVoice (Piper TTS)
                pcm_audio_bytes = self.voice.synthesize_audio(item)
                if pcm_audio_bytes:
                    print(f"[SERVER] Streaming TTS voice bytes back to client ({len(pcm_audio_bytes)} bytes)")
                    await websocket.send(pcm_audio_bytes)
                    
        # Send downstream confirmation that inference loop has completed
        await websocket.send(json.dumps({"type": "INFERENCE_COMPLETE"}))

    async def handle_connection(self, websocket: websockets.WebSocketServerProtocol) -> None:
        print(f"[SERVER] Client connected: {websocket.remote_address}")
        
        try:
            async for message in websocket:
                if isinstance(message, bytes):
                    # --- speech/microphone audio PCM ingestion ---
                    print(f"[SERVER] Ingested raw binary chunk ({len(message)} bytes). Starting speech-to-speech loop...")
                    transcription = await self.ear.transcribe_audio_chunk(message)
                    
                    if not transcription:
                        print("[SERVER] Idle sound envelope or failed transcription segment.")
                        continue
                        
                    await self.process_user_query(transcription, websocket)
                else:
                    # --- text command / JSON telemetry ingestion ---
                    try:
                        data = json.loads(message)
                        msg_type = data.get("type")
                        
                        if msg_type == "INFERENCE_REQUEST":
                            text = data.get("text", "")
                            await self.process_user_query(text, websocket)
                            continue

                        if msg_type == "TOOL_RESULT":
                            # Resolve the pending RPC future
                            call_id = data.get("callId")
                            if call_id in self.active_tool_calls:
                                self.active_tool_calls[call_id].set_result(data.get("result", {}))
                                print(f"[SERVER] [RPC] Resolved pending tool result for ID: {call_id}")
                            else:
                                print(f"[SERVER] [RPC] WARNING: Received TOOL_RESULT for expired/unknown ID: {call_id}")
                            continue

                        if msg_type == "SYNTHESIZE_TTS":
                            text = data.get("text", "")
                            print(f"[SERVER] [SYNTHESIZE_TTS] Intercepted TTS request from Gemini: \"{text}\"")
                            pcm_audio_bytes = self.voice.synthesize_audio(text)
                            if pcm_audio_bytes:
                                print(f"[SERVER] [SYNTHESIZE_TTS] Synthesized {len(pcm_audio_bytes)} PCM bytes. Streaming downstream...")
                                await websocket.send(pcm_audio_bytes)
                            continue
                            
                        # Handle other potential JSON controls (like INTERRUPT)
                        if data.get("action") == "INTERRUPT":
                            print("[SERVER] [KILL_SWITCH] Intercepted audio playback interrupt signal.")
                            continue
                            
                    except (json.JSONDecodeError, TypeError):
                        # Plain text command from frontend text input field
                        await self.process_user_query(message, websocket)

        except websockets.exceptions.ConnectionClosed as e:
            print(f"[SERVER] Client connection closed: {websocket.remote_address} (Code: {e.code})")
        except Exception as e:
            print(f"[SERVER] ERR handling socket connection session: {e}")

    async def start_server(self) -> None:
        print(f"[SERVER] Spawning local WebSocket orchestrator at ws://{self.host}:{self.port}...")
        async with websockets.serve(self.handle_connection, self.host, self.port):
            await asyncio.Future()

if __name__ == "__main__":
    orchestrator = WebSocketOrchestrator()
    try:
        asyncio.run(orchestrator.start_server())
    except KeyboardInterrupt:
        print("\n[SERVER] Shutdown signal intercepted. Closing server context.")
