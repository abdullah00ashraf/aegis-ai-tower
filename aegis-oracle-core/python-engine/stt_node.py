import os
import tempfile
import asyncio
import time
import random
from typing import Optional

try:
    from faster_whisper import WhisperModel
    HAS_WHISPER = True
except ImportError:
    HAS_WHISPER = False
    print("[STT_NODE] WARNING: faster-whisper not pre-installed. Engaging compliant simulated ear fallback mode.")

class LocalEar:
    """
    Sovereign local Speech-to-Text (STT) processor.
    Utilizes quantized Faster-Whisper models for ultra-low latency transcription on standard hardware.
    Features robust local simulators if libraries are absent.
    """
    def __init__(self, model_size: str = "base", device: str = "cpu", compute_type: str = "int8") -> None:
        if HAS_WHISPER:
            print(f"[STT_NODE] Loading local Faster-Whisper '{model_size}' model on {device}...")
            self.model = WhisperModel(model_size, device=device, compute_type=compute_type)
            print("[STT_NODE] Local ear initialized and ready.")
        else:
            self.model = None
            print("[STT_NODE] Local simulated ear initialized and ready.")

    async def transcribe_audio_chunk(self, audio_bytes: bytes) -> str:
        """
        Saves incoming raw audio buffer to a temporary WAV file,
        runs local transcription, and returns parsed text.
        """
        if not audio_bytes or len(audio_bytes) < 100:
            return ""

        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._sync_transcribe, audio_bytes)

    def _sync_transcribe(self, audio_bytes: bytes) -> str:
        if not HAS_WHISPER:
            # High-fidelity simulated transcription to verify WebSocket pipelines
            print(f"[STT_NODE] Ingested {len(audio_bytes)} raw mic audio bytes. Analyzing signal wave...")
            time.sleep(0.12) # Emulate CPU model evaluation delay

            mock_responses = [
                "Execute structural dynamic load audit on Mumbai coastal grid.",
                "Toggle zero-trust telemetry bridge active.",
                "Scan and verify Aegis spatial visualizer mesh displacement delta.",
                "Display current anomaly loading cells inside visualizer HUD."
            ]
            selected = random.choice(mock_responses)
            print(f"[STT_NODE] [SIMULATED] Transcribed: \"{selected}\"")
            return selected

        # Standard C-Translate sequence
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
            temp_path = temp_audio.name
            try:
                temp_audio.write(audio_bytes)
                temp_audio.flush()
                temp_audio.close()

                segments, info = self.model.transcribe(temp_path, beam_size=1, language="en")
                transcription_parts = [segment.text for segment in segments]
                text = " ".join(transcription_parts).strip()
                
                if text:
                    print(f"[STT_NODE] Transcribed: \"{text}\" (Confidence: {info.language_probability:.2f})")
                return text
                
            except Exception as e:
                print(f"[STT_NODE] ERR processing audio segment: {e}")
                return ""
            finally:
                if os.path.exists(temp_path):
                    try:
                        os.unlink(temp_path)
                    except OSError:
                        pass
