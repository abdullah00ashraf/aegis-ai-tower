import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SmoothRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
}

export const SmoothReveal = ({ children, direction = 'up', delay = 0 }: SmoothRevealProps) => {
  // Map directions to starting coordinates for the slide-in effect
  const directionOffsets = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 }
  };

  const initialOffset = directionOffsets[direction];

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...initialOffset 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ 
        once: true, // Only animate once so it doesn't flicker when scrolling up and down
        margin: "-10%" // Triggers slightly before it enters the screen for a seamless feel
      }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // A highly premium, DeepTech cubic-bezier easing
        delay: delay
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};
