# Aegis AI Tower: Autonomous Cyber-Physical Infrastructure Mesh

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React: 19](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![Three.js: Fiber](https://img.shields.io/badge/3D-React%20Three%20Fiber-black.svg)](https://threejs.org/)
[![Tailwind: 4.0](https://img.shields.io/badge/CSS-Tailwind%204-teal.svg)](https://tailwindcss.com/)
[![Engine: Aegis Oracle Core](https://img.shields.io/badge/Backend-Aegis%20Oracle%20Core-purple.svg)](#aegis-oracle-core)

**Aegis AI Tower** is an autonomous cyber-physical operating system and interactive 3D digital twin platform for commercial and high-density civil infrastructure.

It bridges real-time structural health telemetry (fiber-optic strain gauges, seismic load arrays, HVAC thermodynamic boundaries) with autonomous physical actuation—reducing critical infrastructure anomaly response times from hours to milliseconds.

---

## 1. System Architecture

```mermaid
graph TD
    subgraph Physical_Telemetry["Physical Infrastructure Layer"]
        Sensors["10,000+ IoT Strain & Thermal Sensors"] --> Gateway["Edge Telemetry Ingestion Gateway"]
        HVAC["Automated HVAC & Actuation Controls"] <-- Gateway
    end

    subgraph Oracle_Core["Aegis Oracle Core (Local Intelligence)"]
        Gateway --> RAG["Domain Knowledge RAG (aegis-oracle-core)"]
        RAG --> LLM["Local Neural Inference (Llama 3 8B)"]
        LLM --> Voice["STT / TTS Voice Dispatch Engine"]
    end

    subgraph Visual_Twin["Interactive 3D Digital Twin (React + Three.js)"]
        Gateway --> Twin["Three.js Spatial Envelope Visualizer"]
        Oracle_Core --> HUD["Tactical Mission Control HUD"]
        HUD --> Twin
    end

    HUD --> Operator["Command Center / Facility Engineering"]
```

---

## 2. Directory Structure

```
FRAMEWORK(AI TOWER)/
├── aegis-oracle-core/            # Voice, RAG, and local neural inference service
│   ├── python-engine/            # FastAPI / PyTorch / STT / TTS execution nodes
│   │   ├── llm_node.py
│   │   ├── rag_node.py
│   │   ├── server.py
│   │   └── stt_node.py
│   └── src/                      # Oracle client integration
├── Aegis_Knowledge_Base/         # Engineering, hardware, and legal knowledge base
│   ├── 01_Core_Physics_and_AI/
│   ├── 02_Hardware_and_Actuation/
│   ├── 04_Legal_and_Compliance/
│   └── 05_Aegis_Proprietary/
├── dataset_builder/              # Spatial dataset generators
├── engine/                       # Thermodynamic & physical simulation engines
├── pipeline/                     # Telemetry ingestion pipelines
├── public/                       # 3D assets, textures, and models
├── src/                          # React 19 + Three.js Digital Twin Frontend
│   ├── components/               # 3D Canvas, Building Envelope, Tactical HUD
│   ├── hooks/
│   └── views/
├── .env.example                  # Environment configuration template
├── package.json                  # Frontend dependencies
└── vite.config.ts                # Vite 8 build configuration
```

---

## 3. Quickstart & Installation

### Prerequisites
- Node.js >= 20.x
- Python >= 3.11 (for `aegis-oracle-core`)
- Git

### 1. Frontend Setup (Interactive 3D Digital Twin)

```bash
# Clone the repository
git clone https://github.com/abdullah00ashraf/aegis-ai-tower.git
cd aegis-ai-tower

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Launch the development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to interact with the 3D building envelope.

### 2. Backend Setup (Aegis Oracle Core)

```bash
cd aegis-oracle-core/python-engine
python -m venv .venv

# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python server.py
```

---

## 4. Environment Variables Reference

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `5173` | Vite development server port |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Aegis Oracle backend REST endpoint |
| `ORACLE_HOST` | `127.0.0.1` | Python engine host binding |
| `ORACLE_PORT` | `8000` | Python engine port |
| `GEMINI_API_KEY` | *optional* | Cloud model fallback for complex queries |
| `YOUTUBE_API_KEY` | *optional* | Media streaming and video integration |

---

## 5. License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.
