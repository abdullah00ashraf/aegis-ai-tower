import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Wrench, Shield, Activity, Database, Wind, Zap, Network, Sparkles, X } from 'lucide-react';
import { toast } from '../components/Toast';
import { pageVariants } from './Vision';

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
export default function AgenticAI() {
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const marqueeRow1 = [Cpu, Wrench, Shield, Activity, Database, Wind, Zap, Network];
  const marqueeRow2 = [Activity, Database, Shield, Cpu, Zap, Wind, Network, Wrench];

  return (
    <motion.div 
      initial="initial" animate="animate" exit="exit" variants={pageVariants}
      className="relative min-h-screen w-full bg-[#0a0a0a] font-sans text-white selection:bg-white selection:text-black flex flex-col"
    >


      <div className="flex-1 w-full flex flex-col px-4 sm:px-6 md:px-10 lg:px-14 py-24 sm:py-28 md:py-32 lg:h-screen max-w-[2000px] mx-auto">
        
        {/* Top Header Row */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-12 mb-8 md:mb-12">
          <div className="max-w-3xl">
            <motion.h1 variants={textFadeUp} className="font-serif text-[28px] sm:text-3xl md:text-4xl lg:text-[44px] leading-[1.15] tracking-tight mb-4 text-white">
              The Executive Brain.
            </motion.h1>
            <motion.p variants={textFadeUp} className="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed">
              Replacing human latency with deterministic, physics-informed actuation. The Agentic Control Plane evaluates millions of boundary conditions per second, dispatching unhackable payloads directly to physical infrastructure.
            </motion.p>
          </div>
          <motion.div variants={textFadeUp} className="flex flex-wrap gap-3 self-start">
          <button 
            onClick={() => setIsSchemaModalOpen(true)}
            className="liquid-glass rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium hover:scale-105 transition-transform shrink-0 self-start"
          >
            View JSON Schema
          </button>
        </motion.div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 flex-1 min-h-0">
          
          {/* Column 1: Telemetry Pipeline */}
          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
            className="md:col-span-8 liquid-glass p-6 md:p-8 rounded-3xl flex flex-col justify-between overflow-hidden relative group h-full min-h-[400px]"
          >
            <video
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_150203_44a5bd32-516a-47ce-a077-8acbf9aa8991.mp4"
              autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
            />
            <div className="absolute inset-0 bg-[#050505]/85 backdrop-blur-[30px] z-[1]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50 z-[2]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 z-[3]" />
            
            <div className="relative z-10 flex items-center justify-center gap-3">
              <Sparkles className="h-3 w-3 text-[#00F0FF]/60" strokeWidth={1.5} />
              <span className="uppercase tracking-[0.22em] text-[11px] text-white/70 font-medium">Local Data Harmonizer</span>
              <Sparkles className="h-3 w-3 text-[#00F0FF]/60" strokeWidth={1.5} />
            </div>

            <div className="relative z-10 mt-auto">
              <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-y-3 gap-x-2 text-xs md:text-[13px] text-white/80 font-medium whitespace-nowrap overflow-x-auto mb-4">
                <div className="text-white">Ingestion</div>
                <Sparkles className="h-3 w-3 text-[#00F0FF]/60 flex-shrink-0" strokeWidth={1.5} />
                <div className="truncate">IoT Telemetry</div>
                <div className="text-white/50 text-right">Acoustic & Thermal</div>

                <div className="text-white">Model</div>
                <Sparkles className="h-3 w-3 text-[#00F0FF]/60 flex-shrink-0" strokeWidth={1.5} />
                <div className="truncate">Bi-Directional LSTM</div>
                <div className="text-white/50 text-right">Sequence Prediction</div>

                <div className="text-white">Output</div>
                <Sparkles className="h-3 w-3 text-[#00F0FF]/60 flex-shrink-0" strokeWidth={1.5} />
                <div className="truncate text-[#00F0FF]">Stress Detection</div>
                <div className="text-white/50 text-right">Sub-millisecond</div>
              </div>
              <p className="text-[12px] md:text-sm text-gray-400 leading-relaxed font-normal whitespace-normal">
                Lidar, thermal, and acoustic sensors tracking human movement, pipe water flow, and ambient heat signatures.
              </p>
            </div>
          </motion.div>

          {/* Column 2: Override & 10M+ */}
          <div className="flex flex-col gap-4 md:gap-5 lg:h-full">
            {/* Top: The Override */}
            <motion.div 
              variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
              className="md:col-span-7 liquid-glass p-6 md:p-8 rounded-3xl flex flex-col relative overflow-hidden group flex-shrink-0"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-start gap-2 text-xs text-white/50 mb-4 tracking-widest uppercase">
                  <Sparkles className="h-3 w-3" strokeWidth={1.5} />
                  The Override
                </div>
                <p className="text-[13px] sm:text-[13.5px] leading-[1.6] text-white/85">
                  "The Physics & Safety Engine models thermodynamics and fluid dynamics to understand the physical reality of the building, preventing the AI from issuing physically impossible or dangerous commands."
                </p>
                <div className="text-xs text-[#00F0FF] mt-4 font-medium tracking-wide">
                  <span className="text-white">Physics-Informed Neural Network (PINN)</span> — Humanitarian Impact Calculus.
                </div>
              </div>
            </motion.div>

            {/* Bottom: 10M+ */}
            <motion.div 
              variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
              className="md:col-span-12 liquid-glass p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 min-h-[300px]"
            >
              <video
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_154543_d5b83fc1-9cea-44f3-b5e8-8f325935211a.mp4"
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-70 mix-blend-screen"
              />
              <div className="absolute inset-0 bg-black/20 z-0" />
              
              <div className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[88px] tracking-tight drop-shadow-2xl relative z-10 text-white mb-2">
                10M+
              </div>
              <div className="text-white/85 text-sm relative z-10 font-medium tracking-wide text-center">
                Synthetic edge-case simulations cleared
              </div>
            </motion.div>
          </div>

          {/* Column 3: Marquee & Local Compute */}
          <div className="flex flex-col gap-4 md:gap-5 lg:h-full md:col-span-2 lg:col-span-1">
            
            {/* Top: Sub-Agents (Scrolling) */}
            <motion.div 
              variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
              className="rounded-2xl bg-black relative overflow-hidden flex flex-col justify-between p-6 flex-1 min-h-[350px]"
            >
              <video
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_153148_d7a3e1dd-e5d0-4ce6-8306-00d7522ecc44.mp4"
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-0" />

              <div className="relative z-10 text-center text-xs tracking-widest text-white/70 uppercase font-medium mb-8">
                Robotic Sub-Agents
              </div>

              <div className="relative z-10 flex flex-col gap-4 overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
                {/* Row 1 Left */}
                <div className="flex w-[200%] animate-marquee-left">
                  {[...marqueeRow1, ...marqueeRow1].map((Icon, idx) => (
                    <div key={idx} className="flex-shrink-0 mx-2">
                      <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl liquid-glass flex items-center justify-center text-white/80 border border-white/10 hover:bg-white/10 transition-colors">
                        <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Row 2 Right */}
                <div className="flex w-[200%] animate-marquee-right">
                  {[...marqueeRow2, ...marqueeRow2].map((Icon, idx) => (
                    <div key={idx} className="flex-shrink-0 mx-2">
                      <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl liquid-glass flex items-center justify-center text-white/80 border border-white/10 hover:bg-white/10 transition-colors">
                        <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bottom: Local Compute */}
            <motion.div 
              variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
              className="rounded-2xl bg-[#0f171a] p-5 md:p-6 noise-overlay relative overflow-hidden flex-shrink-0 flex items-start justify-between"
            >
              <div className="relative z-10 pr-4">
                <div className="text-xs text-white/50 mb-3 tracking-widest uppercase font-medium">Air-Gapped Compute</div>
                <div className="text-white/80 text-sm leading-relaxed whitespace-normal">
                  Powered by industrial edge-compute nodes (NVIDIA Jetson AGX Orin industrial grade) processing the PINN Safety Engine and Agentic Control Plane locally at the floor level.
                </div>
              </div>
              <button onClick={() => toast("Connecting to Database...", "info")} className="relative z-10 h-9 w-9 shrink-0 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:scale-105 transition-transform hover:bg-white/10">
                <Database className="w-4 h-4 text-white/80" />
              </button>
            </motion.div>
          </div>

        </div>

        {/* Human Validation Threshold Component */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="max-w-7xl mx-auto mt-32 mb-32 px-4 w-full">
          <h2 className="font-serif text-5xl text-white mb-6">The Execution Payload.</h2>
          <p className="text-gray-400 max-w-2xl mb-12">
            The Central Agentic AI does not hallucinate. It evaluates harmonized states and dispatches precise, contained JSON command structures to the sub-agent network.
          </p>

          <div className="liquid-glass-strong rounded-[2rem] border border-white/10 overflow-hidden relative">
            <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="font-mono text-xs text-white/50">central_agentic_dispatch.json</span>
            </div>
            
            <div className="p-8 overflow-x-auto font-mono text-sm leading-relaxed">
              <pre className="text-white/80">
                <span className="text-white/50">{"{\n"}</span>
                <span className="text-[#00F0FF]">  "system_state"</span><span className="text-white/50">:{` {\n`}</span>
                <span className="text-[#00F0FF]">    "timestamp"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"2026-05-24T15:51:27Z"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">    "harmonizer_status"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"NOMINAL"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">    "pinn_safety_lock"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"DISENGAGED"{"\n"}</span>
                <span className="text-white/50">  {`},\n`}</span>
                <span className="text-[#00F0FF]">  "threat_evaluation"</span><span className="text-white/50">:{` {\n`}</span>
                <span className="text-[#00F0FF]">    "threat_level"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"CRITICAL_SYSTEM_STRESS"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">    "telemetry_source"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"Fiber_Optic_Nervous_System"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">    "anomaly"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"Micro-fracture detected on load-bearing column C-4. Strain index 0.08%."{"\n"}</span>
                <span className="text-white/50">  {`},\n`}</span>
                <span className="text-[#00F0FF]">  "agentic_dispatch"</span><span className="text-white/50">:{` [\n`}</span>
                <span className="text-white/50">    {`{\n`}</span>
                <span className="text-[#00F0FF]">      "sub_agent_class"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"Elevator_Logic_Controller"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">      "action_payload"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"HALT_CARS_NEAREST_FLOOR"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">      "priority"</span><span className="text-white/50">: </span>1{"\n"}
                <span className="text-white/50">    {`},\n`}</span>
                <span className="text-white/50">    {`{\n`}</span>
                <span className="text-[#00F0FF]">      "sub_agent_class"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"KUKA_Maintenance_Arms"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">      "action_payload"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"DEPLOY_RIGID_BRACING_POSTURE"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">      "priority"</span><span className="text-white/50">: </span>1{"\n"}
                <span className="text-white/50">    {`},\n`}</span>
                <span className="text-white/50">    {`{\n`}</span>
                <span className="text-[#00F0FF]">      "sub_agent_class"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"Micro_Drone_Swarms"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">      "action_payload"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"SCAN_STRUCTURAL_ENVELOPE_THERMAL"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">      "priority"</span><span className="text-white/50">: </span>2{"\n"}
                <span className="text-white/50">    {`}\n`}</span>
                <span className="text-white/50">  {`],\n`}</span>
                <span className="text-[#00F0FF]">  "humanitarian_calculus"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"Zero casualties. Structural integrity actively reinforced."{"\n"}</span>
                <span className="text-white/50">{"}"}</span>
              </pre>
            </div>
          </div>
        </motion.div>

      </div>

      {/* JSON Schema Modal */}
      <AnimatePresence>
        {isSchemaModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setIsSchemaModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="liquid-glass-strong rounded-[2rem] border border-white/10 overflow-hidden relative w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Mac Top Bar */}
              <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="font-mono text-xs text-white/50 ml-2">schema_definition.json (Read-Only)</span>
                </div>
                <button 
                  onClick={() => setIsSchemaModalOpen(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Syntax Highlighted JSON Schema */}
              <div className="p-6 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed text-white/80 whitespace-pre">
                <span className="text-white/50">{"{\n"}</span>
                <span className="text-[#00F0FF]">  "$schema"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"http://json-schema.org/draft-07/schema#"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">  "title"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"Agentic Dispatch Payload"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">  "type"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"object"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">  "properties"</span><span className="text-white/50">:{` {\n`}</span>
                <span className="text-[#00F0FF]">    "system_state"</span><span className="text-white/50">:{` {\n`}</span>
                <span className="text-[#00F0FF]">      "type"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"object"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">      "properties"</span><span className="text-white/50">:{` {\n`}</span>
                <span className="text-[#00F0FF]">        "timestamp"</span><span className="text-white/50">:{` { `}</span><span className="text-[#00F0FF]">"type"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"string"</span><span className="text-white/50">, </span><span className="text-[#00F0FF]">"format"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"date-time"</span><span className="text-white/50">{` },\n`}</span>
                <span className="text-[#00F0FF]">        "harmonizer_status"</span><span className="text-white/50">:{` { `}</span><span className="text-[#00F0FF]">"type"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"string"</span><span className="text-white/50">, </span><span className="text-[#00F0FF]">"enum"</span><span className="text-white/50">: [</span><span className="text-[#4ADE80]">"NOMINAL"</span><span className="text-white/50">, </span><span className="text-[#4ADE80]">"DEGRADED"</span><span className="text-white/50">, </span><span className="text-[#4ADE80]">"OFFLINE"</span><span className="text-white/50">]{` },\n`}</span>
                <span className="text-[#00F0FF]">        "pinn_safety_lock"</span><span className="text-white/50">:{` { `}</span><span className="text-[#00F0FF]">"type"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"string"</span><span className="text-white/50">, </span><span className="text-[#00F0FF]">"enum"</span><span className="text-white/50">: [</span><span className="text-[#4ADE80]">"ENGAGED"</span><span className="text-white/50">, </span><span className="text-[#4ADE80]">"DISENGAGED"</span><span className="text-white/50">]{` }\n`}</span>
                <span className="text-white/50">      {`},\n`}</span>
                <span className="text-[#00F0FF]">      "required"</span><span className="text-white/50">: [</span><span className="text-[#4ADE80]">"timestamp"</span><span className="text-white/50">, </span><span className="text-[#4ADE80]">"harmonizer_status"</span><span className="text-white/50">, </span><span className="text-[#4ADE80]">"pinn_safety_lock"</span><span className="text-white/50">]{`\n`}</span>
                <span className="text-white/50">    {`},\n`}</span>
                <span className="text-[#00F0FF]">    "threat_evaluation"</span><span className="text-white/50">:{` {\n`}</span>
                <span className="text-[#00F0FF]">      "type"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"object"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">      "properties"</span><span className="text-white/50">:{` {\n`}</span>
                <span className="text-[#00F0FF]">        "threat_level"</span><span className="text-white/50">:{` { `}</span><span className="text-[#00F0FF]">"type"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"string"</span><span className="text-white/50">{` },\n`}</span>
                <span className="text-[#00F0FF]">        "telemetry_source"</span><span className="text-white/50">:{` { `}</span><span className="text-[#00F0FF]">"type"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"string"</span><span className="text-white/50">{` },\n`}</span>
                <span className="text-[#00F0FF]">        "anomaly"</span><span className="text-white/50">:{` { `}</span><span className="text-[#00F0FF]">"type"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"string"</span><span className="text-white/50">{` }\n`}</span>
                <span className="text-white/50">      {`},\n`}</span>
                <span className="text-[#00F0FF]">      "required"</span><span className="text-white/50">: [</span><span className="text-[#4ADE80]">"threat_level"</span><span className="text-white/50">, </span><span className="text-[#4ADE80]">"telemetry_source"</span><span className="text-white/50">, </span><span className="text-[#4ADE80]">"anomaly"</span><span className="text-white/50">]{`\n`}</span>
                <span className="text-white/50">    {`},\n`}</span>
                <span className="text-[#00F0FF]">    "agentic_dispatch"</span><span className="text-white/50">:{` {\n`}</span>
                <span className="text-[#00F0FF]">      "type"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"array"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">      "items"</span><span className="text-white/50">:{` {\n`}</span>
                <span className="text-[#00F0FF]">        "type"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"object"</span><span className="text-white/50">,{"\n"}</span>
                <span className="text-[#00F0FF]">        "properties"</span><span className="text-white/50">:{` {\n`}</span>
                <span className="text-[#00F0FF]">          "sub_agent_class"</span><span className="text-white/50">:{` { `}</span><span className="text-[#00F0FF]">"type"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"string"</span><span className="text-white/50">{` },\n`}</span>
                <span className="text-[#00F0FF]">          "action_payload"</span><span className="text-white/50">:{` { `}</span><span className="text-[#00F0FF]">"type"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"string"</span><span className="text-white/50">{` },\n`}</span>
                <span className="text-[#00F0FF]">          "priority"</span><span className="text-white/50">:{` { `}</span><span className="text-[#00F0FF]">"type"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"integer"</span><span className="text-white/50">, </span><span className="text-[#00F0FF]">"minimum"</span><span className="text-white/50">: </span>1<span className="text-white/50">, </span><span className="text-[#00F0FF]">"maximum"</span><span className="text-white/50">: </span>5<span className="text-white/50">{` }\n`}</span>
                <span className="text-white/50">        {`},\n`}</span>
                <span className="text-[#00F0FF]">        "required"</span><span className="text-white/50">: [</span><span className="text-[#4ADE80]">"sub_agent_class"</span><span className="text-white/50">, </span><span className="text-[#4ADE80]">"action_payload"</span><span className="text-white/50">, </span><span className="text-[#4ADE80]">"priority"</span><span className="text-white/50">]{`\n`}</span>
                <span className="text-white/50">      {`}\n`}</span>
                <span className="text-white/50">    {`},\n`}</span>
                <span className="text-[#00F0FF]">    "humanitarian_calculus"</span><span className="text-white/50">:{` { `}</span><span className="text-[#00F0FF]">"type"</span><span className="text-white/50">: </span><span className="text-[#4ADE80]">"string"</span><span className="text-white/50">{` }\n`}</span>
                <span className="text-white/50">  {`},\n`}</span>
                <span className="text-[#00F0FF]">  "required"</span><span className="text-white/50">: [</span><span className="text-[#4ADE80]">"system_state"</span><span className="text-white/50">, </span><span className="text-[#4ADE80]">"threat_evaluation"</span><span className="text-white/50">, </span><span className="text-[#4ADE80]">"agentic_dispatch"</span><span className="text-white/50">, </span><span className="text-[#4ADE80]">"humanitarian_calculus"</span><span className="text-white/50">]{`\n`}</span>
                <span className="text-white/50">{"}"}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
