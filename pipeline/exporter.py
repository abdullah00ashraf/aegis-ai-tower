import requests
import json
import os

API_URL_BULK = "http://localhost:8000/api/v1/simulations/bulk"

def fetch_all_telemetry() -> list:
    """Reads all 10,000 telemetry scenarios from the backend."""
    try:
        print(f"Fetching 10,000 telemetry scenarios from {API_URL_BULK}...")
        response = requests.get(API_URL_BULK)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"[ERROR] Failed to fetch telemetry: {e}")
        return []

def embed_initial_metadata():
    """
    Matches Blender objects with dynamic structural metadata.
    Enforces 'structural_stress' initialization for GLB export compatibility.
    """
    import bpy
    for obj in bpy.context.scene.objects:
        if obj.type == 'MESH':
            if obj.name.startswith("Floor_"):
                # Initial structural stress before runtime manipulation via React Three Fiber
                obj["structural_stress"] = 0.0

def export_glb(filepath: str):
    """Exports the current scene to a clean, web-optimized GLB file with embedded metadata."""
    import bpy
    try:
        # We ensure custom properties like 'structural_stress' are included via export_extras
        bpy.ops.export_scene.gltf(
            filepath=filepath,
            export_format='GLB',
            use_selection=False,
            export_extras=True,
            export_materials='EXPORT',
            export_apply=True
        )
        print(f"[SUCCESS] Exported 3D Model with embedded metadata to {filepath}")
    except Exception as e:
        print(f"[ERROR] Failed to export GLB: {e}")

def export_react_three_fiber_packet(telemetry_data: list, filepath: str):
    """
    Structures a clean JSON packet ready to stream straight into a React Three Fiber frontend on Vercel.
    """
    packet = {
        "metadata": {
            "version": "1.0",
            "total_scenarios": len(telemetry_data),
            "description": "Aegis 3D Spatial Twin Precomputed Telemetry"
        },
        "scenarios": telemetry_data
    }
    
    with open(filepath, 'w') as f:
        # Dump minified JSON to optimize streaming performance
        json.dump(packet, f, separators=(',', ':'))
    print(f"[SUCCESS] Exported R3F JSON packet ({len(telemetry_data)} scenarios) to {filepath}")

if __name__ == "__main__":
    output_dir = os.path.dirname(__file__)
    glb_export_path = os.path.join(output_dir, "aegis_tower_optimized.glb")
    json_export_path = os.path.join(output_dir, "aegis_telemetry_packet.json")
    
    print("--- AEGIS 3D SPATIAL TWIN EXPORTER ---")
    
    # 1. Attempt Blender-specific processes (GLB Export)
    try:
        import bpy
        print("Blender environment detected. Processing GLB export...")
        embed_initial_metadata()
        export_glb(glb_export_path)
    except ImportError:
        print("[WARNING] 'bpy' module not found. Run this script inside Blender to generate the .glb asset.")
        print("Skipping 3D asset generation. Falling back to data compilation only.")

    # 2. Compile Web-Ready Telemetry Data
    print("\nStarting Telemetry Data Handshake...")
    data = fetch_all_telemetry()
    
    if data:
        # 3. Export the JSON packet for the React frontend
        export_react_three_fiber_packet(data, json_export_path)
        print("\n--- Handshake Complete. Ready for Vercel Deployment ---")
    else:
        print("\n[FAILED] Data compilation aborted due to missing backend telemetry.")
