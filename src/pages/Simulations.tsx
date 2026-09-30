import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Activity, ZapOff, ShieldCheck, Cpu, Download } from 'lucide-react';
import { pageVariants } from './Vision';
import AuditDownloadModal from '../components/AuditDownloadModal';

const staggerContainer: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const textFadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PRESET SCENARIO DATA — Graceful Fallback payloads (never touch these)
// ─────────────────────────────────────────────────────────────────────────────
const FIRE_JSON = `{
  "threat_level": "LIFE_SAFETY_CRITICAL",
  "telemetry": "Thermal spike +400C detected on Floor 12, Sector 4. Smoke particulate threshold breached.",
  "physics_engine": "PINN thermodynamic model indicates flashover in 14.2 seconds.",
  "agentic_dispatch": [
    {"agent": "HVAC_Core", "action": "Seal localized oxygen dampers"},
    {"agent": "Micro_Drone_Swarm", "action": "Deploy thermal-vision to verify human evacuation"},
    {"agent": "Pressure_System", "action": "Depressurize adjacent sectors to contain smoke"}
  ],
  "human_impact": "Zero casualties. The Agentic Control Plane contained the fire to 400 sq/ft."
}`;

const SEISMIC_JSON = `{
  "threat_level": "STRUCTURAL_STRESS_DETECTED",
  "telemetry": "Fiber-optic foundation sensors detect 7.0 magnitude sheer wave.",
  "physics_engine": "PINN load-distribution model calculates 0.02% micro-fracture risk on load-bearing column C-4.",
  "agentic_dispatch": [
    {"agent": "Elevator_Logic", "action": "Halt all cars at nearest floor, open doors"},
    {"agent": "KUKA_Maintenance_Arms", "action": "Lock into rigid bracing positions on exterior envelope"},
    {"agent": "Gas_Main", "action": "Sever primary lines"}
  ],
  "human_impact": "The Central Agentic AI safely grounded residents and maintained structural integrity."
}`;

const GRID_JSON = `{
  "threat_level": "MUNICIPAL_GRID_FAILURE",
  "telemetry": "External voltage dropped to 0V. City-wide blackout confirmed.",
  "physics_engine": "Internal power reserves calculated at 100%. Tri-generation routing required.",
  "agentic_dispatch": [
    {"agent": "Microgrid_Switch", "action": "Sever external grid connection"},
    {"agent": "Kinetic_Recovery", "action": "Route elevator braking energy to critical life-support"},
    {"agent": "Bioreactor_Cells", "action": "Throttle up to maximum methane conversion"}
  ],
  "human_impact": "The Tri-Generation Microgrid maintained 100% operational autonomy with zero millisecond power interruption."
}`;


// ─────────────────────────────────────────────────────────────────────────────
// API ENDPOINT
// Set your API target engine to production
const API_BASE_URL = "https://aegis-local-engine-production.up.railway.app";
const AEGIS_API_URL = `${API_BASE_URL}/api/simulate`;
const FETCH_TIMEOUT_MS = 120_000;

export default function Simulations() {
  // ── Existing state ──────────────────────────────────────────────────────────
  const [activeThreat, setActiveThreat] = useState<string | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // ── Phase 4: New state ──────────────────────────────────────────────────────
  const [isAirGappedMode, setIsAirGappedMode] = useState<boolean>(false);
  const [customAnomaly, setCustomAnomaly] = useState<string>('');
  const [isFetchSimulating, setIsFetchSimulating] = useState<boolean>(false);
  const [anomalyRoster, setAnomalyRoster] = useState<any[]>([]);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string>('');

  // Ref to hold the AbortController so we can cancel on unmount
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch deterministic anomalies roster from the local orchestrator API on load
  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/anomalies`);
        if (response.ok) {
          const data = await response.json();
          setAnomalyRoster(data);
        }
      } catch (err) {
        console.warn('[AEGIS WARN] Failed to fetch deterministic anomalies roster.', err);
      }
    };
    fetchRoster();
  }, []);

  // ── Existing typewriter effect (unchanged) ──────────────────────────────────
  useEffect(() => {
    if (!activeThreat || !isSimulating) return;

    let targetText = '';
    if (activeThreat === 'FIRE') targetText = FIRE_JSON;
    if (activeThreat === 'SEISMIC') targetText = SEISMIC_JSON;
    if (activeThreat === 'GRID') targetText = GRID_JSON;
    if (activeThreat === 'DYNAMIC') targetText = terminalOutput; // already set by fetch

    if (activeThreat === 'DYNAMIC') {
      setIsSimulating(false);
      return;
    }

    setTerminalOutput('');
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      setTerminalOutput((prev) => prev + targetText[currentIndex]);
      currentIndex++;
      if (currentIndex === targetText.length) {
        clearInterval(intervalId);
        setIsSimulating(false);
      }
    }, 10);

    return () => clearInterval(intervalId);
  }, [activeThreat, isSimulating]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // ── Existing preset handler (unchanged) ────────────────────────────────────
  const handleThreatClick = (threat: string) => {
    if (isSimulating || isFetchSimulating) return;
    setActiveThreat(threat);
    setIsSimulating(true);
  };

  // ── Phase 4: Dynamic engine fetch routine ──────────────────────────────────
  const executeDynamicSimulation = async (forcedId?: string) => {
    const targetId = forcedId || selectedAnomalyId;
    const targetQuery = customAnomaly.trim();
    if (!targetId && !targetQuery || isFetchSimulating) return;

    // Abort any in-flight request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Arm a 45-second hard timeout
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    setIsFetchSimulating(true);
    setActiveThreat(null);
    setTerminalOutput('');

    try {
      const payload = targetId
        ? { anomaly_id: targetId }
        : { anomaly_description: targetQuery };

      const response = await fetch(AEGIS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      // Map API response fields into a canonical display payload
      const mapped = {
        threat_level: data.event_classification ?? 'UNKNOWN_CLASS',
        telemetry: data.baseline_metrics
          ? JSON.stringify(data.baseline_metrics)
          : 'No baseline telemetry returned.',
        physics_engine: data.aegis_metrics
          ? JSON.stringify(data.aegis_metrics)
          : 'No PINN metrics returned.',
        agentic_dispatch: data.output_ledger ?? [],
        human_impact: 'Dynamic scenario executed via Air-Gapped Generative Engine.',
      };

      const mappedString = JSON.stringify(mapped, null, 2);
      setTerminalOutput(mappedString);
      setActiveThreat('DYNAMIC');
      setIsSimulating(false);
    } catch (err) {
      // ── Graceful Fallback Protocol ─────────────────────────────────────────
      console.warn(
        '[AEGIS WARN] Local Engine Timeout or CORS failure. Engaging Failsafe Preset.'
      );
      setTerminalOutput('');
      setActiveThreat('FIRE');
      setIsSimulating(true);
      // Let the existing typewriter useEffect handle the FIRE preset render
    } finally {
      clearTimeout(timeoutId);
      setIsFetchSimulating(false);
    }
  };

  // Handle Enter key in the terminal input
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') executeDynamicSimulation();
  };

  // ── JSON colorizer (unchanged) ────────────────────────────────────────────
  const renderColorizedJSON = (text: string) => {
    if (!text) return null;
    const lines = text.split('\\n').map((line, i) => {
      if (line === '> WAITING FOR THREAT VECTOR INITIALIZATION..._') {
        return <div key={i} className="animate-pulse">{line}</div>;
      }
      const parts = line.split(/(\".*?\"|[:,{}\[\]])/g).filter(Boolean);
      return (
        <div key={i}>
          {parts.map((part, j) => {
            if (part === '{' || part === '}' || part === '[' || part === ']' || part === ',' || part === ':') {
              return <span key={j} className="text-white/60">{part}</span>;
            }
            if (part.startsWith('"') && part.endsWith('"')) {
              const isKey = parts[j + 1] && parts[j + 1].trim() === ':';
              if (isKey) return <span key={j} className="text-[#00F0FF]">{part}</span>;
              return <span key={j} className="text-green-400">{part}</span>;
            }
            return <span key={j} className="text-white">{part}</span>;
          })}
        </div>
      );
    });
    return <>{lines}</>;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial="initial" animate="animate" exit="exit" variants={pageVariants}
      className="relative w-full bg-[#030303] min-h-screen overflow-x-hidden font-sans text-white selection:bg-[#00F0FF] selection:text-black"
    >
      <AuditDownloadModal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} />


      {/* 1. HYBRID BACKGROUND & GRID OVERLAY */}
      <motion.div
        animate={{ backgroundPosition: ['0px 0px', '0px 50px'] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className="fixed inset-0 w-full h-full z-[0] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)'
        }}
      />

      <div className="relative z-10">
        {/* 2. HERO SECTION */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-7xl mx-auto px-6 pt-32 text-center">
          <motion.div variants={textFadeUp} className="text-xs uppercase tracking-widest text-[#00F0FF] mb-6">
            DIGITAL TWIN STRESS TESTING
          </motion.div>
          <motion.h1 variants={textFadeUp} className="text-6xl md:text-8xl text-white font-serif mb-6 tracking-tight">
            10 Million Synthetic <span className="italic text-white/60 font-serif">Disasters.</span>
          </motion.h1>
          <motion.p variants={textFadeUp} className="text-lg text-white/60 max-w-2xl mx-auto mt-6 mb-16 leading-relaxed">
            Proving humanitarian impact calculus before a single physical brick is poured. Select a threat vector below to initialize the Agentic Control Plane simulation.
          </motion.p>
        </motion.div>

        {/* 3. THE INTERACTIVE SANDBOX TERMINAL */}
        <div className="max-w-6xl mx-auto px-6 mb-32">
          <div className="liquid-glass-strong rounded-3xl border border-white/10 flex flex-col md:flex-row overflow-hidden min-h-[600px] bg-black/40">

            {/* Left Panel: Control Panel */}
            <div className="w-full md:w-1/3 bg-black/50 p-8 border-r border-white/5 flex flex-col gap-4">
              <div className="text-xs tracking-widest text-white/40 uppercase mb-2">Initialize Vector</div>

              {/* ── PHASE 4: AIR-GAPPED ENGINE TOGGLE ───────────────────────── */}
              <div className="flex items-center justify-between p-4 rounded-2xl liquid-glass border border-white/10 mb-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono tracking-widest text-[#00F0FF] uppercase">Air-Gapped Engine</span>
                  <span className="text-[11px] text-white/50 font-mono">
                    {isAirGappedMode ? 'ENGAGED' : 'STANDBY'}
                  </span>
                </div>
                {/* Futuristic toggle switch */}
                <button
                  id="air-gapped-toggle"
                  onClick={() => setIsAirGappedMode(prev => !prev)}
                  disabled={isFetchSimulating || isSimulating}
                  aria-pressed={isAirGappedMode}
                  className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00F0FF]/50 disabled:opacity-50 disabled:cursor-not-allowed
                    ${isAirGappedMode
                      ? 'bg-[#00F0FF]/20 shadow-[0_0_12px_rgba(0,240,255,0.4)] border border-[#00F0FF]/50'
                      : 'bg-white/10 border border-white/20'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full transition-all duration-300
                      ${isAirGappedMode
                        ? 'translate-x-7 bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.8)]'
                        : 'translate-x-1 bg-white/50'
                      }`}
                  />
                </button>
              </div>
              {/* ── END TOGGLE ───────────────────────────────────────────────── */}

              {/* DOWNLOAD AUDIT BUTTON */}
              <button
                onClick={() => setIsAuditModalOpen(true)}
                className="w-full mt-2 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 rounded-xl py-3 px-4 font-mono text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,255,0.05)]"
              >
                <Download size={14} /> Download Audit
              </button>

              {/* Preset Buttons — hidden when Air-Gapped mode is on */}
              <AnimatePresence>
                {!isAirGappedMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 overflow-hidden"
                  >
                    <button
                      id="sim-fire-btn"
                      onClick={() => handleThreatClick('FIRE')}
                      disabled={isSimulating || isFetchSimulating}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${activeThreat === 'FIRE' ? 'bg-white/10 shadow-inner text-[#00F0FF] border border-white/10' : 'liquid-glass hover:bg-white/5 text-white/80'} ${(isSimulating || isFetchSimulating) && activeThreat !== 'FIRE' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className={`p-2 rounded-xl ${activeThreat === 'FIRE' ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'bg-white/5'}`}>
                        <Flame size={20} />
                      </div>
                      <span className="font-medium text-sm text-left">Simulate Flashover Fire</span>
                    </button>

                    <button
                      id="sim-seismic-btn"
                      onClick={() => handleThreatClick('SEISMIC')}
                      disabled={isSimulating || isFetchSimulating}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${activeThreat === 'SEISMIC' ? 'bg-white/10 shadow-inner text-[#00F0FF] border border-white/10' : 'liquid-glass hover:bg-white/5 text-white/80'} ${(isSimulating || isFetchSimulating) && activeThreat !== 'SEISMIC' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className={`p-2 rounded-xl ${activeThreat === 'SEISMIC' ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'bg-white/5'}`}>
                        <Activity size={20} />
                      </div>
                      <span className="font-medium text-sm text-left">Simulate 7.0 Seismic Event</span>
                    </button>

                    <button
                      id="sim-grid-btn"
                      onClick={() => handleThreatClick('GRID')}
                      disabled={isSimulating || isFetchSimulating}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${activeThreat === 'GRID' ? 'bg-white/10 shadow-inner text-[#00F0FF] border border-white/10' : 'liquid-glass hover:bg-white/5 text-white/80'} ${(isSimulating || isFetchSimulating) && activeThreat !== 'GRID' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className={`p-2 rounded-xl ${activeThreat === 'GRID' ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'bg-white/5'}`}>
                        <ZapOff size={20} />
                      </div>
                      <span className="font-medium text-sm text-left">Simulate Total Grid Collapse</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── PHASE 4: TERMINAL INPUT — rendered only in Air-Gapped mode ── */}
              <AnimatePresence>
                {isAirGappedMode && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex flex-col gap-3 mt-1"
                  >
                    <div className="text-[10px] font-mono tracking-widest text-[#00F0FF] uppercase flex justify-between items-center">
                      <span>Select Deterministic Disaster</span>
                      <span className="text-white/40">{anomalyRoster.length} Available</span>
                    </div>
                    
                    {anomalyRoster.length > 0 ? (
                      <select
                        id="anomaly-select"
                        value={selectedAnomalyId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedAnomalyId(val);
                          const selected = anomalyRoster.find(a => a.id === val);
                          if (selected) {
                            setCustomAnomaly(selected.title);
                          }
                        }}
                        disabled={isFetchSimulating}
                        className="
                          w-full bg-black/80 border border-white/10 rounded-xl
                          px-4 py-3 font-mono text-xs text-green-400
                          focus:outline-none focus:border-[#00F0FF]/60
                          transition-all duration-300
                          disabled:opacity-50 disabled:cursor-not-allowed
                        "
                      >
                        <option value="" className="text-white/35">&gt; Select a threat vector...</option>
                        {anomalyRoster.map((anomaly) => (
                          <option key={anomaly.id} value={anomaly.id} className="bg-[#050505] text-green-400">
                            [{anomaly.category}] {anomaly.id}: {anomaly.title}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-xs text-red-400 font-mono">[AEGIS WARN] Roster offline. Using text injector below.</div>
                    )}

                    <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase mt-1">
                      Manual Text Injector
                    </div>
                    <input
                      id="anomaly-input"
                      type="text"
                      value={customAnomaly}
                      onChange={(e) => setCustomAnomaly(e.target.value)}
                      onKeyDown={handleInputKeyDown}
                      disabled={isFetchSimulating}
                      placeholder="> Inject manual anomaly description..."
                      className="
                        w-full bg-black/80 border border-white/10 rounded-xl
                        px-4 py-3 font-mono text-xs text-green-400
                        placeholder:text-white/20
                        focus:outline-none focus:border-[#00F0FF]/60
                        focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed
                      "
                    />
                    <button
                      id="execute-dynamic-btn"
                      onClick={() => executeDynamicSimulation()}
                      disabled={isFetchSimulating || (!selectedAnomalyId && !customAnomaly.trim())}
                      className="
                        w-full font-mono text-xs tracking-widest uppercase
                        py-3 px-4 rounded-xl
                        bg-[#00F0FF]/10 border border-[#00F0FF]/30
                        text-[#00F0FF] hover:bg-[#00F0FF]/20
                        hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]
                        transition-all duration-300
                        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#00F0FF]/10
                        flex items-center justify-center gap-2
                      "
                    >
                      <Cpu size={14} />
                      {isFetchSimulating ? 'COMPUTING...' : 'EXECUTE'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* ── END TERMINAL INPUT ────────────────────────────────────────── */}
            </div>

            {/* Right Panel: Live Terminal */}
            <div className="w-full md:w-2/3 bg-[#050505] p-6 md:p-8 flex flex-col relative">
              {/* Top Bar */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                <div className="ml-4 text-xs font-mono text-white/30">
                  aegis_os_v1.4.2 // root@agentic-plane
                  {isAirGappedMode && (
                    <span className="ml-3 text-[#00F0FF]/60">[ AIR-GAPPED ENGINE ACTIVE ]</span>
                  )}
                </div>
              </div>

              {/* Terminal Output — with loading overlay */}
              <div className="font-mono text-sm leading-relaxed overflow-y-auto whitespace-pre-wrap flex-1 relative">

                {/* ── PHASE 4: LIQUID GLASS COMPUTING OVERLAY ─────────────── */}
                <AnimatePresence>
                  {isFetchSimulating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl liquid-glass backdrop-blur-md"
                    >
                      {/* Pulsing data-stream rings */}
                      <div className="relative flex items-center justify-center mb-6">
                        <span className="absolute w-16 h-16 rounded-full border border-[#00F0FF]/30 animate-ping" style={{ animationDuration: '1.4s' }} />
                        <span className="absolute w-10 h-10 rounded-full border border-[#00F0FF]/50 animate-ping" style={{ animationDuration: '1s' }} />
                        <Cpu className="w-6 h-6 text-[#00F0FF]" />
                      </div>
                      {/* Streaming text */}
                      <p className="font-mono text-xs text-[#00F0FF] tracking-widest text-center px-6 animate-pulse max-w-xs leading-relaxed">
                        [AEGIS OS: COMPUTING PHYSICS BOUNDARIES &amp; SUB-AGENT PAYLOADS...]
                      </p>
                      {/* Streaming bar */}
                      <div className="mt-5 w-48 h-px bg-white/10 rounded overflow-hidden">
                        <motion.div
                          className="h-full bg-[#00F0FF]/60"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* ── END OVERLAY ──────────────────────────────────────────── */}

                {activeThreat === null && !isFetchSimulating ? (
                  <div className="animate-pulse text-[#00F0FF]">&gt; WAITING FOR THREAT VECTOR INITIALIZATION..._</div>
                ) : (
                  <div>{renderColorizedJSON(terminalOutput)}</div>
                )}
                {isSimulating && <span className="animate-pulse inline-block w-2 h-4 bg-[#00F0FF] ml-1 align-middle" />}
              </div>
            </div>
          </div>
        </div>

        {/* 4. PINN MATHEMATICAL CALLOUT */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 px-6 pb-32">
          {/* Card 1 */}
          <motion.div variants={textFadeUp} className="liquid-glass p-10 rounded-3xl group hover:-translate-y-2 transition-transform duration-500">
            <h2 className="font-serif text-3xl text-white mb-4">The Boundary Conditions</h2>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Aegis does not rely on LLM hallucination. The Physics-Informed Neural Network embeds the Navier-Stokes equations for fluid dynamics and the Heat Equation for thermodynamics directly into the loss function.
            </p>
            <div className="bg-black/50 p-6 rounded-xl font-mono text-xs text-[#00F0FF] border border-white/10 flex flex-col gap-2">
              <div>Loss = Loss_Data + λ * Loss_Physics</div>
              <div>∂u/∂t + (u · ∇)u = -1/ρ ∇p + ν∇²u</div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={textFadeUp} className="liquid-glass p-10 rounded-3xl flex flex-col justify-center group hover:-translate-y-2 transition-transform duration-500">
            <ShieldCheck className="w-10 h-10 text-white/50 mb-6" />
            <h2 className="font-serif text-3xl text-white mb-4">Unhackable Determinism</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              If the AI attempts to execute an actuation that violates the embedded laws of physics, the system triggers a hardcoded rejection. The building can only act within the bounds of physical reality.
            </p>
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
}
