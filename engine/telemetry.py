import numpy as np
import json
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List

# Load building structure from profiles.json for dynamic procedural generation
config_path = os.path.join(os.path.dirname(__file__), "profiles.json")
try:
    with open(config_path, 'r') as f:
        profiles_data = json.load(f)
    active_profile_name = profiles_data.get("active_profile", "default_tower")
    NUM_FLOORS = profiles_data["profiles"][active_profile_name].get("num_floors", 26)
except Exception as e:
    print(f"Warning: Could not load profiles.json ({e}). Defaulting to 26 floors.")
    NUM_FLOORS = 26

app = FastAPI(title="Aegis 3D Spatial Twin Telemetry API", version="1.0.0")

NUM_SCENARIOS = 10000
CATEGORIES = [
    "High-Velocity Aerodynamic Strain",
    "Topographical Flash Flood",
    "Seismic Shear Waves",
    "Micro-Climate Thermal Loading",
    "Foundation Liquefaction"
]

class SimulationResult(BaseModel):
    scenario_id: int
    category: str
    stress_mapping: Dict[str, float]

# Procedurally generate a synthetic matrix of exactly 10,000 multi-variable disaster scenarios.
# We use vectorized math (NumPy) to compute a structural stress coefficient (0.0 to 1.0).
np.random.seed(42) # Seed for reproducibility
stress_matrix = np.random.rand(NUM_SCENARIOS, NUM_FLOORS).astype(np.float32)
scenario_categories = np.random.choice(CATEGORIES, size=NUM_SCENARIOS)

@app.get("/api/v1/simulations", response_model=SimulationResult)
async def get_simulation(scenario_id: int):
    """
    Clean HTTP endpoint that accepts a 'scenario_id' and returns the full structural stress mapping instantly.
    """
    if scenario_id < 0 or scenario_id >= NUM_SCENARIOS:
        raise HTTPException(status_code=404, detail=f"Scenario ID out of bounds. Valid range: 0 to {NUM_SCENARIOS-1}")
    
    # Extract the stress values for the specified scenario using rapid array indexing
    floor_stresses = stress_matrix[scenario_id]
    
    # Format keys enforcing strict standard: 'Floor_XX'
    stress_mapping = {
        f"Floor_{str(i+1).zfill(2)}": float(floor_stresses[i])
        for i in range(NUM_FLOORS)
    }
    
    return SimulationResult(
        scenario_id=scenario_id,
        category=scenario_categories[scenario_id],
        stress_mapping=stress_mapping
    )

@app.get("/api/v1/simulations/bulk", response_model=List[SimulationResult])
async def get_all_simulations():
    """
    Returns the entire 10,000 scenario dataset at once. 
    Ideal for compiling into an offline JSON packet for the React Three Fiber frontend.
    """
    all_results = []
    for scenario_id in range(NUM_SCENARIOS):
        floor_stresses = stress_matrix[scenario_id]
        all_results.append(
            SimulationResult(
                scenario_id=scenario_id,
                category=scenario_categories[scenario_id],
                stress_mapping={
                    f"Floor_{str(i+1).zfill(2)}": float(floor_stresses[i])
                    for i in range(NUM_FLOORS)
                }
            )
        )
    return all_results

if __name__ == "__main__":
    import uvicorn
    # Launch lightning-fast ASGI server
    uvicorn.run(app, host="0.0.0.0", port=8000)
