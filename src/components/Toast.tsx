import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps {
  id: number;
  message: string;
  type?: ToastType;
}

let toastCount = 0;
type Subscriber = (toast: ToastProps) => void;
const subscribers = new Set<Subscriber>();

export const toast = (message: string, type: ToastType = 'info') => {
  const id = ++toastCount;
  subscribers.forEach((sub) => sub({ id, message, type }));
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const handleToast = (newToast: ToastProps) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    };

    subscribers.add(handleToast);
    return () => {
      subscribers.delete(handleToast);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="liquid-glass-strong text-white px-6 py-3 rounded-xl shadow-lg border border-white/10 text-sm font-medium tracking-wide flex items-center gap-3 backdrop-blur-xl"
          >
            <div className={`w-2 h-2 rounded-full ${
              t.type === 'success' ? 'bg-green-400' :
              t.type === 'error' ? 'bg-red-400' :
              t.type === 'warning' ? 'bg-yellow-400' : 'bg-[#00F0FF]'
            } animate-pulse`} />
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
