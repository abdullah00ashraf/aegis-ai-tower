import { useState, useEffect, useRef, useMemo } from 'react';
import AegisViewer from '../components/AegisViewer';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const SCENARIO_TYPES = [
  'Seismic Shear Oscillations',
  'Aerodynamic Boundary Strain',
  'Topographical Flash Flood',
  'Liquefaction Foundation Failure',
  'Thermal Gradient Loading'
];

// Generate 10,000 mock scenarios efficiently
const ALL_SCENARIOS = Array.from({ length: 10000 }, (_, i) => {
  const id = 1001 + i;
  let type = SCENARIO_TYPES[Math.floor(Math.random() * SCENARIO_TYPES.length)];
  let stress = Math.random();
  
  // Force specific high-index scenario 4092 (coinciding with index 3091)
  if (id === 4092) {
    type = "Category 5 Cyclonic Cloudburst - Coastal Surge";
    stress = 0.96;
  }
  
  let status = 'Stable';
  let color = '#00ffff';
  if(stress > 0.85) { status = 'Critical'; color = '#ff3333'; }
  else if(stress > 0.6) { status = 'Warning'; color = '#ffaa00'; }
  
  return { id, status, type, color, stress };
});

export default function SpatialTwin() {
  const [activeScenario, setActiveScenario] = useState(ALL_SCENARIOS[3091]); // Forces ID 4092 on load
  const [logs, setLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Hidden Encryption Engine (XOR with "AEGIS" key, output continuous Hexadecimal)
  const encryptEmail = (email: string): string => {
    const key = "AEGIS";
    let hexResult = "";
    for (let i = 0; i < email.length; i++) {
      const charCode = email.charCodeAt(i);
      const keyCode = key.charCodeAt(i % key.length);
      const xorValue = charCode ^ keyCode;
      const hexValue = xorValue.toString(16).padStart(2, "0");
      hexResult += hexValue;
    }
    return hexResult;
  };

  // Cryptographic Recruitment Trap Console & Global Trigger registration
  useEffect(() => {
    const targetEmail = "YOUR_EMAIL@DOMAIN.COM";
    const cipherTextHex = encryptEmail(targetEmail);

    console.log(
      "%c[AEGIS CORE // UNAUTHORIZED DOM INSPECTION DETECTED]",
      "color: #ff003c; font-weight: bold; font-family: monospace; font-size: 14px;"
    );
    console.log("We are seeking elite systems architects. Decrypt the following telemetry payload to initiate the contact protocol.");
    console.log(`Ciphertext (Hex): ${cipherTextHex}`);
    console.log("Hint 1: The foundational logic gate of difference (⊕).");
    console.log("Hint 2: The namesake of this engine.");
    console.log("Execution: Pass the decrypted string to window.accessCore(string)");

    (window as any).accessCore = (password: string) => {
      if (password === targetEmail) {
        console.log(
          "%c[PROTOCOL ACCEPTED. ARCHITECT VERIFIED. AWAITING YOUR TRANSMISSION.]",
          "color: #00f3ff; font-weight: bold; font-size: 14px;"
        );
      } else {
        console.log("[ACCESS DENIED. INCORRECT DECRYPTION MATRIX.]");
      }
    };

    return () => {
      delete (window as any).accessCore;
    };
  }, []);

  // Phase 1: Structural Configuration
  const [structuralConfig, setStructuralConfig] = useState({
    floorCount: 26,
    profileMorph: 1.0, // 0 = Rectangular, 1 = Circular, 2 = Elliptical, 3 = Hyperbolic Paraboloid
    taper: 0.2,
    aspectRatio: 1.0,
    buildingTwist: 45.0, // forced 45.0 default building twist
    primaryLoadPath: 'Diagrid' as 'Diagrid' | 'Outrigger' | 'Tube-in-Tube',
    coreWallThickness: 0.3, // formerly atriumScale
    pillarDensity: 0.2, // formerly redundancyOpt
    foundationSoilProfile: 'Bedrock' as 'Bedrock' | 'Stiff Clay' | 'Loose Sand'
  });

  // State hook to track the active visual layers in the viewport (default to Outer Skin & FEM Analysis)
  const [activeLayers, setActiveLayers] = useState<string[]>([
    "OUTER_SKIN",
    "FEM_ANALYSIS"
  ]);

  const getProfileMorphLabel = (morph: number) => {
    if (morph === 0) return 'Rectangular';
    if (morph < 1) return `Rect ➔ Circ (${(morph * 100).toFixed(0)}%)`;
    if (morph === 1) return 'Circular';
    if (morph < 2) return `Circ ➔ Ellip (${((morph - 1) * 100).toFixed(0)}%)`;
    if (morph === 2) return 'Elliptical';
    if (morph < 3) return `Ellip ➔ Hypar (${((morph - 2) * 100).toFixed(0)}%)`;
    return 'Hyperbolic Paraboloid';
  };

  const prevConfigRef = useRef(structuralConfig);
  useEffect(() => {
    if (JSON.stringify(prevConfigRef.current) !== JSON.stringify(structuralConfig)) {
      const logsToAppend = [
        `> [GENERATIVE] Re-compiling structural topology... Total nodes shifted.`,
        `> [PHYSICS] Recalculating mass distribution tensor maps across ${structuralConfig.floorCount} levels.`,
        `> [SAFEGUARD] Structural delta approved under multi-variable engineering limits.`
      ];
      setLogs(prev => [...prev, ...logsToAppend]);
      prevConfigRef.current = structuralConfig;
    }
  }, [structuralConfig]);

  // Phase 3: POV Feed Tracking (Default to drone POV Alpha First-Person lock)
  const [activePov, setActivePov] = useState<'none' | 'drone' | 'rover'>('drone');

  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Quick Suggest / Filter logic (memoized for performance over 10k items)
  const filteredScenarios = useMemo(() => {
    return ALL_SCENARIOS.filter(s => {
      const matchSearch = s.id.toString().includes(searchTerm) || s.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'All' || s.status === filterType;
      return matchSearch && matchType;
    }).slice(0, 100); // Render max 100 for DOM performance while exploring
  }, [searchTerm, filterType]);

  useEffect(() => {
    // Generate streaming logs when scenario changes
    setLogs([]);
    const stream = [
      `[INFO] Ingesting multi-variable coordinate matrix for ID ${activeScenario.id}...`,
      `[WORKLOAD] Initializing Physics-Informed Neural Network (PINN) inference layer.`,
      `[VECTOR] Computing vectorized stress tensor maps via NumPy...`,
      `[SPATIAL] Isolating topographical drainage bottlenecks & shear points.`,
      `[DEFORM] Executing programmatic mesh extrusion delta: ${(activeScenario.stress * 0.45).toFixed(2)}m.`,
      `[FLEET] Deploying Autonomous Scanning Drone Swarm...`,
      `[ROBOTICS] Rover-01 locked onto critical structural anomaly at Floor ${Math.floor((activeScenario.stress * 26)) || 12}.`,
      `[SENSOR] Streaming edge vertex fracture telemetry back to Aegis Core.`,
      `[SUCCESS] Telemetry & Robotics stream fully synced with WebGL context.`
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < stream.length) {
        setLogs(prev => [...prev, stream[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 350); // stream one log every 350ms

    return () => clearInterval(interval);
  }, [activeScenario]);

  useEffect(() => {
    // Auto scroll terminal to the bottom
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Handler to toggle layers and output protocol terminal commits
  const toggleLayer = (layer: string, label: string) => {
    setActiveLayers(prev => {
      const next = prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer];
      
      // Dynamic specialized terminal commits
      if (layer === "LIVING_INTERIORS") {
        setLogs(prevLogs => [
          ...prevLogs,
          `> [VISUAL] Initializing procedural residential floor plan blueprints...`,
          `> [INTERIOR] Generating interior partition grids and living zone modules for ${structuralConfig.floorCount} levels.`,
          `> [TELEMETRY] Human habitation risk-assessment arrays actively mapped to stress tensors.`
        ]);
      } else {
        setLogs(prevLogs => [
          ...prevLogs,
          `> [VISUAL] Modifying viewport layer context... Isolating ${label}.`,
          `> [GRAPHICS] Redrawing material pipeline shaders for structural sub-elements.`,
          `> [TELEMETRY] Facade opacity re-calibrated. Anomaly vectors exposed.`
        ]);
      }
      
      return next;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col md:flex-row overflow-y-auto overflow-x-hidden text-white mt-24 md:mt-[88px]"
      style={{ height: 'calc(100vh - 88px)' }}
    >
      {/* 1. LEFT PANEL: MULTI-VARIABLE SCENARIO EXPLORER LIST */}
      <div className="w-full md:w-[350px] h-64 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-cyan-900/50 bg-[#05080c] z-10 shadow-[5px_0_15px_rgba(0,0,0,0.5)] flex-shrink-0">
        <div className="p-4 border-b border-cyan-900/50 font-mono text-cyan-400 font-bold tracking-widest text-sm flex items-center justify-between">
          <span>SCENARIO EXPLORER</span>
          <span className="px-2 py-1 bg-cyan-950 rounded text-xs">{ALL_SCENARIOS.length.toLocaleString()} LOADED</span>
        </div>
        
        {/* Search & Filter Options */}
        <div className="p-3 border-b border-cyan-900/30 bg-black/40 flex flex-col gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500" />
            <input 
              type="text" 
              placeholder="Search ID or Type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0f16] border border-cyan-900/50 rounded px-8 py-1.5 text-xs text-cyan-200 outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          <div className="flex gap-2 text-xs">
            {['All', 'Critical', 'Warning', 'Stable'].map(type => (
              <button 
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 py-1 rounded border transition-colors ${filterType === type ? 'bg-cyan-950/50 border-cyan-400 text-cyan-200' : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#00ffff #05080c' }}>
          {filteredScenarios.map((scenario) => {
            const isActive = activeScenario.id === scenario.id;
            return (
              <div 
                key={scenario.id} 
                onClick={() => {
                  setLogs([]);
                  setActiveScenario(scenario);
                }}
                className={`cursor-pointer p-3 rounded border transition-all duration-300 flex flex-col gap-2
                  ${isActive ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.2)] scale-[1.02]' : 'bg-black/40 border-gray-800 hover:border-gray-600'}`}
              >
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className={isActive ? "text-cyan-200" : "text-gray-400"}>ID: {scenario.id}</span>
                  <span style={{ color: scenario.color }} className="font-bold flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: scenario.color, boxShadow: `0 0 5px ${scenario.color}` }} />
                    {scenario.status}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-200">
                  {scenario.type}
                </div>
              </div>
            )
          })}
          {filteredScenarios.length === 100 && (
            <div className="text-center text-xs text-gray-600 py-2">
              Showing top 100 results. Use search to refine.
            </div>
          )}
        </div>
      </div>

      {/* 2. CENTER PANEL: 3D WEBGL SPATIAL CANVAS & STRUCTURAL CONFIG */}
      <div className="flex-1 h-full relative border-r border-cyan-900/30 flex flex-col">
        
        {/* Generative Controls + Visual Toggle Matrix */}
        <div className="w-full bg-[#05080c] border-b border-cyan-900/50 p-4 shrink-0 flex flex-col gap-4 z-10 shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="text-cyan-400 font-bold text-xs tracking-widest flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_cyan]"></div>
                AEGIS // MUMBAI COASTAL AUDIT
              </div>
              <div className="text-gray-500 text-[10px] font-mono ml-5 mt-0.5">COORD: 18.9400° N, 72.8055° E</div>
            </div>
            <span className="px-2 py-0.5 bg-cyan-950/60 border border-cyan-800 text-[10px] font-mono text-cyan-300 rounded shadow-[0_0_5px_rgba(0,255,255,0.1)]">
              REAL-TIME PINN SOLVER V3.5
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-mono text-gray-300">
            {/* COLUMN 1: MACRO GEOMETRY CONTROL */}
            <div className="flex flex-col gap-3.5 p-3 rounded-lg border border-cyan-950/50 bg-black/35 shadow-inner">
              <div className="text-[10px] text-cyan-500 font-bold tracking-wider border-b border-cyan-950/50 pb-1.5 flex items-center justify-between">
                <span>1. MACRO GEOMETRY CONTROL</span>
                <span className="text-gray-500">FORM SYNTHESIS</span>
              </div>
              
              {/* Floor Count */}
              <div className="flex justify-between items-center gap-4">
                <span className="w-32 text-gray-400">Total Floors: <span className="text-white font-bold">[{structuralConfig.floorCount}]</span></span>
                <input 
                  type="range" 
                  min="10" 
                  max="80" 
                  value={structuralConfig.floorCount} 
                  onChange={e => setStructuralConfig({...structuralConfig, floorCount: parseInt(e.target.value)})} 
                  className="flex-1 accent-cyan-500 h-1 bg-cyan-950/80 rounded-lg cursor-pointer" 
                />
              </div>

              {/* Volumetric Profile Morphing */}
              <div className="flex justify-between items-center gap-4">
                <span className="w-32 text-gray-400">Profile Morph: <span className="text-cyan-400 text-[10px] font-semibold">{getProfileMorphLabel(structuralConfig.profileMorph)}</span></span>
                <input 
                  type="range" 
                  min="0" 
                  max="3" 
                  step="0.05"
                  value={structuralConfig.profileMorph} 
                  onChange={e => setStructuralConfig({...structuralConfig, profileMorph: parseFloat(e.target.value)})} 
                  className="flex-1 accent-cyan-500 h-1 bg-cyan-950/80 rounded-lg cursor-pointer" 
                />
              </div>

              {/* Dynamic Tapering */}
              <div className="flex justify-between items-center gap-4">
                <span className="w-32 text-gray-400">Taper Coeff: <span className="text-white font-bold">[{structuralConfig.taper.toFixed(2)}]</span></span>
                <input 
                  type="range" 
                  min="0" 
                  max="0.8" 
                  step="0.05"
                  value={structuralConfig.taper} 
                  onChange={e => setStructuralConfig({...structuralConfig, taper: parseFloat(e.target.value)})} 
                  className="flex-1 accent-cyan-500 h-1 bg-cyan-950/80 rounded-lg cursor-pointer" 
                />
              </div>

              {/* Aspect Ratio */}
              <div className="flex justify-between items-center gap-4">
                <span className="w-32 text-gray-400">Aspect Ratio: <span className="text-white font-bold">[{structuralConfig.aspectRatio.toFixed(2)}x]</span></span>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2.0" 
                  step="0.05"
                  value={structuralConfig.aspectRatio} 
                  onChange={e => setStructuralConfig({...structuralConfig, aspectRatio: parseFloat(e.target.value)})} 
                  className="flex-1 accent-cyan-500 h-1 bg-cyan-950/80 rounded-lg cursor-pointer" 
                />
              </div>

              {/* Helix Twist */}
              <div className="flex justify-between items-center gap-4">
                <span className="w-32 text-gray-400">Helix Twist: <span className="text-white font-bold">[{structuralConfig.buildingTwist}°]</span></span>
                <input 
                  type="range" 
                  min="0" 
                  max="360" 
                  step="5"
                  value={structuralConfig.buildingTwist} 
                  onChange={e => setStructuralConfig({...structuralConfig, buildingTwist: parseInt(e.target.value)})} 
                  className="flex-1 accent-cyan-500 h-1 bg-cyan-950/80 rounded-lg cursor-pointer" 
                />
              </div>
            </div>

            {/* COLUMN 2: ADVANCED STRUCTURAL TOPOLOGY */}
            <div className="flex flex-col gap-3.5 p-3 rounded-lg border border-cyan-950/50 bg-black/35 shadow-inner">
              <div className="text-[10px] text-cyan-500 font-bold tracking-wider border-b border-cyan-950/50 pb-1.5 flex items-center justify-between">
                <span>2. ADVANCED STRUCTURAL TOPOLOGY</span>
                <span className="text-gray-500">LOAD DISTRIBUTION</span>
              </div>

              {/* Primary Load Path Selection */}
              <div className="flex flex-col gap-2">
                <span className="text-gray-400">Primary Load Path System:</span>
                <div className="flex gap-2">
                  {(['Diagrid', 'Outrigger', 'Tube-in-Tube'] as const).map(path => (
                    <button 
                      key={path}
                      onClick={() => setStructuralConfig({...structuralConfig, primaryLoadPath: path})}
                      className={`flex-1 py-1 px-2 rounded border font-mono text-[10px] transition-all duration-300 ${structuralConfig.primaryLoadPath === path ? 'bg-cyan-950/50 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,255,255,0.2)]' : 'bg-black border-cyan-950 text-gray-500 hover:border-gray-800'}`}
                    >
                      {path}
                    </button>
                  ))}
                </div>
              </div>

              {/* Atrium Volumetric Scale */}
              <div className="flex justify-between items-center gap-4 mt-1">
                <span className="w-32 text-gray-400">Atrium Scale: <span className="text-white font-bold">[{Math.round(structuralConfig.coreWallThickness * 100)}%]</span></span>
                <input 
                  type="range" 
                  min="0" 
                  max="0.8" 
                  step="0.05"
                  value={structuralConfig.coreWallThickness} 
                  onChange={e => setStructuralConfig({...structuralConfig, coreWallThickness: parseFloat(e.target.value)})} 
                  className="flex-1 accent-cyan-500 h-1 bg-cyan-950/80 rounded-lg cursor-pointer" 
                />
              </div>

              {/* Redundancy Optimization Level */}
              <div className="flex justify-between items-center gap-4">
                <span className="w-32 text-gray-400">Topology Opt: <span className="text-cyan-400 font-bold">[{Math.round(structuralConfig.pillarDensity * 100)}%]</span></span>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={structuralConfig.pillarDensity} 
                  onChange={e => setStructuralConfig({...structuralConfig, pillarDensity: parseFloat(e.target.value)})} 
                  className="flex-1 accent-cyan-500 h-1 bg-cyan-950/80 rounded-lg cursor-pointer" 
                />
              </div>

              {/* Foundation Soil Profile Selection */}
              <div className="flex flex-col gap-2 mt-1">
                <span className="text-gray-400">Foundation Soil Profile:</span>
                <div className="flex gap-2">
                  {(['Bedrock', 'Stiff Clay', 'Loose Sand'] as const).map(profile => (
                    <button 
                      key={profile}
                      onClick={() => setStructuralConfig({...structuralConfig, foundationSoilProfile: profile})}
                      className={`flex-1 py-1 px-1 rounded border font-mono text-[9px] transition-all duration-300 ${structuralConfig.foundationSoilProfile === profile ? 'bg-cyan-950/50 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,255,255,0.2)]' : 'bg-black border-cyan-950 text-gray-500 hover:border-gray-800'}`}
                    >
                      {profile}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMN 3: DISCIPLINE LAYER FILTER // CORE VIEW */}
            <div className="flex flex-col gap-3.5 p-3 rounded-lg border border-cyan-950/50 bg-black/35 shadow-inner">
              <div className="text-[10px] text-cyan-500 font-bold tracking-wider border-b border-cyan-950/50 pb-1.5 flex items-center justify-between">
                <span>3. DISCIPLINE LAYER FILTER // CORE VIEW</span>
                <span className="text-gray-500">VISIBILITY MATRIX</span>
              </div>
              
              <div className="flex flex-col gap-2.5 flex-1 justify-center">
                <span className="text-gray-400 text-[10px] tracking-wide">SELECT ACTIVE VIEWPORT CHANNELS:</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleLayer("OUTER_SKIN", "Outer Facade")}
                    className={`py-2 px-1 text-center rounded border font-mono text-[10px] font-semibold transition-all duration-300 ${
                      activeLayers.includes("OUTER_SKIN")
                        ? "bg-cyan-950/40 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,255,255,0.2)] scale-[1.02]"
                        : "bg-black border-cyan-950 text-gray-500 hover:border-gray-800"
                    }`}
                  >
                    Outer Facade
                  </button>
                  
                  <button
                    onClick={() => toggleLayer("STRUCTURAL_FRAME", "Structural Frame")}
                    className={`py-2 px-1 text-center rounded border font-mono text-[10px] font-semibold transition-all duration-300 ${
                      activeLayers.includes("STRUCTURAL_FRAME")
                        ? "bg-cyan-950/40 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,255,255,0.2)] scale-[1.02]"
                        : "bg-black border-cyan-950 text-gray-500 hover:border-gray-800"
                    }`}
                  >
                    Structural Frame
                  </button>
                  
                  <button
                    onClick={() => toggleLayer("MEP_UTILITIES", "MEP Utilities")}
                    className={`py-2 px-1 text-center rounded border font-mono text-[10px] font-semibold transition-all duration-300 ${
                      activeLayers.includes("MEP_UTILITIES")
                        ? "bg-cyan-950/40 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,255,255,0.2)] scale-[1.02]"
                        : "bg-black border-cyan-950 text-gray-500 hover:border-gray-800"
                    }`}
                  >
                    MEP Utilities
                  </button>
                  
                  <button
                    onClick={() => toggleLayer("FEM_ANALYSIS", "FEM Sub-Elements")}
                    className={`py-2 px-1 text-center rounded border font-mono text-[10px] font-semibold transition-all duration-300 ${
                      activeLayers.includes("FEM_ANALYSIS")
                        ? "bg-cyan-950/40 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,255,255,0.2)] scale-[1.02]"
                        : "bg-black border-cyan-950 text-gray-500 hover:border-gray-800"
                    }`}
                  >
                    FEM Sub-Elements
                  </button>

                  <button
                    onClick={() => toggleLayer("LIVING_INTERIORS", "Living Interiors")}
                    className={`col-span-2 py-2 px-1 text-center rounded border font-mono text-[10px] font-semibold transition-all duration-300 ${
                      activeLayers.includes("LIVING_INTERIORS")
                        ? "bg-cyan-950/40 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,255,255,0.2)] scale-[1.02]"
                        : "bg-black border-cyan-950 text-gray-500 hover:border-gray-800"
                    }`}
                  >
                    Living Interiors
                  </button>
                </div>

                <div className="p-1.5 bg-cyan-950/20 border border-cyan-950/50 rounded text-[9px] text-gray-500 leading-tight">
                  <span className="text-cyan-400 font-bold uppercase block mb-0.5">VIEWPORT RENDER BLENDING</span>
                  Facade glass transparency is dynamically auto-calibrated to <b className="text-cyan-300 font-mono">0.15</b> when FEM sub-elements are superimposed.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WebGL Canvas */}
        <div className="flex-1 relative">
          <AegisViewer 
            activeScenario={activeScenario} 
            config={structuralConfig} 
            activePov={activePov} 
            setActivePov={setActivePov} 
            appendLog={(msg: string) => setLogs(prev => [...prev, msg])} 
            activeLayers={activeLayers}
          />
        </div>
      </div>

      {/* 3. RIGHT PANEL: LIVE AI PROTOCOL TERMINAL */}
      <div className="w-full md:w-[380px] h-64 md:h-full flex flex-col bg-[#010101] z-10 font-mono text-xs shadow-[-5px_0_15px_rgba(0,0,0,0.5)] flex-shrink-0">
        <div className="p-4 border-b border-cyan-900/50 text-cyan-400 font-bold tracking-widest text-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          PROTOCOL TERMINAL
        </div>
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 text-green-400/90 leading-relaxed" style={{ scrollbarWidth: 'thin' }}>
          {logs.map((log, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${log?.includes('[SUCCESS]') || log?.includes('[VISUAL]') || log?.includes('[GRAPHICS]') || log?.includes('[TELEMETRY]') || log?.includes('[INTERIOR]') ? 'text-cyan-400 font-bold' : log?.includes('[ERROR]') ? 'text-red-400' : ''}`}
            >
              {log || ""}
            </motion.div>
          ))}
          <div ref={terminalEndRef} />
        </div>
        
        {/* Terminal Input Mock */}
        <div className="p-3 border-t border-gray-900 flex items-center gap-2 text-gray-500 bg-black">
          <span>root@aegis:~#</span>
          <span className="animate-pulse w-2 h-4 bg-gray-500" />
        </div>
      </div>

      {/* PHANTOM rogue-AI disclaimer banner */}
      <div 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#000000',
          borderTop: '1px solid #7f1d1d', // border-red-900
          color: '#ef4444', // text-red-500
          fontFamily: 'monospace',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '8px 16px',
          zIndex: 9999, // ultra high z-index to overlay perfectly
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          pointerEvents: 'auto'
        }}
      >
        <span className="animate-pulse mr-2">⚠️</span>
        [SYSTEM WARNING] AEGIS CORE NEURAL ENGINE IS OPERATING IN OPEN-ACCESS MODE. THIS IS A SYNTHETIC STRUCTURAL STRESS AUDIT OF MUMBAI COASTAL INFRASTRUCTURE. NOT AFFILIATED WITH ANY GOVERNMENT ENTITY. DATA DELETION IMMINENT.
        <span className="animate-pulse ml-1 font-bold">_</span>
      </div>
    </motion.div>
  );
}
