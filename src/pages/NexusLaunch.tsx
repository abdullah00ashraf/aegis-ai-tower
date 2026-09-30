import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FEMBuilding } from '../components/AegisViewer';
import { ZeroTrustBridge } from '../lib/ZeroTrustBridge';
import { useSovereignNode } from '../hooks/useSovereignNode';
import GenerativeWGSLCanvas from '../components/GenerativeWGSLCanvas';

// Structural topologic configurations matching Phase 1 Shock State
const passiveConfig = {
  floorCount: 26,
  profileMorph: 1.5, // Intermediate morph state
  taper: 0.25,
  aspectRatio: 1.25,
  buildingTwist: 60.0, // High twist deeptech aesthetic
  primaryLoadPath: 'Diagrid' as const,
  coreWallThickness: 0.4,
  pillarDensity: 0.7,
  foundationSoilProfile: 'Loose Sand' as const
};

// Shock state scenario trigger: glowing red alert FEM load cells
const passiveScenario = {
  id: 9091,
  status: 'Critical',
  type: 'Phase 1 Shock State - Global Broadcast Target',
  stress: 0.98, // Maximum structural strain for full red load highlight
  color: '#ff3333'
};

const activeLayers = ["STRUCTURAL_FRAME", "FEM_ANALYSIS"];

export default function NexusLaunch() {
  const isVoiceLocked = true; // Temporary lock for speech transmit HUD
  const [inputValue, setInputValue] = useState('');
  const [statusState, setStatusState] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'FAILURE'>('IDLE');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isBridgeActive, setIsBridgeActive] = useState(false);
  const [flashRed, setFlashRed] = useState(false);

  // Phase 3: Dynamic Command & Geospatial Canvas States
  const [agentInput, setAgentInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [mapActive, setMapActive] = useState(false);
  const [mapCoords, setMapCoords] = useState<[number, number] | null>(null);
  const [wgslCode, setWgslCode] = useState<string | null>(null);
  const [wgslActive, setWgslActive] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Real-time audio ingestion and traffic controller hooks
  // Tunnel connection and mic downsamplers are dormant until isUnlocked === true
  const {
    isTransmitting,
    aiVoiceEnergy,
    offlineAlert,
    startRecording,
    stopRecording,
    sendCLICommand
  } = useSovereignNode(isUnlocked, (msg) => {
    if (msg.type === 'VISUAL_LOG') {
      setTerminalLogs(prev => [...prev, msg.log]);
    } else if (msg.type === 'TEXT_SEGMENT') {
      setTerminalLogs(prev => [...prev, `[MASTER_AI] ${msg.text}`]);
      setIsThinking(false);
    } else if (msg.type === 'RENDER_MAP') {
      const lat = Number(msg.latitude);
      const lng = Number(msg.longitude);
      setTerminalLogs(prev => [...prev, `[SYSTEM] Rendering spatial overlay at coordinates [${lat}, ${lng}].`]);
      setWgslActive(false);
      setMapActive(true);
      setMapCoords([lat, lng]);
      setIsThinking(false);
    } else if (msg.type === 'TOOL_EXECUTION' && msg.action === 'RENDER_WGSL') {
      const code = msg.code || '';
      setTerminalLogs(prev => [...prev, `[SYSTEM] Generative WebGPU Shader Program compiled and dispatched.`]);
      setMapActive(false);
      setWgslCode(code);
      setWgslActive(true);
      setIsThinking(false);
    }
  });

  // Sync state with ZeroTrustBridge
  useEffect(() => {
    ZeroTrustBridge.setBridgeActive(isBridgeActive);
  }, [isBridgeActive]);

  // Handle auto-scroll of logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Listen for Spacebar transmission commands
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Direct speech capture is disabled until the system is unlocked
      if (!isUnlocked) return;
      
      // Avoid intercepting keystrokes if the user is actively typing inside either text input box
      if (document.activeElement === inputRef.current || document.activeElement instanceof HTMLInputElement) return;
      
      if (e.code === 'Space') {
        if (isVoiceLocked) return;
        e.preventDefault();
        startRecording();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!isUnlocked) return;
      
      if (e.code === 'Space') {
        if (isVoiceLocked) return;
        e.preventDefault();
        stopRecording();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isUnlocked, startRecording, stopRecording]);

  // Critical offline connectivity logger alerts
  useEffect(() => {
    if (offlineAlert) {
      setTerminalLogs(prev => [
        ...prev,
        `[SYSTEM_ALERT] CORE SOVEREIGN INTELLIGENCE DISCONNECTED.`
      ]);
    }
  }, [offlineAlert]);

  // Initial cinematic boot sequence
  useEffect(() => {
    const bootLogs = [
      '[SYS_BOOT] INITIALIZING AIR-GAPPED HANDSHAKE RESOLUTION NODE...',
      '[SYS_BOOT] ESTABLISHING SHIELD MATRIX [STRICT ZERO TRUST]...',
      '[SYS_BOOT] OUTBOUND TELEMETRY INHIBITED. ZERO-TRUST GATE ACTIVE.',
      '[SYS_BOOT] DETECTED TARGET ENVELOPE: ws://127.0.0.1:4000/handshake',
      '[SYS_BOOT] IDENTITY SIGNATURE ENGINE: SHA-256 / AES-256 PRE-VERIFIER.',
      '[SYS_BOOT] DEPLOYMENT STATE: SECURE GATEWAY ENCRYPTED.',
      '[SYS_BOOT] ENTER VERIFICATION KEY FOR LAUNCH PROTOCOL AUTHORIZATION.'
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < bootLogs.length) {
        const nextLog = bootLogs[currentLogIndex];
        setTerminalLogs(prev => [...prev, nextLog]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const handleToggleBridge = () => {
    const newState = !isBridgeActive;
    setIsBridgeActive(newState);
    const time = new Date().toTimeString().split(' ')[0];
    setTerminalLogs(prev => [
      ...prev,
      `[${time}] [TELEMETRY_BRIDGE] INTERACTIVE TOGGLE TRIPPED. STATE: ${newState ? 'ACTIVE (SIGNAL BROADCAST ENABLED)' : 'DORMANT (SHIELD ENGAGED)'}`
    ]);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || statusState === 'PROCESSING') return;

    const submittedKey = inputValue.trim();
    setInputValue('');
    setStatusState('PROCESSING');
    
    const timestamp = new Date().toTimeString().split(' ')[0];
    
    // Append initial resolution logs
    setTerminalLogs(prev => [
      ...prev,
      `[${timestamp}] [IHCP_RESOLVER] INPUT REGISTERED: ${'*'.repeat(submittedKey.length)}`,
      `[${timestamp}] [IHCP_RESOLVER] INITIALIZING HANDSHAKE RESOLUTION...`,
      `[${timestamp}] [IHCP_RESOLVER] PARSING CRYPTOGRAPHIC SEGMENTS...`
    ]);

    // Simulate 1500ms cryptographic validation latency
    setTimeout(async () => {
      const isValid = submittedKey === '0xAEGIS_NEXUS_ALPHA_2026' || 
                      submittedKey === 'AEGIS-NEXUS-LAUNCH' ||
                      submittedKey === 'HEX-99F2-A8D1-3BC0';
      
      const bridgeRes = await ZeroTrustBridge.initializeSecureBridge(submittedKey);
      const postTimestamp = new Date().toTimeString().split(' ')[0];

      if (isValid) {
        setStatusState('SUCCESS');
        setTerminalLogs(prev => [
          ...prev,
          `[${postTimestamp}] [IHCP_DECRYPTOR] MATCH FOUND: AEGIS CORPORATE LAUNCH PORTAL IDENTITY VERIFIED.`,
          `[${postTimestamp}] [IHCP_DECRYPTOR] TELEMETRY DISPATCH: ${bridgeRes ? 'SUCCESSFUL CONNECTION ESTABLISHED' : 'BLOCKED (BRIDGE DORMANT)'}`,
          `[${postTimestamp}] [IHCP_DECRYPTOR] DECRYPTION COMPLETE. IDENTITY VERIFIED. LAUNCH PIPELINE INITIALIZED. STANDBY FOR BROADCAST ENGINE STREAM...`
        ]);

        // Transition from verification overlay into the active cockpit HUD after 2500ms
        setTimeout(() => {
          setIsUnlocked(true);
          setTerminalLogs(prev => [
            ...prev,
            `[${postTimestamp}] [MASTER_AI] CONTEXT ENGINE INITIALIZED.`,
            `[${postTimestamp}] [MASTER_AI] SOVEREIGN NODE ONLINE. AWAITING EXECUTIVE STIMULUS.`,
            `[${postTimestamp}] [MASTER_AI] UPLINK READY. HOLD SPACEBAR TO SPEAK.`
          ]);
        }, 2500);

      } else {
        setStatusState('FAILURE');
        setFlashRed(true);
        setTerminalLogs(prev => [
          ...prev,
          `[${postTimestamp}] [IHCP_DECRYPTOR] ERR_UNAUTHORIZED: DECRYPTION MATRIX COLLAPSED. INCORRECT SIGNATURE PROTOCOL.`
        ]);
        
        // Flash border for 500ms
        setTimeout(() => {
          setFlashRed(false);
          setStatusState('IDLE');
        }, 500);
      }
    }, 1500);
  };

  // Phase 3: Persistent user CLI command submission logic
  const handleAgentCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentInput.trim() || isThinking) return;

    const cmd = agentInput.trim();
    setAgentInput('');
    setIsThinking(true);

    const timestamp = new Date().toTimeString().split(' ')[0];

    // 1. Append user command to logs in distinct white text
    setTerminalLogs(prev => [
      ...prev,
      `[${timestamp}] [USER_DIRECTIVE] sys-admin:~$ ${cmd}`
    ]);

    // 2. Append pulsing AI thinking state
    setTerminalLogs(prev => [
      ...prev,
      `[MASTER_AI] PARSING DIRECTIVE...`
    ]);

    // 3. Dispatch the command via WebSocket to the Gemini Core backend
    sendCLICommand(cmd);
    
    // Auto-clear the pulsing directive line after 1200ms
    setTimeout(() => {
      setTerminalLogs(prev => prev.filter(log => !log.includes('PARSING DIRECTIVE...')));
    }, 1200);
  };



  // Dynamic visual mesh scale pulse driven by real-time voice amplitude energy
  const meshScale = 1 + aiVoiceEnergy * 0.45;

  return (
    <div className="h-screen w-screen bg-[#020305] text-cyan-500 overflow-hidden font-mono select-none relative">
      {/* CSS injection for CRT scanning, caret blinking, and radar spins */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes caretPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes radarSweepSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .caret-blink {
          animation: caretPulse 1s infinite;
        }
        .radar-sweep-spin {
          animation: radarSweepSpin 4s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        .cyber-grid {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(6, 182, 212, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
        }
      `}} />

      {/* 1. CINEMATIC BACKGROUND WebGL mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [40, 25, 40], fov: 42 }} dpr={[1, 2]}>
          <color attach="background" args={['#020305']} />
          <ambientLight intensity={0.55} />
          <directionalLight position={[10, 60, 20]} intensity={1.8} color="#ffffff" />
          <pointLight position={[-30, 20, -30]} intensity={3.5} color="#ff3333" distance={120} />
          
          <group scale={[meshScale, meshScale, meshScale]}>
            <FEMBuilding 
              config={passiveConfig} 
              updateHUD={() => {}} 
              activeScenario={passiveScenario} 
              activePov="none" 
              appendLog={() => {}} 
              activeLayers={activeLayers} 
            />
          </group>
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={false} 
            autoRotate={true} 
            autoRotateSpeed={0.9} 
          />
        </Canvas>

        {/* Global Dark Vignette overlays */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/40 to-black/85" />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.95)]" />
      </div>

      {/* 2. ABSOLUTE DOM OVERLAY */}
      <div className={`absolute inset-0 z-50 flex p-6 md:p-8 pointer-events-none transition-all duration-700 ${
        isUnlocked 
          ? 'flex-col lg:flex-row gap-6 items-stretch justify-center h-full w-full' 
          : 'items-center justify-center'
      }`}>
        
        {/* LEFT COLUMN: THE COMMAND NODE (40% width on split, centered slab otherwise) */}
        <div className={`backdrop-blur-3xl border transition-all duration-700 rounded-2xl p-12 flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_35px_rgba(6,182,212,0.06)] relative pointer-events-auto ${
          flashRed 
            ? 'border-red-900 bg-red-950/20' 
            : 'border-white/5 bg-black/70'
        } ${
          isUnlocked 
            ? 'lg:w-[40%] w-full h-[calc(100vh-100px)]' 
            : 'w-[90vw] max-w-2xl'
        }`}>
          
          {/* Subtle Telemetry Toggle switch at top right */}
          <div className="absolute top-10 right-10 flex items-center gap-2">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">telemetry shield</span>
            <button
              onClick={handleToggleBridge}
              type="button"
              className={`w-7 h-4 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                isBridgeActive ? 'bg-cyan-500/80' : 'bg-zinc-800'
              }`}
              aria-label="Toggle Telemetry Bridge"
            >
              <div
                className={`bg-black w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${
                  isBridgeActive ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Minimalist Header */}
          <header className="flex flex-col">
            <h1 className="text-white font-sans text-xl tracking-[0.3em] font-light mb-2">AEGIS NEXUS</h1>
            <p className="text-cyan-500/70 font-mono text-xs tracking-widest mb-8">[ SECURE LAUNCH GATEWAY // ZERO-TRUST PROTOCOL ]</p>
          </header>

          {/* Scrollable logs */}
          <div className="flex-1 min-h-[140px] max-h-[180px] overflow-y-auto mb-4 space-y-1.5 custom-scrollbar pr-2 font-mono text-xs leading-relaxed">
            {terminalLogs.map((log, index) => {
              if (!log) return null;
              let colorClass = 'text-gray-400';
              if (log.includes('ERR_UNAUTHORIZED')) colorClass = 'text-red-500 font-medium';
              if (log.includes('IDENTITY VERIFIED')) colorClass = 'text-green-400 font-medium';
              if (log.includes('TELEMETRY_BRIDGE')) colorClass = 'text-yellow-500/80';
              if (log.includes('[SYS_BOOT]')) colorClass = 'text-gray-500';
              if (log.includes('[SYSTEM_ALERT]')) colorClass = 'text-red-400 font-bold';
              if (log.includes('[MASTER_AI]')) colorClass = 'text-cyan-400 font-bold';
              if (log.includes('PARSING DIRECTIVE...')) colorClass = 'text-cyan-500/60 animate-pulse';
              if (log.includes('[USER_DIRECTIVE]')) colorClass = 'text-white font-medium';

              return (
                <div key={index} className={`tracking-wider break-all leading-normal ${colorClass}`}>
                  {log}
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>

          {/* Minimalist Transmit HUD Indicator */}
          {isUnlocked && (
            <div className={`mb-6 flex items-center justify-between border rounded-lg px-4 py-3 text-[10px] font-mono select-none ${
              isVoiceLocked ? 'bg-zinc-950/40 border-zinc-900 text-zinc-600' : 'bg-white/5 border-white/5 text-cyan-500'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                  isVoiceLocked ? 'bg-zinc-800' : isTransmitting ? 'bg-red-500 animate-pulse' : 'bg-cyan-500/30'
                }`} />
                <span className={isVoiceLocked ? 'text-zinc-600' : 'text-gray-400'}>
                  {isVoiceLocked ? 'UPLINK DORMANT (VOICE LOCKED)' : isTransmitting ? 'UPLINK ACTIVE (TRANSMITTING)' : 'UPLINK STANDBY'}
                </span>
              </div>
              <span className={`uppercase tracking-widest text-[9px] ${isVoiceLocked ? 'text-zinc-700' : 'text-gray-500'}`}>
                {isVoiceLocked ? 'VOICE UPLINK DISABLED' : 'HOLD [SPACEBAR] TO SPEAK'}
              </span>
            </div>
          )}

          {/* Centered Success Verification Modal overlay inside slab */}
          {statusState === 'SUCCESS' && !isUnlocked && (
            <div className="absolute inset-0 bg-black/95 rounded-2xl z-30 flex flex-col justify-center items-center text-center p-12 border border-green-500/20">
              <div className="w-12 h-12 rounded-full border border-green-500/30 flex items-center justify-center mb-6 animate-pulse">
                <span className="text-green-400 text-xl">✓</span>
              </div>
              <h2 className="text-white font-sans text-lg tracking-[0.3em] font-light uppercase mb-3 animate-pulse">
                ACCESS VERIFIED
              </h2>
              <p className="text-gray-400 font-mono text-xs max-w-md uppercase tracking-wider leading-relaxed">
                Decryption Complete. Identity Verified. Launch pipeline initialized. Standby for broadcast stream initialization...
              </p>
              <div className="mt-8 flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping delay-75" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping delay-150" />
              </div>
            </div>
          )}

          {/* Handshake Invite Verification Input field */}
          {!isUnlocked && (
            <form onSubmit={handleFormSubmit} className="mt-4 relative z-10 w-full">
              <div className="flex items-center font-mono text-xs text-cyan-500/40 mb-1">
                sys-admin@aegis-nexus:~$
              </div>
              <div className="relative w-full flex items-center border-b border-cyan-500/30 focus-within:border-cyan-400 transition-colors py-2">
                <span className="text-cyan-400 font-mono text-lg tracking-widest whitespace-pre select-all min-h-[1.75rem] flex items-center">
                  {inputValue}
                </span>
                {statusState === 'IDLE' && (
                  <span className="text-cyan-400 font-bold caret-blink text-lg ml-[1.5px] shrink-0">_</span>
                )}
                {statusState === 'IDLE' && !inputValue && (
                  <span className="absolute left-0 text-cyan-500/30 text-lg tracking-widest font-mono pointer-events-none">
                    ENTER INVITE SIGNATURE...
                  </span>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  disabled={statusState === 'PROCESSING' || statusState === 'SUCCESS'}
                  className="absolute inset-0 w-full bg-transparent text-transparent border-none outline-none caret-transparent cursor-text select-text"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </form>
          )}

          {/* Persistent Uplink CLI Command Ingestion Form */}
          {isUnlocked && (
            <form onSubmit={handleAgentCommandSubmit} className="mt-4 relative z-10 w-full shrink-0">
              <div className="flex items-center font-mono text-xs text-cyan-500/40 mb-1">
                sys-admin@aegis-nexus:~$
              </div>
              <div className="relative w-full flex items-center border-b border-cyan-500/30 focus-within:border-cyan-400 transition-colors py-2">
                <span className="text-cyan-400 font-mono text-lg tracking-widest whitespace-pre select-all min-h-[1.75rem] flex items-center">
                  {agentInput}
                </span>
                {statusState === 'IDLE' && (
                  <span className="text-cyan-400 font-bold caret-blink text-lg ml-[1.5px] shrink-0">_</span>
                )}
                {statusState === 'IDLE' && !agentInput && (
                  <span className="absolute left-0 text-cyan-500/25 text-lg tracking-widest font-mono pointer-events-none">
                    TYPE NATURAL DIRECTIVE...
                  </span>
                )}
                <input
                  type="text"
                  value={agentInput}
                  onChange={e => setAgentInput(e.target.value)}
                  disabled={isThinking}
                  className="absolute inset-0 w-full bg-transparent text-transparent border-none outline-none caret-transparent cursor-text select-text"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </form>
          )}

        </div>

        {/* RIGHT COLUMN: THE GEOSPATIAL CANVAS (60% width) */}
        {isUnlocked && (
          <div className="lg:w-[60%] w-full h-[calc(100vh-100px)] bg-black/50 backdrop-blur-sm border border-white/5 shadow-2xl rounded-2xl p-8 flex flex-col relative pointer-events-auto transition-all duration-700 justify-center items-center overflow-hidden">
            {/* Subtle cyber grid pattern background */}
            <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
            
            {!mapActive && !wgslActive ? (
              <div className="flex flex-col items-center justify-center text-center p-6 z-10 text-cyan-600/60 font-mono tracking-widest text-xs">
                <span className="w-3 h-3 bg-cyan-500/20 border border-cyan-500/40 rounded-full animate-ping mb-4" />
                AWAITING GEOSPATIAL COMMAND DISPATCH...
              </div>
            ) : wgslActive ? (
              <div className="w-full h-full flex flex-col justify-between relative z-10">
                {/* WGSL Header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-3 shrink-0 mb-4">
                  <div>
                    <h3 className="text-white font-sans text-sm tracking-[0.2em] font-light">GENERATIVE WEBGPU ENGINE</h3>
                    <p className="text-cyan-500/60 text-[10px] tracking-widest mt-1">WGSL REAL-TIME INFERENCE PIXELS</p>
                  </div>
                  <span className="px-2 py-0.5 bg-cyan-950/40 border border-cyan-500/30 text-[9px] text-cyan-400 rounded animate-pulse">
                    ACTIVE WEBGPU COMPILATION
                  </span>
                </div>

                {/* The WebGPU Sandbox Canvas */}
                <div className="flex-1 min-h-0 relative rounded-xl overflow-hidden border border-white/5">
                  <GenerativeWGSLCanvas wgslCode={wgslCode || ''} />
                </div>

                {/* Footer specs */}
                <div className="border-t border-white/5 pt-3 mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] text-gray-500 tracking-wider shrink-0">
                  <div>ENGINE STATE:<br/><span className="text-cyan-400">ACTIVE [WebGPU]</span></div>
                  <div>FPS FEEDBACK:<br/><span className="text-cyan-400">60 FPS [V-SYNC]</span></div>
                  <div>PIPELINE STATE:<br/><span className="text-green-400">OPTIMIZED</span></div>
                  <div>INPUT STREAM:<br/><span className="text-cyan-400">SOVEREIGN_WGSL</span></div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col justify-between relative z-10 p-4">
                {/* Map Header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-white font-sans text-sm tracking-[0.2em] font-light">SPATIAL RADAR MATRIX</h3>
                    <p className="text-cyan-500/60 text-[10px] tracking-widest mt-1">COORD: {mapCoords ? `${mapCoords[0].toFixed(4)}° N // ${mapCoords[1].toFixed(4)}° E` : ''}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-cyan-950/40 border border-cyan-500/30 text-[9px] text-cyan-400 rounded animate-pulse">
                    LIVE TARGET ACQUISITION
                  </span>
                </div>

                {/* holographic Radar Scope Visualizer (Pulsing SVG) */}
                <div className="flex-1 flex items-center justify-center my-6 relative">
                  {/* Glowing scan ring */}
                  <div className="absolute w-64 h-64 border border-cyan-500/25 rounded-full animate-pulse" />
                  <div className="absolute w-44 h-44 border border-cyan-500/15 rounded-full" />
                  <div className="absolute w-24 h-24 border border-cyan-500/10 rounded-full" />
                  
                  {/* Sweep line */}
                  <div className="absolute w-32 h-[1.5px] bg-gradient-to-r from-transparent to-cyan-500 origin-left radar-sweep-spin" style={{ transformOrigin: 'left center', left: '50%' }} />

                  {/* Mumbai Target Dot Marker */}
                  <div className="absolute flex items-center justify-center" style={{ transform: 'translate(40px, -30px)' }}>
                    <span className="absolute w-4 h-4 bg-red-500/30 border border-red-500/50 rounded-full animate-ping" />
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_red]" />
                    <span className="absolute text-[9px] text-red-400 font-bold ml-24 mt-1 font-mono tracking-widest">
                      MUMBAI_NX_091
                    </span>
                  </div>
                </div>

                {/* Map Footer Metrics */}
                <div className="border-t border-white/5 pt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] text-gray-500 tracking-wider">
                  <div>TOPOGRAPHY:<br/><span className="text-cyan-400">COASTAL_SECTOR_A</span></div>
                  <div>TENSOR LEVEL:<br/><span className="text-cyan-400">OPTIMAL [0.94]</span></div>
                  <div>MESH STATE:<br/><span className="text-green-400">VERIFIED</span></div>
                  <div>DATA LOAD:<br/><span className="text-cyan-400">INGEST_STREAM</span></div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
