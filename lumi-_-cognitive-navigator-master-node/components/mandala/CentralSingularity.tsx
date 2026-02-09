
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CentralSingularityProps {
  completionLevel: number; 
  baseColor: string;
  isHovered: boolean;
  splashActive?: boolean;
}

export const CentralSingularity: React.FC<CentralSingularityProps> = ({ 
  completionLevel, 
  baseColor, 
  isHovered,
  splashActive
}) => {
  const [internalSplash, setInternalSplash] = useState(false);

  useEffect(() => {
    if (splashActive) {
      setInternalSplash(true);
      const timer = setTimeout(() => setInternalSplash(false), 800);
      return () => clearTimeout(timer);
    }
  }, [splashActive]);

  return (
    <g transform="translate(200, 450)">
      <motion.g
        animate={{ 
          scale: isHovered ? 0.92 : 1, 
        }}
        transition={{ 
          type: "spring",
          stiffness: 100, // Organic feel
          damping: 15,
          mass: 1.2
        }}
      >
        <circle 
          r={isHovered ? 52 : 55} fill="none" stroke={baseColor} 
          strokeWidth="0.5" strokeDasharray="4 8" opacity={isHovered ? 0.8 : 0.3} 
          className="transition-all duration-500"
        />
        <motion.circle 
          r={5 + completionLevel * 2} 
          fill={baseColor} 
          style={{ filter: 'url(#glow)' }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.g>

      <AnimatePresence>
        {internalSplash && (
          <motion.g initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 2.5, opacity: 0 }} transition={{ duration: 0.8 }}>
            <circle r="60" fill="white" style={{ filter: 'blur(20px)' }} />
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
};
