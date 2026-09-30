import bpy
import math
import json
import os

def clear_scene():
    """Removes all existing objects, meshes, and materials for a clean structural generation."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for mat in bpy.data.materials:
        bpy.data.materials.remove(mat)
    for mesh in bpy.data.meshes:
        bpy.data.meshes.remove(mesh)

def create_stress_shader():
    """
    Programmatically assembles a Cycles/Eevee material shader graph.
    Uses an Attribute Node looking up 'structural_stress', piped into a ColorRamp 
    (Cyan to Flashing Red) hooked directly to material Emission strength.
    """
    mat = bpy.data.materials.new(name="AegisStressShader")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Clear default nodes
    nodes.clear()
    
    # 1. Material Output Node
    output_node = nodes.new(type='ShaderNodeOutputMaterial')
    output_node.location = (400, 0)
    
    # 2. Principled BSDF
    principled = nodes.new(type='ShaderNodeBsdfPrincipled')
    principled.location = (100, 0)
    links.new(principled.outputs['BSDF'], output_node.inputs['Surface'])
    
    # 3. Attribute Node targeting custom property 'structural_stress'
    attr_node = nodes.new(type='ShaderNodeAttribute')
    attr_node.attribute_name = "structural_stress"
    attr_node.location = (-400, 200)
    
    # 4. ColorRamp (Cyan to Flashing Red)
    color_ramp = nodes.new(type='ShaderNodeValToRGB')
    color_ramp.location = (-100, 200)
    color_ramp.color_ramp.elements[0].color = (0.0, 1.0, 1.0, 1.0) # Cyan
    color_ramp.color_ramp.elements[0].position = 0.0
    color_ramp.color_ramp.elements[1].color = (1.0, 0.0, 0.0, 1.0) # Flashing Red
    color_ramp.color_ramp.elements[1].position = 1.0
    
    # 5. Math Multiply Node to amplify emission strength dynamically
    math_node = nodes.new(type='ShaderNodeMath')
    math_node.operation = 'MULTIPLY'
    math_node.inputs[1].default_value = 10.0 # Max flashing intensity multiplier
    math_node.location = (-100, 0)
    
    # 6. Wire it all up
    links.new(attr_node.outputs['Fac'], color_ramp.inputs['Fac'])
    links.new(attr_node.outputs['Fac'], math_node.inputs[0])
    
    links.new(color_ramp.outputs['Color'], principled.inputs['Base Color'])
    links.new(color_ramp.outputs['Color'], principled.inputs['Emission Color'])
    links.new(math_node.outputs['Value'], principled.inputs['Emission Strength'])
    
    return mat

def generate_building(config: dict):
    """
    Programmatically models the building based on a dynamic structural layout dictionary.
    Builds the tower using clean mesh primitives (Slabs, Pillars, Core Walls).
    """
    num_floors = config.get("num_floors", 26)
    pillar_count = config.get("pillar_count", 4)
    slab_dim = config.get("core_slab_dimensions", (10.0, 10.0, 0.5))
    floor_height = config.get("floor_height", 4.0)
    
    clear_scene()
    stress_mat = create_stress_shader()
    
    for i in range(1, num_floors + 1):
        floor_id = str(i).zfill(2)
        z_offset = (i - 1) * floor_height
        
        # --- Generate Core Slab ---
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, z_offset))
        slab = bpy.context.active_object
        slab.name = f"Floor_{floor_id}_Slab"
        slab.scale = slab_dim
        
        # Inject custom metadata and attach shader
        slab["structural_stress"] = 0.0
        slab.data.materials.append(stress_mat)
        
        # --- Generate Pillars ---
        pillar_radius = 0.5
        pillar_height = floor_height - slab_dim[2]
        pillar_z = z_offset + (slab_dim[2]/2) + (pillar_height/2)
        
        for p in range(1, pillar_count + 1):
            pillar_id = str(p).zfill(2)
            angle = (p / pillar_count) * 2 * math.pi
            px = (slab_dim[0]/2 - pillar_radius * 2) * math.cos(angle)
            py = (slab_dim[1]/2 - pillar_radius * 2) * math.sin(angle)
            
            bpy.ops.mesh.primitive_cylinder_add(
                radius=pillar_radius, 
                depth=pillar_height, 
                location=(px, py, pillar_z)
            )
            pillar = bpy.context.active_object
            pillar.name = f"Floor_{floor_id}_Pillar_{pillar_id}"
            
            pillar["structural_stress"] = 0.0
            pillar.data.materials.append(stress_mat)
            
        # --- Generate Core Wall (Elevator Shaft / Structural Core) ---
        core_dim = (slab_dim[0]*0.2, slab_dim[1]*0.2, pillar_height)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, pillar_z))
        core_wall = bpy.context.active_object
        core_wall.name = f"Floor_{floor_id}_CoreWall"
        core_wall.scale = core_dim
        
        core_wall["structural_stress"] = 0.0
        core_wall.data.materials.append(stress_mat)

if __name__ == "__main__":
    # Load dynamic structural layout from profiles.json
    config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "engine", "profiles.json")
    try:
        with open(config_path, 'r') as f:
            profiles_data = json.load(f)
        active_profile_name = profiles_data.get("active_profile", "default_tower")
        layout_config = profiles_data["profiles"][active_profile_name]
        print(f"Loaded layout profile: {active_profile_name}")
    except Exception as e:
        print(f"Error loading profiles.json: {e}. Using default layout.")
        layout_config = {
            "num_floors": 26,
            "pillar_count": 8,
            "core_slab_dimensions": (20.0, 20.0, 0.5),
            "floor_height": 4.5
        }
    
    # Generate the Blender mesh procedurally based on configuration profile
    generate_building(layout_config)
    print("Aegis 3D Spatial Twin - Flexible Mesh Generation Complete.")
