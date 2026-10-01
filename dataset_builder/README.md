# Aegis Dataset Builder: Autonomous Persona & WGSL Shader Generators

[![Hugging Face Persona](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Persona%20ChatML-yellow.svg)](https://huggingface.co/datasets/abdullahashraf122/aegis-persona-sovereign-node)
[![Hugging Face Shaders](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-WebGPU%20WGSL%20Shaders-blue.svg)](https://huggingface.co/datasets/abdullahashraf122/aegis-wgsl-webgpu-shaders)

This module compiles and sanitizes specialized instruction datasets used to fine-tune and condition autonomous LLM nodes operating within the **Aegis AI Tower** arbitration mesh.

---

## Published Hugging Face Datasets

### 1. Aegis Sovereign Node Persona & Technical Dialogue
* **Repository**: [`abdullahashraf122/aegis-persona-sovereign-node`](https://huggingface.co/datasets/abdullahashraf122/aegis-persona-sovereign-node)
* **Format**: ChatML JSONL (`system`, `user`, `assistant` turns)
* **Description**: Synthesizes high-cadence executive tech-founder dialogue, defense of cyber-physical infrastructure, BACnet/LonWorks edge protocols, and tower arbitration logic.

### 2. Aegis WGSL WebGPU Shader Instruction Dataset
* **Repository**: [`abdullahashraf122/aegis-wgsl-webgpu-shaders`](https://huggingface.co/datasets/abdullahashraf122/aegis-wgsl-webgpu-shaders)
* **Format**: Text-to-Code JSONL (`prompt` $\to$ `code`)
* **Description**: 50 prompt-response pairs mapping physical simulation queries (fluid dynamics, seismic dissipation, acoustic damping, thermal stress) directly to functional WebGPU WGSL compute and fragment shaders.

---

## Pipeline Scripts

* **`fetch_keynotes.py` / `fetch_keynotes_api.py`**: Ingests source transcripts and engineering presentations into raw staging blocks.
* **`format_jsonl.py`**: Normalizes raw transcripts into strict ChatML structure.
* **`synthesize_master_jsonl.py`**: Merges persona transcripts with technical specifications into `aegis_master_persona.jsonl`.
* **`forge_wgsl_golden.py`**: Compiles and validates syntax for WGSL shader pairs.
