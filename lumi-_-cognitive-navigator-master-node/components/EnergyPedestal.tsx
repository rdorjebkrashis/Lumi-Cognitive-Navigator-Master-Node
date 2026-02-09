
import React from 'react';
import { motion } from 'framer-motion';
import { KnobValues } from '../types';

interface EnergyPedestalProps {
  values: KnobValues;
  onChange: (v: KnobValues) => void;
  color: string;
}

const CONTROL_PHYSICS = {
  Y: 1050,
  SPACING: 80,
  KNOB_R: 12,
  BEAM_MAX_H: 400
};

export const EnergyPedestal: React.FC<EnergyPedestalProps> = ({ values, onChange, color }) => {
  const updateVal = (key: keyof KnobValues, offset: number) => {
    const range = 60; // drag range pixels
    const val = Math.max(0, Math.min(1, (offset + 30) / range));
    onChange({ ...values, [key]: val });
  };

  const controls: { key: keyof KnobValues, label: string, color: string }[] = [
    { key: 'entropy', label: 'Entropy', color: color },
    { key: 'blur', label: 'Blur', color: 'skyBlue' },
    { key: 'speed', label: 'Speed', color: 'white' }
  ];

  return (
    <g transform={`translate(200, ${CONTROL_PHYSICS.Y})`}>
      {/* Base Foundation */}
      <circle r="120" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="2 6" opacity="0.1" />
      <path d="M -100 0 L 100 0" stroke={color} strokeWidth="0.5" opacity="0.2" />
      
      {/* Energy Beams Shooting Up */}
      {controls.map((c, i) => {
        const x = (i - 1) * CONTROL_PHYSICS.SPACING;
        const val = values[c.key];
        const beamH = 100 + val * CONTROL_PHYSICS.BEAM_MAX_H;
        
        return (
          <g key={c.key} transform={`translate(${x}, 0)`}>
            {/* Emission Glow Beam */}
            <motion.path 
              d={`M 0 0 L 0 ${-beamH}`}
              stroke={c.color}
              strokeWidth={2 + val * 10}
              strokeLinecap="round"
              opacity={0.1 + val * 0.5}
              style={{ filter: 'url(#glow)' }}
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                strokeWidth: [2 + val * 8, 4 + val * 12, 2 + val * 8]
              }}
              transition={{ 
                duration: 2 / (values.speed + 0.5), 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            
            {/* Control Token */}
            <motion.circle 
              drag="x"
              dragConstraints={{ left: -30, right: 30 }}
              dragElastic={0.1}
              onDrag={(_, info) => updateVal(c.key, info.offset.x)}
              r={CONTROL_PHYSICS.KNOB_R}
              fill="rgba(2, 6, 23, 0.9)"
              stroke={c.color}
              strokeWidth={2}
              className="cursor-pointer"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
            
            {/* Inner Core Light */}
            <circle r={2 + val * 5} fill={c.color} pointerEvents="none" style={{ filter: 'url(#glow)' }} />

            <text y={32} textAnchor="middle" className="text-[8px] font-black fill-white/40 uppercase tracking-[0.2em]">
              {c.label}
            </text>
            <text y={44} textAnchor="middle" className="text-[6px] font-mono fill-white/20">
              {(val * 100).toFixed(0)}%
            </text>
          </g>
        );
      })}
    </g>
  );
};
