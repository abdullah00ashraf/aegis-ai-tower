import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProceduralInteriorElementProps {
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
  stress: number;
  type?: 'box' | 'cylinder';
}

// --- LOW-POLYGON INTERIOR PIECE WITH SYSTEM-STRESS REFLECTIVE MATERIAL ---
const ProceduralInteriorElement = ({ position, size, rotation = [0, 0, 0], stress, type = 'box' }: ProceduralInteriorElementProps) => {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const isCritical = stress > 0.80;

  useFrame((state) => {
    if (!matRef.current) return;
    if (isCritical) {
      const time = state.clock.getElapsedTime();
      // Flashes between a low-intensity warning glow and a red alert state
      const intensity = 0.3 + 0.4 * Math.sin(time * 5 + position[0] + position[1]);
      matRef.current.color.setHex(0xcc3333);
      matRef.current.emissive.setHex(0xff3333);
      matRef.current.emissiveIntensity = intensity;
    } else {
      // Nominal architectural gray/white palette
      matRef.current.color.setHex(0xd1d5db); // tailwind gray-300
      matRef.current.emissive.setHex(0x000000);
      matRef.current.emissiveIntensity = 0.0;
    }
  });

  return (
    <mesh position={position} rotation={rotation}>
      {type === 'box' ? (
        <boxGeometry args={size} />
      ) : (
        <cylinderGeometry args={[size[0], size[1], size[2], 5]} />
      )}
      <meshStandardMaterial ref={matRef} roughness={0.8} metalness={0.1} />
    </mesh>
  );
};

interface ResidentialLayoutProps {
  radius: number;
  stress: number;
}

export default function ResidentialLayout({ radius, stress }: ResidentialLayoutProps) {
  const lobbyRadius = radius * 0.28;
  const wallH = 3.2; // slightly lower than floor height to avoid floor slab intersection

  const interiorItems = useMemo(() => {
    const items: any[] = [];
    
    // 1. CORRIDOR & CORE PARTITION WALLS (Enclosing the central lobby)
    const wallTh = 0.08;
    const coreDim = lobbyRadius * 2;
    
    // Outer lobby boundary walls
    items.push(<ProceduralInteriorElement key="wall-lobby-n" position={[0, wallH / 2, lobbyRadius]} size={[coreDim, wallH, wallTh]} stress={stress} />);
    items.push(<ProceduralInteriorElement key="wall-lobby-s" position={[0, wallH / 2, -lobbyRadius]} size={[coreDim, wallH, wallTh]} stress={stress} />);
    items.push(<ProceduralInteriorElement key="wall-lobby-e" position={[lobbyRadius, wallH / 2, 0]} size={[wallTh, wallH, coreDim]} stress={stress} />);
    items.push(<ProceduralInteriorElement key="wall-lobby-w" position={[-lobbyRadius, wallH / 2, 0]} size={[wallTh, wallH, coreDim]} stress={stress} />);

    // 2. INTER-APARTMENT QUADRANT PARTITION WALLS
    const partitionLen = radius - lobbyRadius;
    const partitionPos = lobbyRadius + partitionLen / 2;
    
    // East-West Division
    items.push(<ProceduralInteriorElement key="wall-part-e" position={[partitionPos, wallH / 2, 0]} size={[partitionLen, wallH, wallTh]} stress={stress} />);
    items.push(<ProceduralInteriorElement key="wall-part-w" position={[-partitionPos, wallH / 2, 0]} size={[partitionLen, wallH, wallTh]} stress={stress} />);
    
    // North-South Division
    items.push(<ProceduralInteriorElement key="wall-part-n" position={[0, wallH / 2, partitionPos]} size={[wallTh, wallH, partitionLen]} stress={stress} />);
    items.push(<ProceduralInteriorElement key="wall-part-s" position={[0, wallH / 2, -partitionPos]} size={[wallTh, wallH, partitionLen]} stress={stress} />);

    // 3. LIVING MODULE FURNITURE PLACEMENT (Divided into 4 quadrants)
    const centerOffset = radius * 0.58; // Midpoint of flat zone

    // Quadrant Coordinates
    const quads = [
      { q: "ne", cx: centerOffset, cz: centerOffset, rot: 0 },
      { q: "nw", cx: -centerOffset, cz: centerOffset, rot: Math.PI / 2 },
      { q: "sw", cx: -centerOffset, cz: -centerOffset, rot: Math.PI },
      { q: "se", cx: centerOffset, cz: -centerOffset, rot: -Math.PI / 2 }
    ];

    quads.forEach(({ q, cx, cz, rot }) => {
      // --- Living Room Zone ---
      // Sectional Sofa parts
      items.push(
        <ProceduralInteriorElement 
          key={`${q}-sofa-a`} 
          position={[cx + Math.cos(rot) * 0.8, 0.25, cz + Math.sin(rot) * 0.8]} 
          size={[1.4, 0.4, 0.6]} 
          rotation={[0, rot, 0]} 
          stress={stress} 
        />
      );
      items.push(
        <ProceduralInteriorElement 
          key={`${q}-sofa-b`} 
          position={[cx + Math.cos(rot + Math.PI/2) * 0.6, 0.25, cz + Math.sin(rot + Math.PI/2) * 0.6]} 
          size={[0.6, 0.4, 1.0]} 
          rotation={[0, rot, 0]} 
          stress={stress} 
        />
      );
      // TV Console
      items.push(
        <ProceduralInteriorElement 
          key={`${q}-tv`} 
          position={[cx - Math.cos(rot) * 1.2, 0.35, cz - Math.sin(rot) * 1.2]} 
          size={[1.0, 0.6, 0.25]} 
          rotation={[0, rot, 0]} 
          stress={stress} 
        />
      );

      // --- Bedroom Matrix ---
      const bedOffsetAngle = rot + Math.PI/4;
      const bx = cx + Math.cos(bedOffsetAngle) * 1.4;
      const bz = cz + Math.sin(bedOffsetAngle) * 1.4;
      
      // Bed Block
      items.push(
        <ProceduralInteriorElement 
          key={`${q}-bed`} 
          position={[bx, 0.3, bz]} 
          size={[1.4, 0.45, 1.8]} 
          rotation={[0, rot + Math.PI/4, 0]} 
          stress={stress} 
        />
      );
      
      // Bedside Table
      items.push(
        <ProceduralInteriorElement 
          key={`${q}-table`} 
          position={[bx - Math.cos(rot) * 1.0, 0.25, bz - Math.sin(rot) * 1.0]} 
          size={[0.35, 0.4, 0.35]} 
          rotation={[0, rot, 0]} 
          stress={stress} 
        />
      );

      // --- Kitchen Core (Placed closer to inner core utility pipes) ---
      const kx = cx - Math.cos(bedOffsetAngle) * 1.5;
      const kz = cz - Math.sin(bedOffsetAngle) * 1.5;
      items.push(
        <ProceduralInteriorElement 
          key={`${q}-kitchen-counter`} 
          position={[kx, 0.45, kz]} 
          size={[1.5, 0.85, 0.55]} 
          rotation={[0, rot + Math.PI/2, 0]} 
          stress={stress} 
        />
      );
    });

    return items;
  }, [radius, stress]);

  return <group>{interiorItems}</group>;
}
