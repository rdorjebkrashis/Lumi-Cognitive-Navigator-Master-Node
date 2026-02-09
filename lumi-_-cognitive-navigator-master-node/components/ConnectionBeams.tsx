
import React from 'react';
import { motion } from 'framer-motion';
import { getHexPosition, getMetatronsCubePath, getResonanceWaves } from '../../utils/sacredGeometry';

interface ConnectionBeamsProps {
  completedDays: number[];
  color: string;
  radius: number;
}

export const ConnectionBeams: React.FC<ConnectionBeamsProps> = ({ completedDays, color, radius }) => {
  const center = { x: 200, y: 450 };

  return (
    <g className="connection-beams">
      {/* Level 1: Resonance Field (The Ripple) - Background depth */}
      <motion.path 
        d={getResonanceWaves(center, radius)}
        stroke={color}
        strokeWidth="0.5"
        fill="none"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        style={{ transformOrigin: "200px 450px" }}
      />

      {/* Level 2: Double Star Matrix (The Merkaba) - Slowly rotating 3D structure */}
      <motion.path
        d={getMetatronsCubePath(center, radius)}
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        opacity="0.2"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, ease: "linear", repeat: Infinity }}
        style={{ transformOrigin: "200px 450px" }}
      />

      {/* Level 3: Active Neural Links (Mutual Interpenetration) */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const pos = getHexPosition(i, radius, center);
        const day = i + 1;
        const isCompleted = completedDays.includes(day);

        return (
          <g key={i}>
            {/* Structural Foundation Line */}
            <line 
              x1={center.x} y1={center.y} 
              x2={pos.x} y2={pos.y} 
              stroke={color} 
              strokeWidth="0.5" 
              opacity="0.1" 
            />
            
            {/* Bidirectional Light Flow */}
            {isCompleted && (
              <g>
                {/* Outward Flow (Yang/Action) - Continuous light beam */}
                <motion.line 
                  x1={center.x} y1={center.y} 
                  x2={pos.x} y2={pos.y} 
                  stroke={color} 
                  strokeWidth="1.5" 
                  strokeDasharray="4 20"
                  animate={{ strokeDashoffset: -24 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  opacity="0.8"
                  style={{ filter: 'url(#glow)' }}
                />
                
                {/* Inward Echo (Yin/Reflection) - Dotted echo */}
                <motion.line 
                  x1={center.x} y1={center.y} 
                  x2={pos.x} y2={pos.y} 
                  stroke={color} 
                  strokeWidth="1" 
                  strokeDasharray="2 30"
                  animate={{ strokeDashoffset: 32 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  opacity="0.4"
                />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};
