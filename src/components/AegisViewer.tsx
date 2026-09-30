import { useMemo, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';
import { EffectComposer, HueSaturation, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import ResidentialLayout from './ResidentialLayout';

export interface StructuralConfigType {
  floorCount: number;
  profileMorph: number;
  taper: number;
  aspectRatio: number;
  buildingTwist: number;
  primaryLoadPath: 'Diagrid' | 'Outrigger' | 'Tube-in-Tube';
  coreWallThickness: number;
  pillarDensity: number;
  foundationSoilProfile: 'Bedrock' | 'Stiff Clay' | 'Loose Sand';
}

interface RoboticAgentProps {
  type: 'drone' | 'rover';
  startPos: [number, number, number];
  index: number;
  activePov: 'none' | 'drone' | 'rover';
  appendLog: (msg: string) => void;
}

interface StructuralCellProps {
  position: [number, number, number];
  size: [number, number, number];
  baseStress: number;
  isCritical: boolean;
  isOptimized: boolean;
}

interface FEMBuildingProps {
  config: StructuralConfigType;
  updateHUD: (data: {
    totalCells: number;
    criticalCells: number;
    polygonFaces: number;
    vertexCount: number;
    avgDisplacementDelta: string;
    activeTargetFloor: number;
  }) => void;
  activeScenario: { id: number; stress: number; type: string } | null;
  activePov: 'none' | 'drone' | 'rover';
  appendLog: (msg: string) => void;
  activeLayers: string[];
}

interface AegisViewerProps {
  activeScenario: { id: number; stress: number; type: string } | null;
  config: StructuralConfigType;
  activePov: 'none' | 'drone' | 'rover';
  setActivePov: (pov: 'none' | 'drone' | 'rover') => void;
  appendLog: (msg: string) => void;
  activeLayers?: string[];
}

// --- DATA-DRIVEN ROBOTICS AGENT ---
const RoboticAgent = ({ type, startPos, index, activePov, appendLog }: RoboticAgentProps) => {
  const agentRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  const isLeadAgent = index === 0;
  const isMyPov = activePov === type && isLeadAgent;
  
  useEffect(() => {
    if (isMyPov) {
      appendLog(`[POV] Switched to ${type === 'drone' ? 'Drone-Alpha' : 'Rover-B'} Sensor Feed [Coordinates Verified]`);
      if (type === 'drone') {
        appendLog(`[SENSOR] Ingesting aerial thermal gradient mapping...`);
      } else {
        appendLog(`[SENSOR] Ingesting close-range structural fracture laser-scans...`);
      }
    }
  }, [isMyPov, appendLog, type]);

  useFrame((state) => {
    if (!agentRef.current) return;
    const time = state.clock.getElapsedTime();
    
    if (type === 'drone') {
      const hoverY = startPos[1] + Math.sin(time + index) * 5;
      const radius = 22; 
      const angle = (time * 0.3) + (index * (Math.PI * 2 / 6)); 
      
      const hoverX = Math.cos(angle) * radius;
      const hoverZ = Math.sin(angle) * radius;
      
      agentRef.current.position.set(hoverX, hoverY, hoverZ);
      agentRef.current.rotation.y = -angle; 
      agentRef.current.rotation.z = Math.sin(time * 2 + index) * 0.15; 
      agentRef.current.rotation.x = Math.sin(time * 3 + index) * 0.1;
    } else if (type === 'rover') {
      const speed = 1.2;
      const maxOffset = 11.5; 
      const offset = (Math.sin(time * speed + index * 5) * maxOffset); 
      
      if (index % 2 === 0) {
        agentRef.current.position.set(offset, startPos[1] + 1.2, maxOffset); 
        agentRef.current.rotation.y = Math.PI / 2;
      } else {
        agentRef.current.position.set(-maxOffset, startPos[1] + 1.2, offset); 
        agentRef.current.rotation.y = 0;
      }
    }

    if (isMyPov) {
      const worldPos = new THREE.Vector3();
      agentRef.current.getWorldPosition(worldPos);
      
      if (type === 'drone') {
         camera.position.lerp(worldPos.clone().add(new THREE.Vector3(0, 0, 0)), 0.1);
         const targetLook = new THREE.Vector3(0, worldPos.y - 12, 0);
         const currentLook = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion).add(camera.position);
         currentLook.lerp(targetLook, 0.1);
         camera.lookAt(currentLook);
      } else {
         camera.position.lerp(worldPos.clone().add(new THREE.Vector3(0, 0.6, 0)), 0.1);
         const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(agentRef.current.quaternion);
         const targetLook = worldPos.clone().add(forward.multiplyScalar(15));
         const currentLook = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion).add(camera.position);
         currentLook.lerp(targetLook, 0.1);
         camera.lookAt(currentLook);
      }
    }
  });

  return (
    <group ref={agentRef} position={startPos}>
      {isLeadAgent && (
        <mesh position={[0, type === 'drone' ? 1.5 : 2, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial color={type === 'drone' ? "#00ffff" : "#ffaa00"} transparent opacity={0.8} wireframe />
        </mesh>
      )}

      {type === 'drone' ? (
        <>
          <mesh rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[0.5, 0.05, 16, 32]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} wireframe />
          </mesh>
          <mesh rotation={[0, Math.PI/2, 0]}>
            <torusGeometry args={[0.3, 0.03, 16, 32]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} wireframe />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
          </mesh>
          <pointLight color="#00ffff" intensity={3} distance={25} decay={2} />
        </>
      ) : (
        <>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.8, 0.4, 1.2]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
            <Edges linewidth={1} color="#444444" />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#ff3333" emissive="#ff3333" emissiveIntensity={2} wireframe />
          </mesh>
          <pointLight color="#ff3333" intensity={2} distance={15} decay={2} />
        </>
      )}
    </group>
  );
};

// --- DIAGRID BRACING COMPONENT ---
const DiagonalBrace = ({ start, end, isFemActive }: { start: [number, number, number], end: [number, number, number], isFemActive: boolean }) => {
  const { position, rotation, height } = useMemo(() => {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const dz = end[2] - start[2];
    const len = Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    const midX = (start[0] + end[0]) / 2;
    const midY = (start[1] + end[1]) / 2;
    const midZ = (start[2] + end[2]) / 2;
    
    const pitch = Math.atan2(Math.sqrt(dx*dx + dz*dz), dy);
    const yaw = Math.atan2(dx, dz);
    
    return {
      position: [midX, midY, midZ] as [number, number, number],
      rotation: [pitch, yaw, 0] as [number, number, number],
      height: len
    };
  }, [start, end]);
  
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[0.08, 0.08, height, 5]} />
      {isFemActive ? (
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} transparent opacity={0.6} />
      ) : (
        <meshStandardMaterial color="#6a6f73" metalness={0.7} roughness={0.4} />
      )}
    </mesh>
  );
};

// --- OUTRIGGER STRUCTURAL BEAM COMPONENT ---
const OutriggerBeam = ({ start, end, isFemActive }: { start: [number, number, number], end: [number, number, number], isFemActive: boolean }) => {
  const { position, rotation, length } = useMemo(() => {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const dz = end[2] - start[2];
    const len = Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    const midX = (start[0] + end[0]) / 2;
    const midY = (start[1] + end[1]) / 2;
    const midZ = (start[2] + end[2]) / 2;
    
    const pitch = Math.atan2(Math.sqrt(dx*dx + dz*dz), dy);
    const yaw = Math.atan2(dx, dz);
    
    return {
      position: [midX, midY, midZ] as [number, number, number],
      rotation: [pitch, yaw, 0] as [number, number, number],
      length: len
    };
  }, [start, end]);
  
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[0.4, length, 0.4]} />
      {isFemActive ? (
        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={1.8} transparent opacity={0.85} />
      ) : (
        <meshStandardMaterial color="#6a6f73" metalness={0.7} roughness={0.4} />
      )}
    </mesh>
  );
};

// --- FEM SUB-ELEMENT BLOCK ---
const StructuralCell = ({ position, size, baseStress, isCritical, isOptimized }: StructuralCellProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  
  const color = useMemo(() => {
    const cyan = new THREE.Color(0x00ffff);
    const red = new THREE.Color(0xff0000);
    return cyan.lerp(red, baseStress);
  }, [baseStress]);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (isCritical) {
      const time = state.clock.getElapsedTime();
      const pulse = Math.sin(time * 4 + position[1]) * 0.3; 
      
      const dirX = Math.sign(position[0]) || 1;
      const dirZ = Math.sign(position[2]) || 1;
      
      const targetX = position[0] + (dirX * (0.5 + Math.abs(pulse)));
      const targetZ = position[2] + (dirZ * (0.5 + Math.abs(pulse)));
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);
    } else {
      meshRef.current.position.set(position[0], position[1], position[2]);
    }
  });

  const currentSize = isOptimized ? [size[0] * 0.35, size[1], size[2] * 0.35] : size;
  const currentOpacity = isOptimized ? 0.18 : (isCritical ? 0.9 : 0.4);

  return (
    <group>
      <mesh ref={meshRef} position={position} onPointerOver={(e) => { e.stopPropagation(); setHover(true); }} onPointerOut={(e) => { e.stopPropagation(); setHover(false); }}>
        <boxGeometry args={currentSize as [number, number, number]} />
        <meshPhysicalMaterial 
          color={color} transparent={true} opacity={currentOpacity} 
          roughness={0.1} transmission={isOptimized ? 0.95 : 0.6} thickness={0.5} 
          emissive={color} emissiveIntensity={isOptimized ? 0.1 : (isCritical ? 2.5 : 0.2 + (hovered ? 0.8 : 0))}
        />
        <Edges linewidth={isCritical ? 3 : (isOptimized ? 1.0 : 1)} threshold={15} color={isCritical ? "red" : (isOptimized ? "rgba(0, 255, 255, 0.45)" : (hovered ? "white" : "cyan"))} />
      </mesh>
    </group>
  );
};

// --- SOLID MATTE PILLAR (STRUCTURAL FRAME LAYER Core) ---
const StructuralPillar = ({ position, size }: { position: [number, number, number], size: [number, number, number] }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#4a5054" metalness={0.5} roughness={0.7} />
      <Edges linewidth={1} threshold={15} color="#2b2d30" />
    </mesh>
  );
};

// --- CENTRAL CORE ELEVATOR SHEAR WALL ---
const CoreShearWall = ({ position, size, rotation }: { position: [number, number, number], size: [number, number, number], rotation: [number, number, number] }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#2d3238" metalness={0.3} roughness={0.8} />
      <Edges linewidth={1.5} threshold={15} color="#181a1c" />
    </mesh>
  );
};

// --- PROCEDURAL GLOWING FACADE GLASS PANEL ---
const FacadeGlassPanel = ({ p1, p2, p3, p4, opacity }: { p1: number[], p2: number[], p3: number[], p4: number[], opacity: number }) => {
  const { position, rotation, width, height } = useMemo(() => {
    const mid = [
      (p1[0] + p2[0] + p3[0] + p4[0]) / 4,
      (p1[1] + p2[1] + p3[1] + p4[1]) / 4,
      (p1[2] + p2[2] + p3[2] + p4[2]) / 4
    ];
    const dx = p2[0] - p1[0];
    const dz = p2[2] - p1[2];
    const w = Math.sqrt(dx * dx + dz * dz);
    const dy = p3[1] - p1[1]; // floor height
    const yaw = Math.atan2(dx, dz);

    return {
      position: mid as [number, number, number],
      rotation: [0, yaw, 0] as [number, number, number],
      width: w,
      height: dy
    };
  }, [p1, p2, p3, p4]);

  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[width, height, 0.05]} />
      <meshPhysicalMaterial 
        color="#006699" transparent={true} opacity={opacity} 
        roughness={0.1} metalness={0.9} transmission={0.7} ior={1.5} thickness={0.1}
        side={THREE.DoubleSide}
      />
      <Edges linewidth={0.5} threshold={15} color="#00ffcc" />
    </mesh>
  );
};

// --- PROCEDURAL NEON PIPELINE SEGMENT ---
const NeonPipeSegment = ({ start, end, color }: { start: [number, number, number], end: [number, number, number], color: string }) => {
  const { position, rotation, height } = useMemo(() => {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const dz = end[2] - start[2];
    const len = Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    const midX = (start[0] + end[0]) / 2;
    const midY = (start[1] + end[1]) / 2;
    const midZ = (start[2] + end[2]) / 2;
    
    const pitch = Math.atan2(Math.sqrt(dx*dx + dz*dz), dy);
    const yaw = Math.atan2(dx, dz);
    
    return {
      position: [midX, midY, midZ] as [number, number, number],
      rotation: [pitch, yaw, 0] as [number, number, number],
      height: len
    };
  }, [start, end]);
  
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[0.08, 0.08, height, 6]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.0} transparent opacity={0.8} />
    </mesh>
  );
};

const getFootprint = (theta: number, radius: number, morph: number, aspectRatio: number) => {
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  
  // Rectangular
  const scaleRect = 1.0 / Math.max(Math.abs(cosT), Math.abs(sinT));
  const xRect = cosT * radius * scaleRect;
  const zRect = sinT * radius * scaleRect;

  // Circular
  const xCirc = cosT * radius;
  const zCirc = sinT * radius;

  // Elliptical
  const xEll = cosT * radius * aspectRatio;
  const zEll = sinT * radius;

  // Hyperbolic Paraboloid
  const warp = 1.0 + 0.25 * Math.cos(4 * theta);
  const xHP = cosT * radius * warp * aspectRatio;
  const zHP = sinT * radius * warp;

  let x = xRect;
  let z = zRect;

  if (morph <= 1.0) {
    x = THREE.MathUtils.lerp(xRect, xCirc, morph);
    z = THREE.MathUtils.lerp(zRect, zCirc, morph);
  } else if (morph <= 2.0) {
    const t = morph - 1.0;
    x = THREE.MathUtils.lerp(xCirc, xEll, t);
    z = THREE.MathUtils.lerp(zCirc, zEll, t);
  } else {
    const t = morph - 2.0;
    x = THREE.MathUtils.lerp(xEll, xHP, t);
    z = THREE.MathUtils.lerp(zEll, zHP, t);
  }

  const yOffset = morph > 2.0 ? (morph - 2.0) * (x * x - z * z) * 0.02 : 0;

  return { x, z, yOffset };
};

// --- PROCEDURAL ARCHITECTURE GENERATOR ---
export const FEMBuilding = ({ config, updateHUD, activeScenario, activePov, appendLog, activeLayers }: FEMBuildingProps) => {
  const { elements, robots } = useMemo(() => {
    let totalCells = 0;
    let criticalCells = 0;
    const items: any[] = [];
    const robotItems: any[] = [];

    const floors = config?.floorCount || 26;
    const floorHeight = 4;
    const baseRadius = 12; 
    
    const profileMorph = config?.profileMorph ?? 1.0;
    const taper = config?.taper ?? 0.2;
    const aspectRatio = config?.aspectRatio ?? 1.0;
    const buildingTwist = config?.buildingTwist ?? 0.0;
    const primaryLoadPath = config?.primaryLoadPath || 'Diagrid';
    const coreWallThickness = config?.coreWallThickness ?? 0.3;
    const pillarDensity = config?.pillarDensity ?? 0.2;
    const foundationSoilProfile = config?.foundationSoilProfile || 'Bedrock';

    let seed = activeScenario ? activeScenario.id : 42;
    const seededRandom = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const globalStressModifier = activeScenario ? activeScenario.stress : 0.7;

    const ringRadii = [baseRadius * 0.35, baseRadius * 0.7, baseRadius];
    const ringCellCounts = [6, 10, 16];

    const floorOuterCoords: { [f: number]: [number, number, number][] } = {};
    const floorInnerCoords: { [f: number]: [number, number, number][] } = {};

    const isFemActive = activeLayers.includes("FEM_ANALYSIS");
    const isFrameActive = activeLayers.includes("STRUCTURAL_FRAME");
    const isMepActive = activeLayers.includes("MEP_UTILITIES");
    const isOuterActive = activeLayers.includes("OUTER_SKIN");
    const isInteriorActive = activeLayers.includes("LIVING_INTERIORS");

    // Dynamic Facade Opacity Calibrations
    const glassOpacity = isFemActive ? 0.15 : 0.5;

    // Generation Loop
    for (let f = 0; f < floors; f++) {
      const t = f / (floors - 1 || 1);
      const taperFactor = 1.0 - taper * t;
      const twistAngle = (buildingTwist * Math.PI / 180) * t;
      const cosTwist = Math.cos(twistAngle);
      const sinTwist = Math.sin(twistAngle);

      floorOuterCoords[f] = [];
      floorInnerCoords[f] = [];

      // Calculate representative floor stress
      let floorStress = 0.25 + globalStressModifier * 0.35;
      floorStress += (1.0 - t) * 0.35;
      if (buildingTwist > 0) {
        floorStress += Math.sin(t * Math.PI) * (buildingTwist / 360) * 0.45;
      }
      if (aspectRatio > 1.2 || aspectRatio < 0.8) {
        floorStress += t * Math.abs(aspectRatio - 1.0) * 0.3;
      }
      if (taper > 0) {
        floorStress -= t * taper * 0.2;
      }
      if (foundationSoilProfile === 'Loose Sand') {
        floorStress += (1.0 - t) * 0.15 + 0.05;
      } else if (foundationSoilProfile === 'Bedrock') {
        floorStress -= 0.1;
      }
      floorStress = Math.min(1.0, Math.max(0.0, floorStress));

      // 1. Central Core elevator wall (Shear Wall component for Structural Frame)
      if (isFrameActive) {
        const coreW = baseRadius * 0.35 * 2.0 * taperFactor;
        const coreH = floorHeight;
        const twistRad = [0, twistAngle, 0] as [number, number, number];
        const footprintCore = getFootprint(0, 0, profileMorph, aspectRatio);
        const cy = f * floorHeight + footprintCore.yOffset;
        items.push(
          <CoreShearWall 
            key={`core-wall-f${f}`} 
            position={[0, cy + floorHeight / 2, 0]} 
            size={[coreW * 0.7, coreH, coreW * 0.7]} 
            rotation={twistRad} 
          />
        );
      }

      // 2. MEP Atrium Neon Pipelines (Layer C)
      if (isMepActive) {
        // Vertical Pipes (winding inside the atrium boundary)
        const mepOffset = baseRadius * 0.22 * taperFactor;
        const pipeColors = ["#00ff66", "#00aaff", "#ff7700"]; // Green (Plumbing), Blue (HVAC), Orange (Electrical)
        
        for (let pIdx = 0; pIdx < 3; pIdx++) {
          const pipeAngle = (pIdx / 3) * Math.PI * 2;
          const footprintP = getFootprint(pipeAngle, mepOffset, profileMorph, aspectRatio);
          const py_curr = f * floorHeight + footprintP.yOffset;
          const px_curr = footprintP.x * cosTwist - footprintP.z * sinTwist;
          const pz_curr = footprintP.x * sinTwist + footprintP.z * cosTwist;

          if (f < floors - 1) {
            const nextT = (f + 1) / (floors - 1 || 1);
            const nextTaper = 1.0 - taper * nextT;
            const nextTwist = (buildingTwist * Math.PI / 180) * nextT;
            const nextMepOffset = baseRadius * 0.22 * nextTaper;
            const footprintPNext = getFootprint(pipeAngle, nextMepOffset, profileMorph, aspectRatio);
            
            const py_next = (f + 1) * floorHeight + footprintPNext.yOffset;
            const px_next = footprintPNext.x * Math.cos(nextTwist) - footprintPNext.z * Math.sin(nextTwist);
            const pz_next = footprintPNext.x * Math.sin(nextTwist) + footprintPNext.z * Math.cos(nextTwist);
            
            items.push(
              <NeonPipeSegment 
                key={`mep-vert-f${f}-p${pIdx}`} 
                start={[px_curr, py_curr, pz_curr]} 
                end={[px_next, py_next, pz_next]} 
                color={pipeColors[pIdx]} 
              />
            );
          }
        }
      }

      // 3. Grid elements
      for (let r = 0; r < 3; r++) {
        if (primaryLoadPath === 'Tube-in-Tube' && r === 1) continue;
        
        const isOutriggerFloor = Math.abs(t - 0.33) < 0.05 || Math.abs(t - 0.66) < 0.05;
        if (primaryLoadPath === 'Outrigger' && r === 1 && !isOutriggerFloor) continue;

        const currentRadius = ringRadii[r] * taperFactor;
        if (currentRadius < coreWallThickness * baseRadius * taperFactor) continue;

        const cellsPerRing = ringCellCounts[r];
        
        for (let i = 0; i < cellsPerRing; i++) {
          const theta = (i / cellsPerRing) * Math.PI * 2;
          const footprint = getFootprint(theta, currentRadius, profileMorph, aspectRatio);
          
          const y = f * floorHeight + footprint.yOffset;
          
          const x = footprint.x * cosTwist - footprint.z * sinTwist;
          const z = footprint.x * sinTwist + footprint.z * cosTwist;

          if (r === 2) floorOuterCoords[f].push([x, y, z]);
          if (r === 0) floorInnerCoords[f].push([x, y, z]);

          let localStress = 0.25 + globalStressModifier * 0.35;
          localStress += (1.0 - t) * 0.35;
          
          if (buildingTwist > 0) {
            localStress += Math.sin(t * Math.PI) * (buildingTwist / 360) * 0.45;
          }
          if (aspectRatio > 1.2 || aspectRatio < 0.8) {
            localStress += t * Math.abs(aspectRatio - 1.0) * 0.3;
          }
          if (taper > 0) {
            localStress -= t * taper * 0.2;
          }

          if (foundationSoilProfile === 'Bedrock') {
            localStress -= 0.1; 
          } else if (foundationSoilProfile === 'Stiff Clay') {
            localStress += 0.03;
          } else if (foundationSoilProfile === 'Loose Sand') {
            localStress += (1.0 - t) * 0.15 + 0.05;
          }

          if (primaryLoadPath === 'Diagrid') {
            if (r === 2) {
              const diagPattern = Math.sin(theta * 8 + f * Math.PI / 2);
              localStress += diagPattern * 0.12 - 0.08;
            } else {
              localStress -= 0.1;
            }
          } else if (primaryLoadPath === 'Outrigger') {
            if (r === 0) {
              localStress += 0.15;
            } else if (r === 2) {
              if (isOutriggerFloor) {
                localStress += 0.25;
              } else {
                localStress -= 0.12;
              }
            }
          } else if (primaryLoadPath === 'Tube-in-Tube') {
            if (r === 1) {
              localStress -= 0.3;
            } else {
              localStress += 0.08;
            }
          }

          localStress += (seededRandom() * 0.1 - 0.05);
          localStress = Math.min(1.0, Math.max(0.0, localStress));

          const isCritical = localStress > 0.85;
          const optThreshold = 0.65 * (1.0 - pillarDensity);
          const discardThreshold = optThreshold * 0.7;

          if (r !== 2 && localStress < discardThreshold) continue;

          const isOptimized = localStress < optThreshold;

          totalCells++;
          if (isCritical) criticalCells++;

          const cellW = 3.2 * taperFactor;
          const cellH = floorHeight - 0.3;

          // 3A. Solid Frame Pillars
          if (isFrameActive) {
            const pillarW = isFemActive ? cellW * 0.85 : cellW;
            const pillarH = isFemActive ? cellH * 0.99 : cellH;
            items.push(
              <StructuralPillar 
                key={`frame-p${f}-r${r}-c${i}`}
                position={[x, y, z]}
                size={[pillarW, pillarH, pillarW]}
              />
            );
          }

          // 3B. Glowing FEM Stress Sub-elements
          if (isFemActive) {
            items.push(
              <StructuralCell 
                key={`fem-c${f}-r${r}-c${i}`} 
                position={[x, y, z]} 
                size={[cellW, cellH, cellW]} 
                baseStress={localStress} 
                isCritical={isCritical} 
                isOptimized={isOptimized} 
              />
            );
          }
        }
      }

      // 4. MEP Ceiling Ring Pipelines
      if (isMepActive && f % 3 === 0 && floorOuterCoords[f].length > 0) {
        const outerCoords = floorOuterCoords[f];
        const loopCount = outerCoords.length;
        for (let i = 0; i < loopCount; i++) {
          const start = outerCoords[i];
          const end = outerCoords[(i + 1) % loopCount];
          items.push(
            <NeonPipeSegment 
              key={`mep-ceil-f${f}-s${i}`} 
              start={start} 
              end={end} 
              color="#00aaff" 
            />
          );
        }
      }

      // 5. Structural Frame / FEM Diagrid Cross-Braces
      if ((isFrameActive || isFemActive) && f < floors - 1 && floorOuterCoords[f].length > 0) {
        const outerCoordsCurrent = floorOuterCoords[f];
        const outerCoordsNext = floorOuterCoords[f+1];
        if (outerCoordsNext && outerCoordsNext.length > 0) {
          const numBraces = Math.min(4, outerCoordsCurrent.length, outerCoordsNext.length);
          for (let b = 0; b < numBraces; b++) {
            const idxCurr = Math.floor(b * (outerCoordsCurrent.length / numBraces));
            const idxNext1 = Math.floor(((b + 1) % numBraces) * (outerCoordsNext.length / numBraces));
            const idxNext2 = Math.floor(b * (outerCoordsNext.length / numBraces));
            
            const start1 = outerCoordsCurrent[idxCurr];
            const end1 = outerCoordsNext[idxNext1];
            
            const start2 = outerCoordsCurrent[idxNext1 % outerCoordsCurrent.length];
            const end2 = outerCoordsNext[idxNext2];

            if (start1 && end1) {
              items.push(<DiagonalBrace key={`diag-brace-a-f${f}-b${b}`} start={start1} end={end1} isFemActive={isFemActive} />);
            }
            if (start2 && end2) {
              items.push(<DiagonalBrace key={`diag-brace-b-f${f}-b${b}`} start={start2} end={end2} isFemActive={isFemActive} />);
            }
          }
        }
      }

      // 6. Structural Frame / FEM Outrigger Beams
      if ((isFrameActive || isFemActive) && floorOuterCoords[f].length > 0 && floorInnerCoords[f].length > 0) {
        const isOutriggerFloor = Math.abs(t - 0.33) < 0.05 || Math.abs(t - 0.66) < 0.05;
        if (isOutriggerFloor) {
          const outerC = floorOuterCoords[f];
          const innerC = floorInnerCoords[f];
          const linkCount = Math.min(4, outerC.length, innerC.length);
          for (let l = 0; l < linkCount; l++) {
            const outIdx = Math.floor(l * (outerC.length / linkCount));
            const inIdx = Math.floor(l * (innerC.length / linkCount));
            
            const start = innerC[inIdx];
            const end = outerC[outIdx];
            if (start && end) {
              items.push(<OutriggerBeam key={`outrigger-beam-f${f}-l${l}`} start={start} end={end} isFemActive={isFemActive} />);
            }
          }
        }
      }

      // 8. Procedural Residential Interiors (Layer E)
      if (isInteriorActive) {
        items.push(
          <group key={`interior-f${f}`} position={[0, f * floorHeight, 0]} rotation={[0, twistAngle, 0]}>
            <ResidentialLayout radius={baseRadius * taperFactor} stress={floorStress} />
          </group>
        );
      }
    }

    // 7. Outer Facade Glass Mesh (Layer A)
    if (isOuterActive) {
      for (let f = 0; f < floors - 1; f++) {
        const oCoords = floorOuterCoords[f];
        const oCoordsNext = floorOuterCoords[f+1];
        if (oCoords && oCoordsNext && oCoords.length > 0 && oCoordsNext.length > 0) {
          const panelCount = oCoords.length;
          for (let i = 0; i < panelCount; i++) {
            const p1 = oCoords[i];
            const p2 = oCoords[(i + 1) % panelCount];
            const p3 = oCoordsNext[i];
            const p4 = oCoordsNext[(i + 1) % panelCount];
            items.push(
              <FacadeGlassPanel 
                key={`facade-glass-f${f}-p${i}`}
                p1={p1} p2={p2} p3={p3} p4={p4}
                opacity={glassOpacity}
              />
            );
          }
        }
      }
    }

    for (let d = 0; d < 6; d++) {
      robotItems.push(<RoboticAgent key={`drone-${d}`} type="drone" startPos={[0, (floors * floorHeight) / 2, 0]} index={d} activePov={activePov} appendLog={appendLog} />);
    }
    for (let r = 0; r < 6; r++) {
      const floorTarget = Math.floor((seededRandom() * 0.5 + 0.3) * floors);
      robotItems.push(<RoboticAgent key={`rover-${r}`} type="rover" startPos={[0, floorTarget * floorHeight, 0]} index={r} activePov={activePov} appendLog={appendLog} />);
    }
    
    setTimeout(() => {
      updateHUD({
        totalCells, criticalCells, polygonFaces: totalCells * 6, vertexCount: totalCells * 8,
        avgDisplacementDelta: criticalCells > 0 ? (criticalCells * 0.45).toFixed(2) : "0.00",
        activeTargetFloor: Math.floor(globalStressModifier * floors) || 12
      });
    }, 0);

    return { elements: items, robots: robotItems };
  }, [config, updateHUD, activeScenario, activePov, appendLog, activeLayers]);

  return (
    <group position={[0, - ((config?.floorCount || 26) * 4) / 2, 0]}>
      {elements}
      {robots}
    </group>
  );
};

export default function AegisViewer({ activeScenario = null, config, activePov, setActivePov, appendLog, activeLayers = ["OUTER_SKIN", "STRUCTURAL_FRAME", "FEM_ANALYSIS"] }: AegisViewerProps) {
  const [hudData, setHudData] = useState({
    totalCells: 0, criticalCells: 0, polygonFaces: 0, vertexCount: 0, avgDisplacementDelta: "0.00", activeTargetFloor: 12
  });
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '600px', position: 'relative', backgroundColor: '#020202', overflow: 'hidden' }}>
      
      {/* HUD INTEGRATION AT BOTTOM */}
      <div style={{ 
        position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 50, 
        background: 'linear-gradient(0deg, rgba(2,5,8,0.98) 0%, rgba(2,5,8,0.85) 100%)', 
        borderTop: '2px solid #00ffff', color: '#00ffff', 
        fontFamily: '"Courier New", Courier, monospace', 
        backdropFilter: 'blur(10px)', fontSize: '11px', boxShadow: '0 -5px 20px rgba(0,255,255,0.1)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isMinimized ? 'translateY(calc(100% - 41px))' : 'translateY(0)'
      }}>
        <div onClick={() => setIsMinimized(!isMinimized)} style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: isMinimized ? 'none' : '1px solid rgba(0,255,255,0.2)' }}>
          <h3 style={{ margin: 0, letterSpacing: '2px', fontSize: '13px', textShadow: '0 0 5px #00ffff', display: 'flex', alignItems: 'center', gap: '5px' }}>
            AEGIS // MUMBAI COASTAL AUDIT // COORD: 18.9400° N, 72.8055° E <span className="animate-pulse w-2 h-4 bg-cyan-400 inline-block"></span>
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '10px', opacity: 0.8, letterSpacing: '1px' }}>{isMinimized ? 'RESTORE TELEMETRY' : 'MINIMIZE'}</span>
            <b style={{ color: '#fff', fontSize: '16px', lineHeight: '10px' }}>{isMinimized ? '[ + ]' : '[ _ ]'}</b>
          </div>
        </div>
        <div style={{ padding: '15px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'stretch', gap: '15px', opacity: isMinimized ? 0 : 1, transition: 'opacity 0.3s ease-out' }}>
          
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '15px', borderRight: '1px dashed rgba(0,255,255,0.3)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div style={{ whiteSpace: 'nowrap' }}><span style={{ opacity: 0.6 }}>ACTIVE CELLS</span><br/><b style={{ color: '#fff', fontSize: '13px' }}>{hudData.totalCells.toLocaleString()}</b></div>
              <div style={{ whiteSpace: 'nowrap' }}><span style={{ opacity: 0.6 }}>POLYGON FACES</span><br/><b style={{ color: '#fff', fontSize: '13px' }}>{hudData.polygonFaces.toLocaleString()}</b></div>
              <div style={{ whiteSpace: 'nowrap' }}><span style={{ opacity: 0.6 }}>VERTEX TOPOLOGY</span><br/><b style={{ color: '#fff', fontSize: '13px' }}>{hudData.vertexCount.toLocaleString()}</b></div>
              <div style={{ whiteSpace: 'nowrap' }}><span style={{ opacity: 0.6 }}>SYSTEM STATUS</span><br/><b style={{ color: '#00ffaa', fontSize: '13px' }}>NOMINAL</b></div>
            </div>
          </div>

          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '15px', borderRight: '1px dashed rgba(0,255,255,0.3)' }}>
            <div style={{ color: hudData.criticalCells > 0 ? '#ff3333' : '#00ffff', fontWeight: 'bold', letterSpacing: '1px' }}>ANOMALY SENSORS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: hudData.criticalCells > 0 ? '#ff3333' : '#00ffff' }}>
                <span style={{ opacity: 0.8 }}>CRITICAL LOAD CELLS:</span> 
                <b style={{ textShadow: hudData.criticalCells > 0 ? '0 0 8px red' : 'none', fontSize: '13px' }}>{hudData.criticalCells.toLocaleString()}</b>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(0,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '4px', border: '1px solid rgba(0,255,255,0.2)' }}>
                <div style={{ width: `${Math.min(100, (hudData.criticalCells / (hudData.totalCells || 1)) * 100 * 5)}%`, height: '100%', background: hudData.criticalCells > 0 ? '#ff3333' : '#00ffff', boxShadow: hudData.criticalCells > 0 ? '0 0 10px red' : '0 0 10px cyan', transition: 'width 0.5s ease-out' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: hudData.criticalCells > 0 ? '#ff3333' : '#00ffff', marginTop: '4px' }}>
                <span style={{ opacity: 0.8 }}>EXTRUSION DELTA:</span> 
                <b style={{ fontSize: '13px' }}>{hudData.avgDisplacementDelta}m</b>
              </div>
            </div>
          </div>

          <div style={{ flex: '2 1 350px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#00ffff', fontWeight: 'bold', letterSpacing: '1px' }}>INTERACTIVE POV TELEMETRY</div>
              <div onClick={() => setActivePov('none')} style={{ cursor: 'pointer', fontSize: '10px', background: activePov !== 'none' ? 'rgba(255,0,0,0.3)' : 'rgba(0,255,170,0.15)', color: activePov !== 'none' ? '#ff3333' : '#00ffaa', padding: '3px 8px', borderRadius: '3px', border: `1px solid ${activePov !== 'none' ? 'red' : 'rgba(0,255,170,0.3)'}` }}>
                {activePov !== 'none' ? 'EXIT POV MODE' : 'UPLINK SECURE'}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px', marginTop: '4px' }}>
              <div onClick={() => setActivePov(activePov === 'drone' ? 'none' : 'drone')} style={{ cursor: 'pointer', background: activePov === 'drone' ? 'rgba(0,255,255,0.2)' : 'rgba(0,0,0,0.6)', padding: '8px', borderRadius: '4px', border: activePov === 'drone' ? '1px solid #00ffff' : '1px solid rgba(0,255,255,0.2)', transition: 'all 0.2s' }}>
                <div style={{ opacity: 0.8, fontSize: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>DRONE SWARM ALPHA</span>
                  {activePov === 'drone' && <span className="animate-pulse">● REC</span>}
                </div>
                <div style={{ color: '#00ffff', fontWeight: 'bold', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px' }}>Hover-Scanning Aerial</div>
              </div>
              
              <div onClick={() => setActivePov(activePov === 'rover' ? 'none' : 'rover')} style={{ cursor: 'pointer', background: activePov === 'rover' ? 'rgba(255,170,0,0.2)' : 'rgba(0,0,0,0.6)', padding: '8px', borderRadius: '4px', border: activePov === 'rover' ? '1px solid #ffaa00' : '1px solid rgba(255,170,0,0.2)', transition: 'all 0.2s' }}>
                <div style={{ opacity: 0.8, fontSize: '10px', color: '#ffaa00', display: 'flex', justifyContent: 'space-between' }}>
                  <span>ROVER SQUADRON B</span>
                  {activePov === 'rover' && <span className="animate-pulse">● REC</span>}
                </div>
                <div style={{ color: '#ffaa00', fontWeight: 'bold', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px' }}>Pathing Internal Floor</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {activePov === 'rover' && (
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 45, pointerEvents: 'none', background: 'rgba(0,0,0,0.8)', border: '1px solid #ffaa00', padding: '15px', color: '#ffaa00', fontFamily: 'monospace', borderRadius: '4px' }}>
          <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ffaa00', paddingBottom: '5px', marginBottom: '10px' }}>INTERIOR SENSOR ARRAY</div>
          <div>Local Temp: 24.1°C</div>
          <div>Localized Strain: Floor {hudData.activeTargetFloor} / Pillar A</div>
          <div style={{ marginTop: '10px', color: '#00ffaa' }}>Active Protocols:</div>
          <div>&gt; Air Purification Mode</div>
          <div>&gt; Structural Integrity Sync</div>
        </div>
      )}

      <Canvas camera={{ position: [60, 50, 60], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#05080c']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[20, 100, 40]} intensity={2.0} color="#ffffff" />
        <pointLight position={[-40, 20, -40]} intensity={3.0} color="#00ffff" distance={150} />
        
        <FEMBuilding config={config} updateHUD={setHudData} activeScenario={activeScenario} activePov={activePov} appendLog={appendLog} activeLayers={activeLayers} />
        
        {activePov !== 'none' && (
          <EffectComposer>
            {activePov === 'drone' ? (
              <HueSaturation hue={0.5} saturation={0.8} />
            ) : (
              <HueSaturation hue={-0.2} saturation={1.5} />
            )}
            <Noise opacity={0.15} />
          </EffectComposer>
        )}

        {activePov === 'none' && <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate={true} autoRotateSpeed={0.8} maxPolarAngle={Math.PI / 1.8} />}
      </Canvas>
      
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 4px, 3px 100%', pointerEvents: 'none', zIndex: 40, opacity: activePov !== 'none' ? 0.6 : 0.3 }} />
    </div>
  );
}
