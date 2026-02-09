
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, KnobValues, CrystalShape } from '../types';

interface VajraCoreProps {
  state: AppState;
  activeSnapshot: any | null;
  knobValues: KnobValues;
  currentDay: number;
  onClick?: () => void;
}

export const VajraCore: React.FC<VajraCoreProps> = ({ state, knobValues, activeSnapshot, currentDay, onClick }) => {
  // Fixed state checks to correctly handle all processing and visualization states.
  const isProcessing = state === AppState.THINKING || state === AppState.SYNTHESIZING || state === AppState.PROCESSING || state === AppState.GENERATING;
  const isPortalOpen = state === AppState.INPUTTING || isProcessing;
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      const speedValue = knobValues?.speed || 0.5;
      const baseIncrement = isProcessing ? 0.08 : 0.03;
      setPulse(p => (p + (baseIncrement * (0.5 + speedValue * 2))) % (Math.PI * 2));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isProcessing, knobValues]);

  const scale = 1 + Math.sin(pulse) * (isProcessing ? 0.15 : 0.04);
  const portalScale = isPortalOpen ? 0.7 : 1;
  
  const shape: CrystalShape = activeSnapshot?.growth_shape || 
    (currentDay <= 2 ? 'Tetrahedron' : currentDay <= 4 ? 'Cube' : currentDay <= 6 ? 'Octahedron' : 'Sphere');

  return (
    <motion.div 
      className="relative w-80 h-80 flex items-center justify-center cursor-pointer"
      onClick={onClick}
      animate={{ scale: portalScale }}
      whileHover={{ scale: portalScale * 1.05 }}
      whileTap={{ scale: portalScale * 0.95 }}
    >
      {/* Divine Glow Layer */}
      <div 
        className="absolute inset-0 rounded-full blur-[140px] opacity-20 transition-all duration-[3000ms]"
        style={{ 
          backgroundColor: 'var(--mind-color)', 
          transform: `scale(${scale * (isPortalOpen ? 1.5 : 2.5)})`
        }}
      />

      {/* Crystalline SVG Matrix */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <AnimatePresence mode="wait">
            <motion.g 
              key={shape}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              transform="translate(100, 100)"
            >
              <circle r="95" fill="none" stroke="white" strokeWidth="0.1" opacity="0.05" />
              
              <motion.g animate={{ rotate: pulse * 50 }} style={{ scale: scale * 0.9 }}>
                {shape === 'Tetrahedron' && (
                  <g stroke="var(--mind-color)" fill="none" strokeWidth="1.5">
                    <path d="M0,-60 L52,30 L-52,30 Z" strokeLinejoin="round" />
                    <path d="M-52,30 L0,-10 L52,30" opacity="0.4" />
                  </g>
                )}
                {shape === 'Cube' && (
                  <g stroke="var(--mind-color)" fill="none" strokeWidth="1.5">
                    <rect x="-40" y="-40" width="80" height="80" />
                    <line x1="-40" y1="-40" x2="40" y2="40" opacity="0.2" />
                    <line x1="40" y1="-40" x2="-40" y2="40" opacity="0.2" />
                  </g>
                )}
                {shape === 'Octahedron' && (
                  <g stroke="var(--mind-color)" fill="none" strokeWidth="1.5">
                    <path d="M0,-70 L50,0 L0,70 L-50,0 Z" />
                    <path d="M-50,0 L0,-15 L50,0 L0,15 Z" opacity="0.6" />
                  </g>
                )}
                {shape === 'Sphere' && (
                  <g stroke="white" fill="none" strokeWidth="1">
                    <circle r="65" opacity="0.3" />
                    <circle r="45" opacity="0.5" />
                    <circle r="25" opacity="0.8" />
                  </g>
                )}
              </motion.g>
            </motion.g>
          </AnimatePresence>
        </svg>
      </div>
      
      {/* Central Singularity Node (The Heart) */}
      <motion.div 
        className="relative w-40 h-40 flex items-center justify-center rounded-[3rem] border border-white/5"
        style={{ 
          transform: `scale(${scale})`,
          background: 'linear-gradient(135deg, rgba(var(--mind-rgb), 0.1) 0%, rgba(0,0,0,0.8) 100%)',
          boxShadow: isPortalOpen 
            ? `0 0 100px rgba(var(--mind-rgb), 0.4), inset 0 0 20px rgba(255,255,255,0.1)` 
            : `0 0 40px rgba(var(--mind-rgb), 0.1), inset 0 0 10px rgba(var(--mind-rgb), 0.05)`
        }}
      >
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
             <motion.div 
               className="w-3 h-3 rounded-full transition-all duration-1000" 
               style={{ 
                 backgroundColor: 'var(--mind-color)',
                 boxShadow: isPortalOpen ? '0 0 30px 5px white' : '0 0 10px rgba(var(--mind-rgb), 0.5)'
               }}
               animate={{ scale: isProcessing ? [1, 1.5, 1] : [1, 1.1, 1] }}
               transition={{ duration: isProcessing ? 0.5 : 2, repeat: Infinity }}
             />
        </div>
      </motion.div>

      <div className="absolute -bottom-16 text-center">
        <p className="text-[9px] font-black uppercase tracking-[1em] text-white/10">{isPortalOpen ? "VOID_READY" : "SINGULARITY"}</p>
      </div>
    </motion.div>
  );
};