import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Printer, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import mermaid from 'mermaid';
import { useNavigate } from 'react-router-dom';
import { reportContent } from '../assets/reportData';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'monospace'
});

export default function AegisKernel() {
  const navigate = useNavigate();

  // Handle ESC key to return home
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Handle Mermaid rendering
  useEffect(() => {
    // Small timeout to ensure DOM is ready
    setTimeout(() => {
      try {
        mermaid.run({ querySelector: '.mermaid' });
      } catch (error) {
        console.error("Mermaid rendering failed:", error);
      }
    }, 100);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-8"
    >
      {/* Subtle Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }}
      />

      {/* Terminal Container */}
      <motion.div
        initial={{ scale: 0.98, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.98, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="liquid-glass border border-cyan-500/30 w-full max-w-6xl h-full max-h-[95vh] rounded-2xl flex flex-col relative z-10 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.05)]"
      >
        {/* Terminal Header */}
        <div className="bg-black/80 border-b border-cyan-500/30 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Terminal className="text-cyan-400 w-5 h-5" />
            <span className="font-mono text-cyan-400 tracking-widest uppercase text-sm font-semibold">
              Aegis System Core // Root Access
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors font-mono text-xs uppercase tracking-wider"
            >
              <Printer size={14} /> Export
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-colors"
              title="Close Kernel (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Terminal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 relative bg-transparent">
          <div className="max-w-4xl mx-auto font-mono text-gray-300">
            <div className="
                [&>h1]:text-4xl [&>h1]:text-white [&>h1]:mb-8 [&>h1]:border-b [&>h1]:border-cyan-500/20 [&>h1]:pb-4
                [&>h2]:text-2xl [&>h2]:text-cyan-400 [&>h2]:mt-12 [&>h2]:mb-6
                [&>h3]:text-xl [&>h3]:text-white/90 [&>h3]:mt-8 [&>h3]:mb-4
                [&>p]:mb-6 [&>p]:leading-relaxed
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-8 [&>ul]:space-y-2
                [&>li]:text-gray-400
                [&>hr]:border-cyan-500/20 [&>hr]:my-10
                [&>table]:w-full [&>table]:mb-8 [&>table]:text-left [&>table]:border-collapse
                [&_th]:border-b [&_th]:border-cyan-500/30 [&_th]:p-3 [&_th]:text-cyan-400
                [&_td]:border-b [&_td]:border-white/5 [&_td]:p-3 [&_td]:text-gray-400
                [&_strong]:text-white
              ">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    if (!inline && match && match[1] === 'mermaid') {
                      return (
                        <div className="mermaid my-8 bg-black/40 p-6 rounded-xl border border-white/5 flex justify-center">
                          {String(children).replace(/\n$/, '')}
                        </div>
                      )
                    }
                    return (
                      <code className={`${className} bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded text-sm`} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {reportContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
