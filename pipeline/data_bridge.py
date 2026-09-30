import os
import json
import requests

VECTOR_ENGINE_URI = "http://localhost:8001/api/v1/simulations/bulk"

def pull_vectorized_tensor() -> list:
    """
    Ingests the heavy 10,000 scenario stress tensor from the decoupled vector engine.
    """
    try:
        print(f"[DATA BRIDGE] Initiating high-bandwidth data stream from {VECTOR_ENGINE_URI}")
        req = requests.get(VECTOR_ENGINE_URI, timeout=30)
        req.raise_for_status()
        return req.json()
    except Exception as e:
        print(f"[DATA BRIDGE ERROR] Tensor connection severed: {e}")
        return []

def package_gltf_metadata():
    """
    Attempts to trigger a direct Blender background GLTF export if running inside the bpy context.
    """
    try:
        import bpy
        export_path = os.path.join(os.path.dirname(__file__), "aegis_spatial_twin.glb")
        
        # Enforce zero-state on all stress properties before export
        for obj in bpy.context.scene.objects:
            if obj.type == 'MESH' and obj.name.startswith("Floor_"):
                obj["structural_stress"] = 0.0
                
        # Export robust geometry with native custom properties attached
        bpy.ops.export_scene.gltf(
            filepath=export_path,
            export_format='GLB',
            use_selection=False,
            export_extras=True, # Critical for custom 'structural_stress' binding
            export_materials='EXPORT',
            export_apply=True
        )
        print(f"[DATA BRIDGE] Successfully packaged GLTF/GLB Spatial Twin to: {export_path}")
    except ImportError:
        print("[DATA BRIDGE WARNING] Execution outside bpy container. Skipping GLB geometry packaging.")

def compile_r3f_static_asset(tensor_data: list):
    """
    Bridges the backend Python infrastructure directly to the Vercel React frontend.
    Dumps the massive JSON payload efficiently to allow WebGL instanced rendering to hook into it seamlessly.
    Places the asset directly in the /public folder of the frontend.
    """
    public_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public")
    os.makedirs(public_dir, exist_ok=True)
    
    bridge_payload_path = os.path.join(public_dir, "simulation_tensor.json")
    
    manifest = {
        "architecture_version": "2.0.0",
        "tensor_size": len(tensor_data),
        "streaming_protocol": "Static Preload",
        "payload": tensor_data
    }
    
    # Optimize data density for minimal wire latency (No spaces, minimized structure)
    with open(bridge_payload_path, 'w') as f:
        json.dump(manifest, f, separators=(',', ':'))
        
    print(f"[DATA BRIDGE] Compiled JSON Tensor successfully for React Three Fiber injection at: {bridge_payload_path}")

if __name__ == "__main__":
    print("===================================================")
    print("    AEGIS REAL-TIME DATA BRIDGE & WEB PACKAGER     ")
    print("===================================================")
    
    # Phase 1: GLB Mesh Export via bpy
    package_gltf_metadata()
    
    # Phase 2: High-Volume Telemetry Ingestion
    tensor = pull_vectorized_tensor()
    
    if tensor:
        # Phase 3: Frontend Streaming Optimization
        compile_r3f_static_asset(tensor)
        print("\n[SUCCESS] Pipeline execution complete. Ready for React / Vercel integration.")
    else:
        print("\n[FATAL] Pipeline execution halted due to vector engine failure.")
