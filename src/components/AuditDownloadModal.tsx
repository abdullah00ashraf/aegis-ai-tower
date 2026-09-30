import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from './Toast';

interface AuditDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PUBLIC_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];

export default function AuditDownloadModal({ isOpen, onClose }: AuditDownloadModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const validateCorporateEmail = (emailAddress: string) => {
    if (!emailAddress) return false;
    const parts = emailAddress.split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1].toLowerCase();
    return !PUBLIC_DOMAINS.includes(domain) && domain.includes('.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateCorporateEmail(email)) {
      setError('Please provide a valid corporate email address.');
      return;
    }

    setIsDownloading(true);
    
    // Simulate verification delay for DeepTech aesthetic
    setTimeout(() => {
      handleDownload();
      setIsDownloading(false);
      toast("Download secure channel established. Transfer complete.", "success");
      onClose();
    }, 1500);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/documents/mumbai_tower_audit.pdf'; // Direct path to the public folder
    link.setAttribute('download', 'Aegis_Mumbai_Operational_Audit.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-[16px]"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="liquid-glass border border-white/10 p-8 md:p-10 rounded-3xl max-w-lg w-full relative overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-8 h-8 text-cyan-400" />
                <h2 className="font-serif text-2xl text-white">Secure Portal</h2>
              </div>
              <p className="text-sm text-gray-400 font-sans leading-relaxed">
                The Mumbai Operational Audit contains proprietary architectural and telemetry blueprints. Please verify your corporate identity to proceed.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-widest text-cyan-400 mb-2 font-mono">
                  Corporate Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="name@company.com"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-sans"
                  required
                />
                {error && (
                  <div className="flex items-center gap-2 mt-2 text-red-400 text-xs font-mono">
                    <AlertCircle size={12} /> {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isDownloading}
                className="w-full liquid-glass border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] rounded-xl py-4 font-mono text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <span className="animate-pulse flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <Download size={16} /> Request Secure Download
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
