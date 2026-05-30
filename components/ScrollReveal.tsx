'use client'
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
}

export default function ScrollReveal({ children, delay = 0, direction = 'up', duration = 1.2 }: ScrollRevealProps) {
  const getDirections = () => {
    switch (direction) {
      case 'up': return { y: 90, x: 0 };
      case 'down': return { y: -90, x: 0 };
      case 'left': return { y: 0, x: 90 };
      case 'right': return { y: 0, x: -90 };
      default: return { y: 0, x: 0 };
    }
  };

  const initialOffset = getDirections();

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: initialOffset.y, 
        x: initialOffset.x,
        scale: 0.94,
        filter: 'blur(8px)'
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        x: 0,
        scale: 1,
        filter: 'blur(0px)'
      }}
      viewport={{ once: false, margin: "-120px" }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.19, 1, 0.22, 1] // Advanced cubic ease-out (fluid deceleration)
      }}
    >
      {children}
    </motion.div>
  );
}
