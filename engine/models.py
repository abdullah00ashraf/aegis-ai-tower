from pydantic import BaseModel, Field
from typing import Literal

class StructuralConfig(BaseModel):
    """
    Data Contract for the Generative Architectural Engineering Synthesizer.
    Enables C-suite executives to hot-swap macro geometry and advanced structural topology parameters.
    """
    floor_count: int = Field(default=26, ge=10, le=80, description="Total number of floors in the structure.")
    profile_morph: float = Field(default=1.0, ge=0.0, le=3.0, description="Mathematical blending slider: 0=Rectangular, 1=Circular, 2=Elliptical, 3=Hyperbolic Paraboloid.")
    taper: float = Field(default=0.2, ge=0.0, le=0.8, description="Tapering coefficient from base to top.")
    aspect_ratio: float = Field(default=1.0, ge=0.5, le=2.0, description="Independent floor aspect ratio X/Z.")
    helix_twist: float = Field(default=0.0, ge=0.0, le=360.0, description="Rotational helix twist angle in degrees.")
    primary_load_path: Literal["Diagrid", "Outrigger", "Tube-in-Tube"] = Field(default="Diagrid", description="Primary structural load path technology.")
    atrium_scale: float = Field(default=0.3, ge=0.0, le=0.8, description="Volumetric scale of the central atrium cavity.")
    redundancy_optimization: float = Field(default=0.2, ge=0.0, le=1.0, description="Redundancy optimization level for low-stress cells.")

    class Config:
        schema_extra = {
            "example": {
                "floor_count": 45,
                "profile_morph": 1.5,
                "taper": 0.3,
                "aspect_ratio": 1.2,
                "helix_twist": 90.0,
                "primary_load_path": "Diagrid",
                "atrium_scale": 0.4,
                "redundancy_optimization": 0.35
            }
        }

