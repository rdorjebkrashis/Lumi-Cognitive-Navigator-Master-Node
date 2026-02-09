
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CelestialCompass: React.FC = () => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timeout: number;
    const handleActivity = () => {
      setIsIdle(false);
      clearTimeout(timeout);
      timeout = window.setTimeout(() => setIsIdle(true), 5000);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    handleActivity();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <g className="celestial-compass pointer-events-none">
      <defs>
        <radialGradient id="sun-glow-grad">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moon-glow-grad">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sun: Action Node */}
      <motion.g animate={{ y: [0, -10, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
        <circle cx="100" cy="150" r="40" fill="url(#sun-glow-grad)" style={{ filter: 'blur(10px)' }} />
        <circle cx="100" cy="150" r="2" fill="#F59E0B" />
      </motion.g>

      {/* Moon: Reflection Node */}
      <motion.g animate={{ y: [0, 10, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}>
        <circle cx="300" cy="150" r="35" fill="url(#moon-glow-grad)" style={{ filter: 'blur(10px)' }} opacity="0.6" />
        <circle cx="300" cy="150" r="2" fill="#E0F2FE" />
      </motion.g>

      {/* Gravity Particles Stream (Only when idle) */}
      <AnimatePresence>
        {isIdle && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {[...Array(10)].map((_, i) => (
              <React.Fragment key={i}>
                {/* Sun Stream */}
                <motion.circle
                  r="0.5"
                  fill="#F59E0B"
                  initial={{ cx: 100, cy: 150, opacity: 0 }}
                  animate={{ 
                    cx: 200, 
                    cy: 450, 
                    opacity: [0, 0.4, 0],
                    scale: [1, 2, 0.5]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.3,
                    ease: "easeIn" 
                  }}
                />
                {/* Moon Stream */}
                <motion.circle
                  r="0.5"
                  fill="#E0F2FE"
                  initial={{ cx: 300, cy: 150, opacity: 0 }}
                  animate={{ 
                    cx: 200, 
                    cy: 450, 
                    opacity: [0, 0.4, 0],
                    scale: [1, 2, 0.5]
                  }}
                  transition={{ 
                    duration: 3.5, 
                    repeat: Infinity, 
                    delay: i * 0.35 + 0.5,
                    ease: "easeIn" 
                  }}
                />
              </React.Fragment>
            ))}
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
};
