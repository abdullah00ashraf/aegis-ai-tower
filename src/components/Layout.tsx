import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Fingerprint, User, Menu, X } from 'lucide-react';
import { toast } from './Toast';
import GlobalBackground from './GlobalBackground';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isVisionPage = location.pathname === '/vision';

  const navLinks = [
    { name: 'The Vision', path: '/vision', delay: '100ms' },
    { name: 'Architecture', path: '/architecture', delay: '150ms' },
    { name: 'Agentic AI', path: '/agentic-ai', delay: '200ms' },
    { name: 'Robotics', path: '/robotics', delay: '250ms' },
    { name: 'Simulations', path: '/simulations', delay: '300ms' },
    { name: 'Spatial Twin', path: '/spatial-twin', delay: '350ms' },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-transparent font-sans text-white selection:bg-white selection:text-black">
      <GlobalBackground />

      {/* Global Navbar (Hidden on Vision page since it has its own) */}
      {!isVisionPage && (
        <nav className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-6 md:px-12 py-4 md:py-6 w-full pointer-events-auto">
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.8}} className="h-8 md:h-10 flex items-center text-white font-semibold tracking-widest text-xl">
            <Link to="/">AEGIS TOWER</Link>
          </motion.div>
          
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <motion.div key={link.name} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.8, delay: idx*0.05 + 0.1}}>
                <Link to={link.path} className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <motion.button initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.8, delay: 0.35}} onClick={() => toast("Secure channel opening...", "info")} className="hidden sm:flex items-center gap-2 rounded-full liquid-glass text-white px-4 md:px-6 py-2 text-sm font-medium hover:scale-105 transition-transform">
              <Fingerprint size={18} /><span>Access</span>
            </motion.button>
            <motion.button initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.8, delay: 0.4}} onClick={() => toast("User profile coming soon", "info")} className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full liquid-glass text-white hover:scale-105 transition-transform">
              <User size={18} />
            </motion.button>
            <motion.button initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.8, delay: 0.35}} className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full liquid-glass text-white relative" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={18} className={`absolute transition-all duration-500 ease-out ${isMobileMenuOpen ? 'rotate-180 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`} />
              <X size={18} className={`absolute transition-all duration-500 ease-out ${!isMobileMenuOpen ? '-rotate-180 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`} />
            </motion.button>
          </div>
        </nav>
      )}

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8 text-2xl font-medium tracking-wide">

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-4 mt-8">
                <button onClick={() => { setIsMobileMenuOpen(false); toast("Secure channel opening...", "info"); }} className="flex items-center gap-2 rounded-full liquid-glass text-white px-6 py-3 text-lg font-medium hover:scale-105 transition-transform">
                  <Fingerprint size={20} /><span>Access</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Content with Routing Transitions */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="flex-1 w-full relative"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

    </div>
  );
}
