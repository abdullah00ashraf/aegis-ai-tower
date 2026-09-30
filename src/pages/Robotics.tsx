import { motion } from 'framer-motion';
import { Layers, Wind, Crosshair, Wrench } from 'lucide-react';
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


export default function Robotics() {
  return (
    <motion.main 
      initial="initial" animate="animate" exit="exit" variants={pageVariants}
      className="relative w-full min-h-screen overflow-x-hidden flex flex-col font-sans bg-transparent"
    >

      <div className="fixed inset-0 bg-black/40 z-[0] pointer-events-none" />

      {/* Content Wrapper */}
      <div className="max-w-7xl mx-auto px-6 py-32 relative z-10 w-full flex-1 flex flex-col">
        
        {/* HEADER SECTION */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="mb-24">
          <motion.div variants={textFadeUp} className="text-xs uppercase tracking-widest text-white/50 mb-4">
            API-First Hardware Integration
          </motion.div>
          <motion.h1 variants={textFadeUp} className="text-6xl md:text-8xl text-white font-serif mb-6 leading-tight">
            The Robotic Immune System.
          </motion.h1>
          <motion.p variants={textFadeUp} className="text-lg text-white/70 max-w-2xl leading-relaxed">
            Aegis translates digital cognition into physical action. A parallel shadow infrastructure eliminates the need for human facility management entirely.
          </motion.p>
        </motion.div>

        {/* THE BENTO-BOX GRID */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 auto-rows-[300px] gap-6"
        >
          {/* Box 1 */}
          <motion.div variants={textFadeUp} className="md:col-span-8 liquid-glass rounded-3xl p-8 md:p-10 flex flex-col justify-between group hover:scale-[1.02] transition-transform">
            <Layers className="w-8 h-8 text-white/60 mb-4" />
            <div>
              <h2 className="text-3xl font-serif text-white mb-2">Parallel Shadow Infrastructure</h2>
              <p className="text-sm text-white/60 max-w-xl leading-relaxed">
                A secondary network of robot-only service elevators and hidden shafts. Micro-drone swarms move throughout the building without ever sharing space with residents.
              </p>
            </div>
          </motion.div>

          {/* Box 2 */}
          <motion.div variants={textFadeUp} className="md:col-span-4 liquid-glass rounded-3xl p-8 flex flex-col justify-between group hover:scale-[1.02] transition-transform bg-[#0a0a0a]/50">
            <Wind className="w-8 h-8 text-white/60 mb-4" />
            <div>
              <h2 className="text-2xl font-serif text-white mb-2">AVAC & Life Safety</h2>
              <p className="text-sm text-white/60 leading-relaxed mb-3">
                Floor-level automated pneumatic vacuum waste valves with seamless chute integration.
              </p>
              <div className="text-xs uppercase tracking-widest text-white/40 font-medium mb-1 mt-2">Life Safety Actuators</div>
              <p className="text-sm text-white/60 leading-relaxed">
                Motorized, AI-controlled HVAC oxygen sealers and localized suppression valves.
              </p>
            </div>
          </motion.div>

          {/* Box 3 */}
          <motion.div variants={textFadeUp} className="md:col-span-4 liquid-glass rounded-3xl p-8 flex flex-col justify-between group hover:scale-[1.02] transition-transform bg-[#0a0a0a]/50">
            <Crosshair className="w-8 h-8 text-white/60 mb-4" />
            <div>
              <h2 className="text-2xl font-serif text-white mb-2">Micro-Drone Swarms</h2>
              <p className="text-sm text-white/60 leading-relaxed">
                Indoor thermal-vision drones deployed from automated charging docks hidden securely within the ceiling void.
              </p>
            </div>
          </motion.div>

          {/* Box 4 */}
          <motion.div variants={textFadeUp} className="md:col-span-8 liquid-glass rounded-3xl p-8 md:p-10 flex flex-col justify-between group hover:scale-[1.02] transition-transform">
            <Wrench className="w-8 h-8 text-white/60 mb-4" />
            <div>
              <h2 className="text-3xl font-serif text-white mb-2">KUKA Maintenance Arms</h2>
              <p className="text-sm text-white/60 max-w-xl leading-relaxed">
                Lightweight, track-mounted exterior robotic arm deployed for facade cleaning, window repair, and emergency structural bracing.
              </p>
            </div>
          </motion.div>
        </motion.div>


      </div>
    </motion.main>
  );
}
