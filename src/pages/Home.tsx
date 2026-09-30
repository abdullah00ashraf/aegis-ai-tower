import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Menu, ShieldCheck, Fingerprint, Terminal, MapPin, Mail, Plus, 
  Globe, Cpu, 
  Database, ShieldAlert, Layers, Wind, Wrench, FileText
} from 'lucide-react';
import { toast } from '../components/Toast';
import { SmoothReveal } from '../components/SmoothReveal';
import KernelButton from '../components/KernelButton';

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

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

const blurFadeUp: any = {
  initial: { opacity: 0, filter: 'blur(20px)', y: 40 },
  whileInView: { opacity: 1, filter: 'blur(0px)', y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: "easeOut" }
};

export const pageVariants = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(10px)' },
  transition: { duration: 0.8, ease: 'easeInOut' }
};

export default function Home() {
  
  

  

  return (
    <motion.div
      initial="initial" animate="animate" exit="exit" variants={pageVariants}
      className="relative w-full flex flex-col bg-transparent font-sans text-white selection:bg-white selection:text-black"
    >
      
      {/* =========================================
          SECTION 1: CINEMATIC HERO
          ========================================= */}
      <section className="relative h-screen w-full flex flex-col overflow-hidden bg-transparent">
        <div 
          className="absolute inset-0 z-[1] pointer-events-none backdrop-blur-xl"
          style={{
            WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 45%)',
            maskImage: 'linear-gradient(to top, black 0%, transparent 45%)'
          }}
        />
        
        {/* Navbar */}
        

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-end px-4 sm:px-6 md:px-12 pb-8 md:pb-16 w-full max-w-[1600px] mx-auto pointer-events-none">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 w-full pointer-events-auto">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="flex-1 max-w-4xl">
              <motion.div variants={textFadeUp} className="flex flex-wrap items-center gap-3 sm:gap-6 mb-6 md:mb-8 text-xs sm:text-sm text-white">
                <div className="flex items-center gap-2"><Globe className="w-4 h-4 sm:w-5 sm:h-5 fill-white" /><span className="font-medium tracking-wide">Global First</span></div>
                <div className="flex items-center gap-2"><Cpu className="w-4 h-4 sm:w-5 sm:h-5" /><span className="tracking-wide">Closed-Loop AI</span></div>
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" /><span className="tracking-wide">Physics Safeguards</span></div>
              </motion.div>
              <motion.h1 variants={textFadeUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white mb-4 md:mb-6" style={{ letterSpacing: '-0.04em' }}>
                Beyond human. Build the autonomous.
              </motion.h1>
              <motion.p variants={textFadeUp} className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 md:mb-12 max-w-2xl leading-relaxed">
                A 26-floor structural nervous system. Powered by the Central Agentic AI, safeguarded by Physics-Informed Neural Networks, and maintained by a silent robotic fleet.
              </motion.p>
              <motion.div variants={textFadeUp} className="flex flex-wrap gap-4">
                <a 
                  href="/documents/mumbai_tower_audit.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative z-50 pointer-events-auto liquid-glass border border-white/20 text-white hover:bg-white/10 rounded-full py-3 px-6 text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <FileText size={18} /> View Operational Audit
                </a>
                <a 
                  href="/deck.html#intro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative z-50 pointer-events-auto bg-white text-black hover:bg-gray-200 rounded-full py-3 px-6 text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={18} /> Strategic Pitch Deck
                </a>
                <KernelButton />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 2: THE COGNITIVE ENGINE
          ========================================= */}
      <div className="w-full bg-black relative z-10">
      
      <SmoothReveal direction="up" delay={0.1}>
      <section className="relative max-w-7xl mx-auto py-32 px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="mb-16 text-center md:text-left">
          <motion.h2 variants={textFadeUp} className="font-serif text-5xl md:text-7xl mb-6">The Agentic Control Plane</motion.h2>
          <motion.p variants={textFadeUp} className="text-gray-400 max-w-2xl text-lg leading-relaxed">
            A three-tiered neural architecture replacing human facility management. From chaotic IoT telemetry to deterministic physical actuation.
          </motion.p>
        </motion.div>
        
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Database,
              title: "Local Data Harmonizer",
              desc: "Utilizes Bi-Directional LSTMs to process time-series data from petabytes of acoustic, thermal, and electrical telemetry. Predicts micro-stress milliseconds before physical failure."
            },
            {
              icon: ShieldAlert,
              title: "Physics & Safety Engine",
              desc: "A Physics-Informed Neural Network (PINN) simulating real-world thermodynamics and fluid dynamics. Evaluates humanitarian impact calculus and triggers unhackable physical overrides during life-safety events."
            },
            {
              icon: Cpu,
              title: "Central Agentic AI",
              desc: "The executive brain. Evaluates harmonized states and dispatches precise, contained JSON command payloads to a network of robotic sub-agents. Zero human-in-the-loop latency."
            }
          ].map((card, i) => (
            <motion.div 
              key={i}
              variants={textFadeUp}
              className="liquid-glass p-8 rounded-3xl group hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-4">{card.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
      </SmoothReveal>

      {/* =========================================
          SECTION 3: THE AUTONOMOUS ENVELOPE
          ========================================= */}
      <SmoothReveal direction="left" delay={0.2}>
      <section className="relative z-20 max-w-7xl mx-auto px-6 border-t border-white/5 py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...blurFadeUp}>
            <div className="liquid-glass-strong aspect-[4/3] rounded-[2.5rem] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute top-6 left-6 liquid-glass rounded-full px-4 py-1.5 text-[10px] uppercase tracking-widest font-medium z-10 text-white">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE TELEMETRY FEED
                </div>
              </div>
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_10%,transparent_100%)] group-hover:scale-105 transition-transform duration-1000" />
            </div>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="flex flex-col gap-8">
            <motion.h2 variants={textFadeUp} className="font-serif text-5xl md:text-6xl leading-tight">
              A skeleton wired for <span className="italic font-normal">cognition.</span>
            </motion.h2>
            
            <div className="flex flex-col gap-8 mt-4">
              {[
                { title: "Self-Healing Materials", desc: "Biological Self-Healing Concrete containing limestone-producing bacteria autonomously seals micro-cracks before structural compromise." },
                { title: "Fiber-Optic Nervous System", desc: "The structural envelope embeds fiber-optic sensors directly into the concrete foundation during the pour to continuously monitor strain, load, and seismic micro-fractures." },
                { title: "Active Bioclimatic Skin", desc: "The Central Agentic AI controls kinetic louvers and electrochromic glass to passively manage internal thermodynamics based on sun positioning." }
              ].map((feat, i) => (
                <motion.div 
                  key={i} 
                  variants={textFadeUp}
                >
                  <h3 className="text-xl font-medium mb-2">{feat.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm max-w-lg">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      </SmoothReveal>

      {/* =========================================
          SECTION 4: THE ROBOTIC IMMUNE SYSTEM
          ========================================= */}
      <SmoothReveal direction="up" delay={0.1}>
      <section className="relative z-20 max-w-7xl mx-auto py-32 px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.h2 variants={textFadeUp} className="font-serif text-5xl md:text-7xl">Zero-Touch Logistics</motion.h2>
          <motion.p variants={textFadeUp} className="text-gray-400 text-lg max-w-sm md:text-right">Eliminating the human maintenance variable.</motion.p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="flex flex-col gap-6">
          {[
            { icon: Layers, title: "Parallel Shadow Infrastructure", desc: "A secondary network of robot-only service elevators and hidden shafts. Micro-drone swarms move throughout the building without ever sharing space with residents." },
            { icon: Wind, title: "AVAC", desc: "The Automated Vacuum Waste system instantly routes trash from floor chutes directly to a subterranean autonomous sorting and compacting facility." },
            { icon: Wrench, title: "Micro-Drone Swarms & KUKA Maintenance Arms", desc: "The Central Agentic AI deploys micro-drone swarms dynamically to patch plumbing leaks, and KUKA Maintenance Arms to replace modular fixtures." }
          ].map((row, i) => (
            <motion.div 
              key={i}
              variants={textFadeUp}
              className="liquid-glass p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 group hover:bg-white/5 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center">
                <row.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-serif mb-2">{row.title}</h3>
                <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">{row.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
      </SmoothReveal>

      {/* =========================================
          SECTION 5: AUTONOMOUS LIFE SAFETY
          ========================================= */}
      <SmoothReveal direction="right" delay={0.2}>
      <section className="relative z-20 bg-white/5 py-32 px-6 text-center border-y border-white/5">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="max-w-4xl mx-auto mb-16">
          <motion.h2 variants={textFadeUp} className="font-serif text-4xl md:text-5xl leading-tight">The hardest challenge of autonomy is the edge case.</motion.h2>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            variants={textFadeUp}
            className="liquid-glass p-10 md:p-14 rounded-[2.5rem] flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500"
          >
            <h3 className="text-2xl font-medium mb-6">Algorithmic Fire Containment</h3>
            <p className="text-gray-400 leading-relaxed text-sm">The Central Agentic AI instantly shuts off localized oxygen flow via HVAC dampers, activates targeted suppression, and autonomously depressurizes adjacent floors to prevent smoke spread.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, filter: 'blur(20px)', y: 40 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="liquid-glass p-10 md:p-14 rounded-[2.5rem] flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500"
          >
            <h3 className="text-2xl font-medium mb-6">Dynamic Evacuation & Drones</h3>
            <p className="text-gray-400 leading-relaxed text-sm">Floor-level LED strips actively reroute occupants away from structural threats, while micro-drone swarms locate trapped residents before human first responders arrive.</p>
          </motion.div>
        </motion.div>
      </section>
      </SmoothReveal>

      {/* =========================================
          SECTION 6: COMPARISON MATRIX
          ========================================= */}
      <SmoothReveal direction="up" delay={0.1}>
      <section className="relative z-20 max-w-5xl mx-auto py-32 px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          <motion.h2 variants={textFadeUp} className="font-serif text-5xl md:text-6xl mb-16 text-center">System Efficiency Delta</motion.h2>
  
          <motion.div variants={textFadeUp} className="liquid-glass rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
          <div className="grid grid-cols-3 gap-4 pb-6 border-b border-white/10 mb-6">
            <div className="text-gray-500 font-medium text-xs tracking-widest uppercase">Metric</div>
            <div className="text-gray-500 font-medium text-xs tracking-widest uppercase text-center">Standard Smart Tower</div>
            <div className="text-white font-medium text-xs tracking-widest uppercase text-center">Aegis Tower</div>
          </div>
          
          {[
            { label: "Predictive Maint", std: "60%", aegis: "100%" },
            { label: "Energy Efficiency", std: "65%", aegis: "95%" },
            { label: "Staff Req", std: "80%", aegis: "0%" },
            { label: "Autonomy", std: "30%", aegis: "100%" }
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 py-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors -mx-8 md:-mx-12 px-8 md:px-12">
              <div className="text-gray-300 font-medium text-sm md:text-base">{row.label}</div>
              <div className="text-gray-500 text-center text-sm md:text-base">{row.std}</div>
              <div className="text-white font-bold text-center text-sm md:text-base drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{row.aegis}</div>
            </div>
          ))}
          </motion.div>
        </motion.div>
      </section>
      </SmoothReveal>

      {/* =========================================
          SECTION 7: DELIVERY ROADMAP
          ========================================= */}
      <SmoothReveal direction="up" delay={0.1}>
      <section className="relative z-20 max-w-3xl mx-auto py-32 px-6">
        <motion.h2 variants={textFadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="font-serif text-5xl md:text-6xl mb-16 text-center">Delivery Roadmap</motion.h2>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="relative border-l border-white/20 ml-4 pl-8 md:pl-12">
          {[
            { phase: "Phase 1 (Months 1-12)", title: "Digital Twin Simulation", desc: "Training the Physics & Safety Engine on 10 million synthetic disasters." },
            { phase: "Phase 2 (Months 13-36)", title: "Physical Core & Sensor Integration", desc: "Embedding the Fiber-Optic Nervous System and robotics into the Biological Self-Healing Concrete shell." },
            { phase: "Phase 3 (Months 37-48)", title: "Hardware Commissioning", desc: "Booting up the Local Data Harmonizer and robotic logistics network." },
            { phase: "Phase 4 (Months 49-60)", title: "Shadow Mode to Zero-Touch", desc: "Gradually stepping down human oversight until 100% lights-out autonomy is achieved." }
          ].map((node, i) => (
            <motion.div 
              key={i}
              variants={textFadeUp}
              className="relative liquid-glass p-8 rounded-[2rem] mb-12 group hover:-translate-y-2 transition-transform duration-500"
            >
              {/* Timeline Dot */}
              <div className="absolute top-8 -left-[2.35rem] md:-left-[3.35rem] w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
              
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">{node.phase}</div>
              <h3 className="text-2xl font-serif mb-2">{node.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{node.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
      </SmoothReveal>
      </div>

      {/* =========================================
          SECTION 8: CONNECT US (Two-Panel Split)
          ========================================= */}
      <SmoothReveal direction="up" delay={0.1}>
      <section className="relative z-20 min-h-screen w-full flex bg-black">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="relative z-10 flex flex-row min-h-screen w-full">
          {/* LEFT PANEL */}
          <div className="w-full lg:w-[52%] relative flex">
            <div className="liquid-glass-strong absolute inset-4 lg:inset-6 rounded-3xl p-8 flex flex-col">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-2xl tracking-widest text-white">AEGIS</div>
                <button onClick={() => toast("Opening global command menu...", "info")} className="liquid-glass rounded-full p-3 hover:scale-105 transition-transform duration-300">
                  <Menu className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <ShieldCheck className="w-12 h-12 text-white/80 mb-6" />
                <h1 className="text-6xl lg:text-7xl tracking-[-0.03em] text-white font-medium leading-[1.1] max-w-2xl">
                  Initiate a <br />
                  <span className="font-serif italic text-white/80 font-normal">secure handshake</span>
                </h1>
                <div>
                  <button onClick={() => toast("Submitting Credentials...", "info")} className="liquid-glass-strong rounded-full px-8 py-4 mt-8 flex items-center gap-4 hover:scale-105 active:scale-95 transition-transform duration-300">
                    <span className="text-white font-medium">Submit Credentials</span>
                    <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                      <Fingerprint className="w-4 h-4 text-white" />
                    </div>
                  </button>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="/deck.html#intro" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80 hover:scale-105 transition-transform duration-300 inline-block">Investor Relations</a>
                  <button onClick={() => toast("Downloading Press Kit...", "success")} className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80 hover:scale-105 transition-transform duration-300">Press Kit</button>
                  <button onClick={() => toast("Opening Whitepaper...", "info")} className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80 hover:scale-105 transition-transform duration-300">Whitepaper</button>
                </div>
              </div>

              <div className="mt-auto">
                <div className="text-xs tracking-widest uppercase text-white/50 mb-2 font-medium">GLOBAL COMMAND</div>
                <div className="text-lg text-white/80 max-w-md leading-relaxed mb-6">
                  "The future is not inhabited. <span className="font-serif italic font-normal">It is automated.</span>"
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-8 bg-white/20" />
                  <div className="text-xs tracking-wider text-white/50">— CENTRAL AI ORCHESTRATOR</div>
                  <div className="h-[1px] flex-1 max-w-[200px] bg-white/20" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="hidden lg:flex w-[48%] p-6 pl-0 flex-col h-full gap-4 relative z-10">
            <div className="flex justify-end gap-4">
              <div className="liquid-glass rounded-full flex items-center px-2 py-2 gap-2">
                <button onClick={() => toast("Opening Twitter/X...", "info")} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:scale-105 transition-transform duration-300"><TwitterIcon className="w-4 h-4 text-white/80" /></button>
                <button onClick={() => toast("Opening LinkedIn...", "info")} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:scale-105 transition-transform duration-300"><LinkedinIcon className="w-4 h-4 text-white/80" /></button>
                <button onClick={() => toast("Opening GitHub...", "info")} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:scale-105 transition-transform duration-300"><GithubIcon className="w-4 h-4 text-white/80" /></button>
              </div>
              <button onClick={() => toast("Opening Terminal...", "info")} className="liquid-glass rounded-full flex items-center justify-center px-6 py-2 hover:scale-105 transition-transform duration-300">
                <Terminal className="w-5 h-5 text-white/80" />
              </button>
            </div>

            <div className="liquid-glass-strong w-64 self-end p-6 rounded-3xl mt-12 hover:scale-105 transition-transform duration-300 cursor-default">
              <h3 className="text-white font-medium">Encrypted Channels</h3>
              <p className="text-sm text-white/60 mt-2 leading-relaxed">Connect directly with our engineering and deployment teams.</p>
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <div className="liquid-glass rounded-[2.5rem] p-4 flex flex-col gap-4">
                <div className="flex gap-4">
                  <button onClick={() => toast("Initiating secure comms...", "info")} className="liquid-glass rounded-3xl p-6 flex-1 flex flex-col items-start gap-4 hover:scale-105 transition-transform duration-300 text-left">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Mail className="w-4 h-4 text-white" /></div>
                    <span className="text-white font-medium">Direct Comms</span>
                  </button>
                  <button onClick={() => toast("Fetching coordinates...", "info")} className="liquid-glass rounded-3xl p-6 flex-1 flex flex-col items-start gap-4 hover:scale-105 transition-transform duration-300 text-left">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><MapPin className="w-4 h-4 text-white" /></div>
                    <span className="text-white font-medium">HQ Coordinates</span>
                  </button>
                </div>
                <button onClick={() => toast("Downloading specs...", "success")} className="liquid-glass p-4 rounded-3xl flex items-center justify-between hover:scale-105 transition-transform duration-300 w-full group">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex flex-col justify-between p-3 liquid-glass">
                      <div className="w-full h-0.5 bg-white/20 rounded-full" />
                      <div className="w-full h-0.5 bg-white/20 rounded-full" />
                      <div className="w-3/4 h-0.5 bg-white/20 rounded-full" />
                      <div className="w-full h-0.5 bg-white/20 rounded-full" />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium">System Architecture Manifest</div>
                      <div className="text-xs text-white/50 mt-1">Download technical specifications</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2 group-hover:bg-white/20 transition-colors">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </SmoothReveal>

      {/* =========================================
          SECTION 9: FOOTER COMPONENT
          ========================================= */}
      <SmoothReveal direction="up" delay={0.1}>
      <footer className="relative z-20 bg-black rounded-t-[2.5rem] p-8 md:p-16 text-white/70 mx-auto max-w-[2000px] w-full border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
            {/* Left */}
            <div className="md:col-span-5">
              <div className="text-2xl font-bold tracking-widest text-white">AEGIS TOWER</div>
              <p className="text-sm max-w-sm mt-4 text-white/70 leading-relaxed">
                Pioneering autonomy for habitats that think, adapt, and protect.
              </p>
            </div>
            
            {/* Right */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="flex flex-col space-y-3 text-xs">
                <Link to="/vision" className="hover:text-white transition-colors">The Vision</Link>
                <Link to="/architecture" className="hover:text-white transition-colors">Architecture</Link>
                <Link to="/agentic-ai" className="hover:text-white transition-colors">Agentic AI</Link>
              </div>
              <div className="flex flex-col space-y-3 text-xs">
                <Link to="/robotics" className="hover:text-white transition-colors">Robotics</Link>
                <Link to="/simulations" className="hover:text-white transition-colors">Simulations</Link>
                <Link to="#" onClick={(e) => { e.preventDefault(); toast("API Docs coming soon", "info"); }} className="hover:text-white transition-colors">API Docs</Link>
              </div>
              <div className="flex flex-col space-y-3 text-xs">
                <a href="/deck.html#intro" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Investor Portal</a>
                <Link to="#" onClick={(e) => { e.preventDefault(); toast("Compliance page coming soon", "info"); }} className="hover:text-white transition-colors">Compliance</Link>
                <Link to="#" onClick={(e) => { e.preventDefault(); toast("Whitepaper coming soon", "info"); }} className="hover:text-white transition-colors">Whitepaper</Link>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
              Global Infrastructure IP
            </span>
            <div className="flex items-center gap-6">
              <a href="#" onClick={(e) => { e.preventDefault(); toast("Opening social link...", "info"); }} className="opacity-70 hover:opacity-100 transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); toast("Opening social link...", "info"); }} className="opacity-70 hover:opacity-100 transition-colors">
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); toast("Opening social link...", "info"); }} className="opacity-70 hover:opacity-100 transition-colors">
                <GithubIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      </SmoothReveal>

    </motion.div>
  );
}
