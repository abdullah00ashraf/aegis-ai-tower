import bpy
import math
import json
import os

def reset_workspace_context():
    """
    Purges all geometric data from the Blender context memory array.
    Ensures a flawless procedural recreation without overlapping legacy meshes.
    """
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    
    # Deep clean orphan data blocks to prevent memory leaks
    for block_type in [bpy.data.meshes, bpy.data.materials, bpy.data.cameras, bpy.data.lights]:
        for block in block_type:
            if block.users == 0:
                block_type.remove(block)

def construct_native_shader_graph():
    """
    Programmatically builds an optimal material shader graph using Cycles/Eevee nodes.
    Pipeline: Attribute Node (structural_stress) -> ColorRamp -> Emission Strength.
    """
    shader = bpy.data.materials.new(name="TelemetryStressShader")
    shader.use_nodes = True
    nodes = shader.node_tree.nodes
    links = shader.node_tree.links
    nodes.clear()
    
    # I/O Nodes
    mat_out = nodes.new(type='ShaderNodeOutputMaterial')
    mat_out.location = (400, 0)
    
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.location = (100, 0)
    links.new(bsdf.outputs['BSDF'], mat_out.inputs['Surface'])
    
    # Telemetry Ingestion Node (Reads React Three Fiber manipulated data)
    stress_attr = nodes.new(type='ShaderNodeAttribute')
    stress_attr.attribute_name = "structural_stress"
    stress_attr.location = (-400, 200)
    
    # Heatmap Ramp (Neon Cyan [0.0] to Alert Red [1.0])
    color_ramp = nodes.new(type='ShaderNodeValToRGB')
    color_ramp.location = (-100, 200)
    ramp_elements = color_ramp.color_ramp.elements
    ramp_elements[0].color = (0.0, 1.0, 1.0, 1.0) # Neon Cyan
    ramp_elements[0].position = 0.0
    ramp_elements[1].color = (1.0, 0.0, 0.0, 1.0) # Alert Red
    ramp_elements[1].position = 1.0
    
    # Amplify emission output proportionally to stress coefficient
    emission_multiplier = nodes.new(type='ShaderNodeMath')
    emission_multiplier.operation = 'MULTIPLY'
    emission_multiplier.inputs[1].default_value = 15.0 # Max glow
    emission_multiplier.location = (-100, 0)
    
    # Wire the pipeline
    links.new(stress_attr.outputs['Fac'], color_ramp.inputs['Fac'])
    links.new(stress_attr.outputs['Fac'], emission_multiplier.inputs[0])
    links.new(color_ramp.outputs['Color'], bsdf.inputs['Base Color'])
    links.new(color_ramp.outputs['Color'], bsdf.inputs['Emission Color'])
    links.new(emission_multiplier.outputs['Value'], bsdf.inputs['Emission Strength'])
    
    return shader

def instantiate_procedural_architecture(config: dict):
    """
    Generates a high-fidelity 3D structural mesh completely independent of fixed geometrical constraints.
    """
    num_floors = config.get("num_floors", 26)
    pillar_count = config.get("pillar_count", 8)
    slab_dim = config.get("core_slab_dimensions", (20.0, 20.0, 0.5))
    floor_height = config.get("floor_height", 4.0)
    
    reset_workspace_context()
    telemetry_shader = construct_native_shader_graph()
    
    for f_idx in range(1, num_floors + 1):
        floor_label = str(f_idx).zfill(2)
        base_z = (f_idx - 1) * floor_height
        
        # 1. Primary Structural Slabs
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, base_z))
        slab = bpy.context.active_object
        slab.name = f"Floor_{floor_label}_Slab"
        slab.scale = slab_dim
        slab["structural_stress"] = 0.0
        slab.data.materials.append(telemetry_shader)
        
        # 2. Dynamic Radial Pillar Generation
        radius = 0.6
        pillar_h = floor_height - slab_dim[2]
        pillar_z = base_z + (slab_dim[2]/2) + (pillar_h/2)
        
        for p_idx in range(1, pillar_count + 1):
            angle = (p_idx / pillar_count) * 2 * math.pi
            px = (slab_dim[0]/2 - radius * 2) * math.cos(angle)
            py = (slab_dim[1]/2 - radius * 2) * math.sin(angle)
            
            bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=pillar_h, location=(px, py, pillar_z))
            pillar = bpy.context.active_object
            pillar.name = f"Floor_{floor_label}_Pillar_{str(p_idx).zfill(2)}"
            pillar["structural_stress"] = 0.0
            pillar.data.materials.append(telemetry_shader)
            
        # 3. Central Core Shear Wall
        core_dim = (slab_dim[0]*0.25, slab_dim[1]*0.25, pillar_h)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, pillar_z))
        core_wall = bpy.context.active_object
        core_wall.name = f"Floor_{floor_label}_CoreShearWall"
        core_wall.scale = core_dim
        core_wall["structural_stress"] = 0.0
        core_wall.data.materials.append(telemetry_shader)
        
if __name__ == "__main__":
    # Ingest the JSON profile to drive procedural generation
    config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "engine", "profiles.json")
    try:
        with open(config_path, 'r') as f:
            profiles = json.load(f)
        active = profiles.get("active_profile", "default_tower")
        layout = profiles["profiles"][active]
        print(f"[BLENDER ENGINE] Utilizing dynamic layout constraint profile: {active}")
    except Exception as e:
        print(f"[BLENDER ENGINE ERROR] Failed to load JSON configuration ({e}). Using robust failover schema.")
        layout = {"num_floors": 26, "pillar_count": 8, "core_slab_dimensions": (20.0, 20.0, 0.5), "floor_height": 4.5}
        
    instantiate_procedural_architecture(layout)
    print("[BLENDER ENGINE] Procedural 3D Spatial Twin constructed successfully in memory.")
