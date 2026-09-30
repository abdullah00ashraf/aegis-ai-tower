
import { motion } from 'framer-motion';
import { ArrowRight, Database, Shield, Zap } from 'lucide-react';
import { toast } from '../components/Toast';
import { pageVariants } from './Vision';

const staggerContainer: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const textFadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
};
export default function Architecture() {

  return (
    <motion.div 
      initial="initial" animate="animate" exit="exit" variants={pageVariants}
      className="relative min-h-screen w-full bg-transparent font-sans text-white overflow-x-hidden selection:bg-[#00F0FF] selection:text-black"
    >


      {/* Background Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Left-to-Right Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B0A] via-[#070B0A]/80 to-transparent w-[60%]" />
        {/* Bottom-to-Top Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B0A] via-transparent to-transparent" />
        
        {/* Central Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00F0FF]/15 blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* Grid System */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-evenly">
        <div className="h-full w-[1px] bg-white/10" />
        <div className="h-full w-[1px] bg-white/10" />
        <div className="h-full w-[1px] bg-white/10" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-32 flex flex-col">
        
        {/* Hero Section */}
        <div className="flex flex-col items-start relative max-w-3xl">


          {/* Typography */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div variants={textFadeUp} className="font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#00F0FF] uppercase tracking-widest mb-6">
              PHYSICAL COGNITION
            </motion.div>
            
            <motion.h1 variants={textFadeUp} className="font-['Inter'] font-extrabold uppercase tracking-tight text-[40px] md:text-[56px] lg:text-[72px] leading-[1.05] text-white">
              A SKELETON WIRED <br /> FOR COGNITION<span className="text-[#00F0FF]">.</span>
            </motion.h1>
            
            <motion.p variants={textFadeUp} className="text-[14px] text-white/70 max-w-[512px] mt-6 leading-relaxed">
              Our physical shell is designed exclusively for autonomy. From biological concrete to tri-generation microgrids, we build hardware that thinks.
            </motion.p>

            <motion.button variants={textFadeUp} onClick={() => toast("Opening Structural Blueprints...", "info")} className="flex items-center gap-3 rounded-full bg-white text-black uppercase font-bold text-sm px-6 py-3 mt-10 hover:scale-105 transition-transform group">
              <span>View Structural Blueprints</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>

        {/* Python Architecture Flowchart Section */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mt-40 items-center">
          
          {/* Left Column: Mock Python IDE */}
          <motion.div 
            initial={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full relative"
          >
            <div className="liquid-glass-strong rounded-2xl overflow-hidden h-[500px] flex flex-col relative w-full border border-white/10">
              {/* Mac Top Bar */}
              <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center gap-2 sticky top-0 z-10">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                <span className="ml-4 text-xs text-white/40 font-mono tracking-wider">aegis_core.py</span>
              </div>
              
              {/* Syntax Highlighted Code */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 font-mono text-sm leading-relaxed text-white/80 whitespace-pre">
                <div><span className="text-[#C678DD]">import</span> asyncio</div>
                <div><span className="text-[#C678DD]">from</span> typing <span className="text-[#C678DD]">import</span> Dict, List, Any, Optional</div>
                <div><span className="text-[#C678DD]">from</span> dataclasses <span className="text-[#C678DD]">import</span> dataclass</div>
                <br/>
                <div className="text-gray-500"># Core Aegis Neural & Physics Modules (Abstracted for IP Protection)</div>
                <div><span className="text-[#C678DD]">from</span> aegis.neural <span className="text-[#C678DD]">import</span> <span className="text-[#E5C07B]">LocalDataHarmonizer</span>, <span className="text-[#E5C07B]">BiDirectionalLSTM</span></div>
                <div><span className="text-[#C678DD]">from</span> aegis.physics <span className="text-[#C678DD]">import</span> <span className="text-[#E5C07B]">PhysicsSafetyEngine</span>, <span className="text-[#E5C07B]">PINN</span></div>
                <div><span className="text-[#C678DD]">from</span> aegis.actuation <span className="text-[#C678DD]">import</span> <span className="text-[#E5C07B]">CentralAgenticAI</span>, <span className="text-[#E5C07B]">SubAgentNetwork</span></div>
                <br/>
                <div><span className="text-[#E5C07B]">@dataclass</span></div>
                <div><span className="text-[#C678DD]">class</span> <span className="text-[#E5C07B]">TelemetryPayload</span>:</div>
                <div>    acoustic_signature: <span className="text-[#61AFEF]">float</span></div>
                <div>    thermal_variance: <span className="text-[#61AFEF]">float</span></div>
                <div>    structural_strain_index: <span className="text-[#61AFEF]">float</span></div>
                <div>    timestamp: <span className="text-[#61AFEF]">str</span></div>
                <br/>
                <div><span className="text-[#C678DD]">class</span> <span className="text-[#E5C07B]">AegisTower</span>(<span className="text-[#E5C07B]">AutonomousHabitat</span>):</div>
                <div className="text-gray-500">    """</div>
                <div className="text-gray-500">    Master control class for the Aegis 26-Floor Autonomous Habitat.</div>
                <div className="text-gray-500">    Initializes the physical envelope and the 3-Tiered Neural Architecture.</div>
                <div className="text-gray-500">    """</div>
                <br/>
                <div>    <span className="text-[#C678DD]">def</span> <span className="text-[#61AFEF]">__init__</span>(<span className="text-[#D19A66]">self</span>, location_id: <span className="text-[#61AFEF]">str</span> = <span className="text-[#98C379]">"IND-01"</span>):</div>
                <div>        <span className="text-[#61AFEF]">super</span>().<span className="text-[#61AFEF]">__init__</span>(location_id)</div>
                <br/>
                <div className="text-gray-500">        # --- 1. PHYSICAL HARDWARE INITIALIZATION ---</div>
                <div>        <span className="text-[#D19A66]">self</span>.foundation = <span className="text-[#E5C07B]">FiberOpticNervousSystem</span>(</div>
                <div>            depth_meters=40,</div>
                <div>            sensor_density=<span className="text-[#98C379]">"High_Resolution"</span>,</div>
                <div>            seismic_active=<span className="text-[#D19A66]">True</span></div>
                <div>        )</div>
                <br/>
                <div>        <span className="text-[#D19A66]">self</span>.envelope = <span className="text-[#E5C07B]">ActiveBioclimaticSkin</span>(</div>
                <div>            glass_type=<span className="text-[#98C379]">"Electrochromic"</span>,</div>
                <div>            louver_actuation=<span className="text-[#98C379]">"Agentic_Driven"</span>,</div>
                <div>            self_healing_concrete=<span className="text-[#D19A66]">True</span></div>
                <div>        )</div>
                <br/>
                <div>        <span className="text-[#D19A66]">self</span>.microgrid = <span className="text-[#E5C07B]">TriGenerationMicrogrid</span>(</div>
                <div>            sources=[<span className="text-[#98C379]">"Solar"</span>, <span className="text-[#98C379]">"Kinetic_Recovery"</span>, <span className="text-[#98C379]">"Membrane_Bioreactor"</span>],</div>
                <div>            grid_independence=<span className="text-[#D19A66]">True</span>,</div>
                <div>            air_gapped_compute_power=<span className="text-[#D19A66]">True</span></div>
                <div>        )</div>
                <br/>
                <div className="text-gray-500">        # --- 2. NEURAL ARCHITECTURE INITIALIZATION ---</div>
                <div>        <span className="text-[#D19A66]">self</span>.harmonizer = <span className="text-[#E5C07B]">LocalDataHarmonizer</span>(</div>
                <div>            model=<span className="text-[#E5C07B]">BiDirectionalLSTM</span>(layers=128, sequence_prediction=<span className="text-[#D19A66]">True</span>)</div>
                <div>        )</div>
                <br/>
                <div>        <span className="text-[#D19A66]">self</span>.safety_engine = <span className="text-[#E5C07B]">PhysicsSafetyEngine</span>(</div>
                <div>            model=<span className="text-[#E5C07B]">PINN</span>(</div>
                <div>                thermodynamics_enabled=<span className="text-[#D19A66]">True</span>, </div>
                <div>                fluid_dynamics_enabled=<span className="text-[#D19A66]">True</span></div>
                <div>            )</div>
                <div>        )</div>
                <br/>
                <div>        <span className="text-[#D19A66]">self</span>.control_plane = <span className="text-[#E5C07B]">CentralAgenticAI</span>(</div>
                <div>            latency_target_ms=0.5,</div>
                <div>            human_in_loop=<span className="text-[#D19A66]">False</span></div>
                <div>        )</div>
                <br/>
                <div>        <span className="text-[#D19A66]">self</span>.sub_agents = <span className="text-[#E5C07B]">SubAgentNetwork</span>(</div>
                <div>            active_fleets=[<span className="text-[#98C379]">"Micro_Drone_Swarms"</span>, <span className="text-[#98C379]">"AVAC"</span>, <span className="text-[#98C379]">"KUKA_Maintenance_Arms"</span>]</div>
                <div>        )</div>
                <br/>
                <div>    <span className="text-[#C678DD]">async def</span> <span className="text-[#61AFEF]">ingest_telemetry</span>(<span className="text-[#D19A66]">self</span>, raw_data_stream: Any) -&gt; Dict[<span className="text-[#61AFEF]">str</span>, Any]:</div>
                <div className="text-gray-500">        """</div>
                <div className="text-gray-500">        Layer 1: The Local Data Harmonizer processes chaotic IoT time-series data.</div>
                <div className="text-gray-500">        Predicts system stress milliseconds before physical failure.</div>
                <div className="text-gray-500">        """</div>
                <div>        harmonized_state = <span className="text-[#C678DD]">await</span> <span className="text-[#D19A66]">self</span>.harmonizer.process_stream(raw_data_stream)</div>
                <div>        <span className="text-[#C678DD]">return</span> harmonized_state</div>
                <br/>
                <div>    <span className="text-[#C678DD]">async def</span> <span className="text-[#61AFEF]">evaluate_state</span>(<span className="text-[#D19A66]">self</span>, harmonized_state: Dict[<span className="text-[#61AFEF]">str</span>, Any]) -&gt; <span className="text-[#D19A66]">None</span>:</div>
                <div className="text-gray-500">        """</div>
                <div className="text-gray-500">        Layer 2 & 3: The Physics Engine evaluates the state. If safe, the </div>
                <div className="text-gray-500">        Agentic AI generates JSON command payloads for physical actuation.</div>
                <div className="text-gray-500">        """</div>
                <div className="text-gray-500">        # PINN evaluates humanitarian impact calculus</div>
                <div>        safety_status = <span className="text-[#D19A66]">self</span>.safety_engine.calculate_boundary_conditions(harmonized_state)</div>
                <br/>
                <div>        <span className="text-[#C678DD]">if</span> safety_status.threat_level == <span className="text-[#98C379]">"CRITICAL"</span>:</div>
                <div>            <span className="text-[#D19A66]">self</span>.execute_override(safety_status)</div>
                <div>        <span className="text-[#C678DD]">else</span>:</div>
                <div className="text-gray-500">            # Central Agentic AI issues precise, contained missions</div>
                <div>            action_payload = <span className="text-[#D19A66]">self</span>.control_plane.generate_dispatch(harmonized_state)</div>
                <div>            <span className="text-[#C678DD]">await</span> <span className="text-[#D19A66]">self</span>.sub_agents.execute_mission(action_payload)</div>
                <br/>
                <div>    <span className="text-[#C678DD]">def</span> <span className="text-[#61AFEF]">execute_override</span>(<span className="text-[#D19A66]">self</span>, safety_status: Any) -&gt; <span className="text-[#D19A66]">None</span>:</div>
                <div className="text-gray-500">        """</div>
                <div className="text-gray-500">        Hardcoded life-safety override. Bypasses generative AI logic completely </div>
                <div className="text-gray-500">        to execute deterministic physical containment (e.g., algorithmic fire containment).</div>
                <div className="text-gray-500">        """</div>
                <div>        <span className="text-[#E5C07B]">PINN_Safety_Protocol</span>.initiate(</div>
                <div>            threat_vector=safety_status.threat_type,</div>
                <div>            containment_strategy=<span className="text-[#98C379]">"MAXIMUM_ISOLATION"</span></div>
                <div>        )</div>
                <div>        <span className="text-[#D19A66]">self</span>.microgrid.route_emergency_power()</div>
                <div>        <span className="text-[#D19A66]">self</span>.sub_agents.deploy_emergency_fleet()</div>
                <br/>
                <div className="text-gray-500"># Initialize the Habitat</div>
                <div><span className="text-[#C678DD]">if</span> __name__ == <span className="text-[#98C379]">"__main__"</span>:</div>
                <div>    aegis_alpha = <span className="text-[#E5C07B]">AegisTower</span>()</div>
                <div>    asyncio.run(aegis_alpha.boot_sequence())</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Interactive Flowchart */}
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="relative h-full flex flex-col justify-between min-h-[500px] lg:pl-12">
            {/* Glowing SVG Connectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
              <motion.path 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                d="M 32,80 L 32,420" 
                fill="none" 
                stroke="#00F0FF" 
                strokeWidth="2" 
                className="opacity-50"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Nodes */}
            {[
              { 
                icon: Zap, 
                label: "Energy Layer: Tri-Generation Microgrid", 
                delay: 0.8,
                desc: "Uninterruptible solid-state battery backup and tri-generation routing switch distributed across floor-level nodes."
              },
              { 
                icon: Shield, 
                label: "Envelope Layer: Active Bioclimatic Skin", 
                delay: 1.0,
                desc: "Kinetic louvers and electrochromic glass controllers integrated into the floor's exterior perimeter."
              },
              { 
                icon: Database, 
                label: "Foundation Layer: Fiber-Optic Nervous System", 
                delay: 1.2,
                desc: "Embedded directly into the concrete slab during the pour to continuously measure structural load, strain, and seismic micro-fractures."
              }
            ].map((node, i) => (
              <motion.div 
                key={i}
                variants={textFadeUp}
                className="relative z-10 flex items-start gap-6"
              >
                <div className="w-16 h-16 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex flex-shrink-0 items-center justify-center relative mt-1">
                  <div className="absolute inset-0 bg-[#00F0FF] blur-xl opacity-20 rounded-full" />
                  <node.icon className="w-6 h-6 text-[#00F0FF]" />
                </div>
                <div className="liquid-glass border border-white/10 rounded-2xl px-6 py-4 flex-1">
                  <div className="font-mono text-xs text-[#00F0FF] mb-2">NODE 0{3 - i}</div>
                  <div className="text-white text-sm md:text-base font-bold mb-2">{node.label}</div>
                  <p className="text-sm text-gray-400 leading-relaxed">{node.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
        </div>
      </div>
    </motion.div>
  );
}
