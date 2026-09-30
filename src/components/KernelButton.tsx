import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function KernelButton() {
  return (
    <Link to="/kernel" className="relative z-50 pointer-events-auto">
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ 
          opacity: 1,
          y: 0,
          boxShadow: ["0 0 0px #06b6d4", "0 0 15px rgba(6,182,212,0.4)", "0 0 0px #06b6d4"] 
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="liquid-glass border border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400 rounded-full py-3 px-6 text-xs sm:text-sm font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-3 overflow-hidden"
      >
        <Terminal size={16} />
        <span>Aegis System Kernel</span>
        
        {/* Neon Online Indicator */}
        <div className="flex items-center gap-1.5 ml-2 border-l border-cyan-500/30 pl-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-[10px] text-cyan-500 tracking-wider">ONLINE</span>
        </div>
      </motion.div>
    </Link>
  );
}
