import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from '../components/Toast';

export const pageVariants = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(10px)' },
  transition: { duration: 0.8, ease: 'easeInOut' }
};

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

// Simple FadeIn Component
function FadeIn({ 
  children, 
  delay = 0, 
  duration = 1000, 
  className = "" 
}: { 
  children: React.ReactNode, 
  delay?: number, 
  duration?: number, 
  className?: string 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-opacity ${className}`} 
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transitionDuration: `${duration}ms` 
      }}
    >
      {children}
    </div>
  );
}

// AnimatedHeading Component
function AnimatedHeading({ 
  text, 
  initialDelay = 200, 
  charDelay = 30, 
  className = "", 
  style = {} 
}: { 
  text: string, 
  initialDelay?: number, 
  charDelay?: number, 
  className?: string, 
  style?: React.CSSProperties 
}) {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay]);

  const lines = text.split('\n');

  return (
    <h1 className={className} style={style}>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className="block overflow-hidden">
          {line.split('').map((char, charIndex) => {
            const delayMs = (lineIndex * line.length * charDelay) + (charIndex * charDelay);
            return (
              <span
                key={charIndex}
                className="inline-block transition-all duration-500 ease-out"
                style={{
                  opacity: startAnimation ? 1 : 0,
                  transform: startAnimation ? 'translateX(0)' : 'translateX(-18px)',
                  transitionDelay: `${startAnimation ? delayMs : 0}ms`
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </div>
      ))}
    </h1>
  );
}

export default function Vision() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeModal]);

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans text-white bg-transparent overflow-x-hidden selection:bg-white selection:text-black">

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen w-full px-6 md:px-12 lg:px-16 pt-6 pb-12 lg:pb-16 pointer-events-none">
        
        {/* Navbar */}
        <div className="w-full pointer-events-auto z-40">
          <div className="liquid-glass mx-auto max-w-6xl rounded-2xl px-6 py-4 flex items-center justify-between mb-16 mt-8">
            {/* Left Side */}
            <Link to="/">
              <h2 className="text-xl font-bold tracking-widest text-white uppercase hover:text-white/80 transition-colors">Aegis Tower</h2>
            </Link>
            
            {/* Right Side */}
            <div className="flex gap-6 md:gap-10">
              {['Story', 'Investing', 'Building', 'Advisory'].map((link) => {
                const modalId = link.toLowerCase();
                return (
                  <button
                    key={modalId}
                    onClick={() => setActiveModal(modalId)}
                    className="text-sm text-white/70 hover:text-white transition-colors cursor-pointer capitalize font-medium"
                  >
                    {link}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hero Content (Pushed to bottom) */}
        <div className="flex-1 flex flex-col justify-end pointer-events-auto">
          <div className="lg:grid lg:grid-cols-2 lg:items-end w-full">
            
            {/* Left Column */}
            <div className="flex-1">
              <AnimatedHeading 
                text={"Architecting the\nzero-human frontier."}
                className="font-['Instrument_Serif'] text-6xl md:text-8xl font-normal mb-4 tracking-tight text-white drop-shadow-lg"
              />
              
              <FadeIn delay={800} duration={1000}>
                <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed mt-6 mb-8">
                  We are DeepTech systems architects, not real estate developers. The Aegis initiative replaces the latency of human facility management with a deterministic Operating System. A 26-floor structural nervous system where predictive telemetry meets autonomous robotic actuation—permanently eliminating maintenance OpEx and redefining physical infrastructure.
                </p>
              </FadeIn>
              
              <FadeIn delay={1200} duration={1000} className="flex flex-wrap gap-4">
                <button onClick={() => toast("Opening Investor Portal...", "info")} className="bg-white text-black px-6 py-3 rounded-full font-medium text-sm hover:scale-105 transition-transform">
                  Access Investor Portal
                </button>
                <button onClick={() => toast("Opening Whitepaper...", "info")} className="liquid-glass text-white px-6 py-3 rounded-full font-medium text-sm hover:scale-105 transition-transform">
                  Read the Whitepaper
                </button>
              </FadeIn>
            </div>

            {/* Right Column */}
            <div className="flex items-end justify-start lg:justify-end mt-8 lg:mt-0">
              <FadeIn delay={1400} duration={1000}>
                <div className="liquid-glass px-6 py-3 rounded-full text-white/80 text-sm tracking-widest uppercase font-medium">
                  Predictive. Deterministic. Autonomous.
                </div>
              </FadeIn>
            </div>
            
          </div>
        </div>

      </div>

      {/* Terminal Overlay Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/60 backdrop-blur-md pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="liquid-glass-strong w-full max-w-5xl max-h-[85vh] rounded-3xl flex flex-col overflow-hidden relative shadow-2xl border border-white/10"
            >
              {/* Terminal Top Bar */}
              <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-xl sticky top-0 z-20">
                <span className="font-mono text-xs text-[#00F0FF] uppercase tracking-widest">
                  // SYSTEM.VISION.{activeModal}
                </span>
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex items-center justify-center text-white/70 hover:text-white transition-colors bg-white/5 w-8 h-8 rounded-full"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Terminal Content Area */}
              <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar flex-1 relative">
                {activeModal === 'story' && (
                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid lg:grid-cols-2 gap-16 items-center h-full">
                    <motion.div variants={staggerContainer}>
                      <motion.h3 variants={textFadeUp} className="font-['Instrument_Serif'] text-5xl text-white mb-6 leading-tight">
                        The latency of human reaction is costing us the future.
                      </motion.h3>
                      <motion.p variants={textFadeUp} className="text-gray-400 text-lg leading-relaxed mb-6 font-['Inter']">
                        For a decade, the tech industry poured billions into 'smart cities'—sensors that monitor every thermal spike, micro-fracture, and energy leak. But we realized a catastrophic flaw: we were generating petabytes of diagnostic data, only to hand it to a human facility manager and wait hours for them to turn a wrench.
                      </motion.p>
                      <motion.p variants={textFadeUp} className="text-gray-400 text-lg leading-relaxed font-['Inter']">
                        Aegis was born from this frustration. We are not architects; we are deep-tech systems engineers who realized that predicting a failure is useless if you cannot autonomously prevent it. We built Aegis to close the loop—to create the first habitat that doesn't just think, but acts.
                      </motion.p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="liquid-glass-strong p-8 rounded-3xl flex flex-col justify-center items-center text-center aspect-square relative">
                      <div className="absolute inset-0 bg-[#00F0FF]/5 blur-3xl rounded-full" />
                      <div className="w-20 h-20 rounded-full border border-[#00F0FF]/30 flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 rounded-full border border-[#00F0FF] animate-ping opacity-20" />
                        <div className="w-2 h-2 bg-[#00F0FF] rounded-full" />
                      </div>
                      <p className="text-white/80 font-medium tracking-wide leading-relaxed relative z-10 max-w-[80%]">
                        Closing the loop between digital cognition and physical actuation.
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                {activeModal === 'investing' && (
                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-12 h-full">
                    <motion.div variants={staggerContainer} className="text-center">
                      <motion.h3 variants={textFadeUp} className="font-['Instrument_Serif'] text-5xl text-center text-white">
                        The concrete is just the Trojan Horse.
                      </motion.h3>
                      <motion.p variants={textFadeUp} className="text-[#00F0FF] tracking-widest uppercase text-sm text-center mt-4 font-['Inter']">
                        Why backing Aegis is a high-margin software play, disguised as infrastructure.
                      </motion.p>
                    </motion.div>
                    <motion.div variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
                      <motion.div variants={textFadeUp} className="liquid-glass p-8 rounded-2xl flex flex-col font-['Inter']">
                        <h4 className="text-xl font-bold text-white mb-4">The OS Play</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">You aren't funding a 26-story building. You are funding Aegis OS—a proprietary, hardware-agnostic neural architecture. Once proven here, this operating system becomes a highly licensable SaaS product for every legacy developer on the planet.</p>
                      </motion.div>
                      <motion.div variants={textFadeUp} className="liquid-glass p-8 rounded-2xl flex flex-col font-['Inter']">
                        <h4 className="text-xl font-bold text-white mb-4">The Death of OpEx</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">Real estate is plagued by the bleeding of operational expenditures. By replacing manual facility management with a robotic immune system and agentic workflows, we mathematically eliminate long-term OpEx. It is a transition from recurring human liability to permanent, zero-touch efficiency.</p>
                      </motion.div>
                      <motion.div variants={textFadeUp} className="liquid-glass p-8 rounded-2xl flex flex-col font-['Inter']">
                        <h4 className="text-xl font-bold text-white mb-4">The First-Mover Monopoly</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">Infrastructure has not seen a platform shift since the invention of the elevator. Aegis is creating an entirely new asset class: the Autonomous Habitat. The first movers to back this neural architecture will own the foundational IP of tomorrow's cities.</p>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}

                {activeModal === 'building' && (
                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid lg:grid-cols-[1fr_1.5fr] gap-12 h-full">
                    <motion.div variants={staggerContainer}>
                      <motion.h3 variants={textFadeUp} className="font-['Instrument_Serif'] text-5xl text-white mb-6">
                        A skeleton wired for cognition.
                      </motion.h3>
                      <motion.p variants={textFadeUp} className="text-gray-400 text-lg leading-relaxed font-['Inter']">
                        Building Aegis requires discarding traditional construction methodology. We pour fiber-optic nervous systems directly into biological, self-healing concrete. We embed Tri-Generation microgrids that sever reliance on fragile municipal power grids. The physical envelope of this tower is designed exclusively to serve as the hardware for our Central Agentic AI.
                      </motion.p>
                    </motion.div>
                    <motion.div variants={staggerContainer} className="flex flex-col justify-center">
                      <motion.div variants={textFadeUp} className="liquid-glass p-6 rounded-2xl mb-4 border-l-2 border-[#00F0FF] font-['Inter']">
                        <p className="text-white/80 leading-relaxed text-sm">
                          <span className="font-bold text-white block mb-1">Layer 1: Telemetry Ingestion</span>
                          Millions of acoustic, thermal, and spatial data points flow from the physical shell into the Local Data Harmonizer every millisecond.
                        </p>
                      </motion.div>
                      <motion.div variants={textFadeUp} className="liquid-glass p-6 rounded-2xl mb-4 border-l-2 border-[#00F0FF] font-['Inter']">
                        <p className="text-white/80 leading-relaxed text-sm">
                          <span className="font-bold text-white block mb-1">Layer 2: The Override</span>
                          The Physics-Informed Neural Network (PINN) evaluates the data against the unbreakable laws of thermodynamics and structural fluid dynamics.
                        </p>
                      </motion.div>
                      <motion.div variants={textFadeUp} className="liquid-glass p-6 rounded-2xl mb-4 border-l-2 border-[#00F0FF] font-['Inter']">
                        <p className="text-white/80 leading-relaxed text-sm">
                          <span className="font-bold text-white block mb-1">Layer 3: Actuation</span>
                          The AI dispatches a deterministic JSON payload to the shadow infrastructure—triggering KUKA maintenance arms, drone swarms, and algorithmic fire dampers.
                        </p>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}

                {activeModal === 'advisory' && (
                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="h-full">
                    <motion.div variants={staggerContainer} className="text-center">
                      <motion.h3 variants={textFadeUp} className="font-['Instrument_Serif'] text-5xl text-white mb-6">
                        Unhackable determinism.
                      </motion.h3>
                      <motion.p variants={textFadeUp} className="text-center text-gray-400 text-xl max-w-3xl mx-auto font-['Inter']">
                        How we satisfy regulators, eliminate AI hallucination, and guarantee civic safety.
                      </motion.p>
                    </motion.div>
                    <motion.div variants={staggerContainer} className="grid md:grid-cols-2 gap-8 mt-8">
                      <motion.div variants={textFadeUp} className="liquid-glass p-8 rounded-2xl font-['Inter']">
                        <h4 className="text-lg font-bold text-white mb-2">RERA India & Legal Compliance</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          To bridge the gap between autonomous innovation and the Indian Real Estate Regulatory Authority (RERA), Aegis incorporates a 'Bonded Architect' protocol. A licensed human overseer retains a master cryptographic key for legal liability, seamlessly blending DeepTech autonomy with strict civic code.
                        </p>
                      </motion.div>
                      <motion.div variants={textFadeUp} className="liquid-glass p-8 rounded-2xl font-['Inter']">
                        <h4 className="text-lg font-bold text-white mb-2">The Boundary Conditions (PINN)</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          Generative AI hallucinates. Aegis does not. Our Physics & Safety Engine embeds the Navier-Stokes equations directly into its loss function. If the Agentic AI attempts an actuation that violates physical reality, the system triggers a hardcoded, unhackable rejection.
                        </p>
                      </motion.div>
                      <motion.div variants={textFadeUp} className="liquid-glass p-8 rounded-2xl font-['Inter']">
                        <h4 className="text-lg font-bold text-white mb-2">Air-Gapped Local Compute</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          Life-safety decisions cannot rely on cloud latency or external network vulnerabilities. Aegis operates on industrial-grade, air-gapped localized edge clusters. It thinks, decides, and acts entirely on-premise.
                        </p>
                      </motion.div>
                      <motion.div variants={textFadeUp} className="liquid-glass p-8 rounded-2xl font-['Inter']">
                        <h4 className="text-lg font-bold text-white mb-2">Humanitarian Impact Calculus</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          In edge-case disaster scenarios—seismic events or flashover fires—the AI prioritizes human life above all structural preservation. Micro-drone swarms verify evacuation, while automated dampers isolate threats before municipal responders even arrive.
                        </p>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
