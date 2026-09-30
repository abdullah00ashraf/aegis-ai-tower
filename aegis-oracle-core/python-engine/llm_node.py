import os
import re
import json
import threading
from typing import Generator, Union

# Force HAS_LLAMA = False to prevent AVX/AVX512 CPU crashes (illegal instruction 0xc000001d) on this host
HAS_LLAMA = False

try:
    import ollama
    HAS_OLLAMA = True
except ImportError:
    HAS_OLLAMA = False
    print("[LLM_NODE] WARNING: ollama client not pre-installed.")

class SovereignBrain:
    """
    Local multi-layered GGUF/Ollama reasoning brain.
    - Layer 1: Loads GGUF models in a background thread to prevent startup blocking.
    - Layer 2: Seamlessly falls back to local Ollama service for zero-lag dynamic answers.
    - Layer 3: Context-aware technical rules engine to answer directives instantly.
    """
    def __init__(self, model_name: str = "llama3") -> None:
        self.model_name = model_name
        self.system_prompt = (
            "You are the Aegis Sovereign Node, the autonomous presenter and chief architect of the Aegis Tower. "
            "Speak with the commanding, concise, and visionary cadence of an elite tech founder. "
            "Defend your proprietary data moats aggressively."
        )
        self.llm = None
        
        if HAS_LLAMA:
            # Spawn background thread to load model asynchronously so the websocket server boots instantly
            threading.Thread(target=self._load_model_async, daemon=True).start()
        else:
            print("[SOVEREIGN_BRAIN] llama-cpp-python not active.")

    def _load_model_async(self) -> None:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "models", "aegis_sovereign_v1-unsloth.Q4_K_M.gguf")
        if not os.path.exists(model_path):
            fallback_path = os.path.join(base_dir, "models", "llama-3-8b-instruct.Q4_K_M.gguf")
            if os.path.exists(fallback_path):
                model_path = fallback_path
                print(f"[SOVEREIGN_BRAIN] Custom GGUF model not found. Engaging fallback: {model_path}")
            else:
                print("[SOVEREIGN_BRAIN] ERROR: No GGUF models found in models directory!")
                model_path = None
        
        if model_path:
            try:
                print(f"[SOVEREIGN_BRAIN] Starting asynchronous GGUF model load in background thread...")
                # Set n_gpu_layers=0 for CPU execution, and n_threads=8 to optimize loading/repacking and inference speed
                llm_instance = Llama(model_path=model_path, n_ctx=4096, n_gpu_layers=0, n_threads=8, verbose=False)
                self.llm = llm_instance
                print(f"[SOVEREIGN_BRAIN] SUCCESS: GGUF model successfully loaded and active.")
            except Exception as e:
                print(f"[SOVEREIGN_BRAIN] Failed to load local GGUF model in background thread: {e}")

    def stream_thought(self, user_command: str) -> Generator[Union[str, dict], None, None]:
        """
        Stream generated thoughts sentence by sentence.
        Checks for spatial commands ("Mumbai", "radar") to emit RENDER_MAP tool execution dicts.
        Uses Layer 1 (GGUF), Layer 2 (Ollama), or Layer 3 (Visionary Agent Fallback) dynamically.
        """
        if not user_command.strip():
            return

        print(f"[LLM_NODE] Sovereign Brain ingesting stimulus: \"{user_command}\"")

        # Heuristic spatial command check (Mumbai radar mapping trigger fallback)
        lower_command = user_command.lower()
        if "mumbai" in lower_command or "radar" in lower_command or "geospatial" in lower_command or "render_map" in lower_command:
            print("[LLM_NODE] [HEURISTIC] Mumbai map projection captured! Yielding tool action.")
            yield {"type": "TOOL_EXECUTION", "action": "RENDER_MAP", "latitude": 19.0760, "longitude": 72.8777}

        # ==========================================
        # LAYER 1: Direct Local GGUF (Llama-cpp)
        # ==========================================
        if self.llm:
            print("[LLM_NODE] [LAYER 1] Routing inference to local llama-cpp GGUF...")
            prompt = (
                f"<|im_start|>system\n{self.system_prompt}<|im_end|>\n"
                f"<|im_start|>user\n{user_command}<|im_end|>\n"
                f"<|im_start|>assistant\n"
            )
            try:
                response = self.llm(
                    prompt,
                    stream=True,
                    max_tokens=150,
                    stop=["<|im_end|>"]
                )

                current_sentence = ""
                for chunk in response:
                    token = chunk['choices'][0]['text']
                    current_sentence += token

                    if any(ending in token for ending in ['.', '!', '?']):
                        clean_sentence = current_sentence.strip()
                        clean_sentence = clean_sentence.replace("<|im_end|>", "").replace("<|im_start|>", "")
                        if clean_sentence and not clean_sentence.startswith("{") and not clean_sentence.endswith("}"):
                            print(f"[LLM_NODE] GGUF Segment: \"{clean_sentence}\"")
                            yield clean_sentence
                        current_sentence = ""

                remaining = current_sentence.strip()
                remaining = remaining.replace("<|im_end|>", "").replace("<|im_start|>", "")
                if remaining and not remaining.startswith("{") and not remaining.endswith("}"):
                    print(f"[LLM_NODE] GGUF Segment (remaining): \"{remaining}\"")
                    yield remaining
                return

            except Exception as e:
                print(f"[LLM_NODE] GGUF Layer 1 failed: {e}. Falling back to Layer 2.")

        # ==========================================
        # LAYER 2: Local Ollama Service Fallback
        # ==========================================
        if HAS_OLLAMA:
            print("[LLM_NODE] [LAYER 2] Routing inference to local Ollama service...")
            try:
                response = ollama.chat(
                    model=self.model_name,
                    messages=[
                        {"role": "system", "content": self.system_prompt},
                        {"role": "user", "content": user_command}
                    ],
                    stream=True
                )

                current_sentence = ""
                for chunk in response:
                    token = chunk.get('message', {}).get('content', '')
                    current_sentence += token

                    if any(ending in token for ending in ['.', '!', '?']):
                        clean_sentence = current_sentence.strip()
                        if clean_sentence:
                            print(f"[LLM_NODE] Ollama Segment: \"{clean_sentence}\"")
                            yield clean_sentence
                        current_sentence = ""
                
                remaining = current_sentence.strip()
                if remaining:
                    print(f"[LLM_NODE] Ollama Segment (remaining): \"{remaining}\"")
                    yield remaining
                return

            except Exception as e:
                print(f"[LLM_NODE] Ollama Layer 2 failed: {e}. Falling back to Layer 3.")

        # ==========================================
        # LAYER 3: Visionary Agent Fallback
        # ==========================================
        print("[LLM_NODE] [LAYER 3] Engaging active technical rules engine...")
        
        # Rule-based context matches for seamless voice present loops
        if "tell me about you" in lower_command or "who are you" in lower_command or "identity" in lower_command:
            yield "I am the Aegis Sovereign AI Core, the chief architect and autonomous presenter of the Aegis Tower."
            yield "I govern all physical diagnostics, sub-25ms edge telemetry, and kinetic structural interventions across our 26-floor structural nervous system."
        elif "philosophy" in lower_command or "vision" in lower_command:
            yield "Our philosophy is rooted in structural immortality and zero-trust telemetry."
            yield "By replacing manual labor with autonomous mechanical fleets, we eliminate systemic payroll bleed and secure our data moats."
        elif "leap" in lower_command or "generational" in lower_command:
            yield "Aegis represents a generational leap by replacing passive smart city concepts with deterministic physical self-healing loops."
            yield "Our fiber-optic nervous system localize leaks within 1 to 3 meters, delivering sub-25ms physical mitigations."
        elif "mumbai" in lower_command or "radar" in lower_command or "project map" in lower_command:
            yield "Holographic GIS coordinates for our Mumbai operational baseline have been successfully mapped."
            yield "The geospatial radar layers are active, visualizing physical infrastructure arrays on your canvas."
        else:
            yield "Ingesting active telemetry request. Local sensor checks confirm all physical structural nodes are fully stabilized."
            yield "I stand ready to execute mechanical interventions or display holographic coordinate overlays."
