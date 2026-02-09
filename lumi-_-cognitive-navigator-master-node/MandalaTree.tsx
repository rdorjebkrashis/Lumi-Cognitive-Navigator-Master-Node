
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useAnimationFrame } from 'framer-motion';
import { KnobValues, HeterogeneousMemory } from './types';
import { COURSE_DATA } from './hooks/courseData';
import { SKIN_REGISTRY } from './constants/skins';
import { getHexPosition, getMetatronsCubePath } from './utils/sacredGeometry';
import { ConnectionBeams } from './components/ConnectionBeams';
import { EnergyPedestal } from './components/EnergyPedestal';
import { CrystalNode } from './components/mandala/CrystalNode';
import { CentralSingularity } from './components/mandala/CentralSingularity';
import { CelestialCompass } from './components/mandala/CelestialCompass';

interface MandalaTreeProps {
  currentDay: number;
  completedDays: number[];
  knobValues: KnobValues;
  memory: HeterogeneousMemory;
  onKnobChange: (v: KnobValues) => void;
  onSelectDay: (day: number) => void;
  onApplyScript: (s: string) => void;
}

export const MandalaTree: React.FC<MandalaTreeProps> = ({
  currentDay,
  completedDays,
  knobValues,
  memory,
  onKnobChange,
  onSelectDay,
  onApplyScript
}) => {
  const [focusedNode, setFocusedNode] = useState<number | null>(null);
  const [injectedNodes, setInjectedNodes] = useState<number[]>([]);
  const [isSingularityHovered, setIsSingularityHovered] = useState(false);
  const [astrolabeRotation, setAstrolabeRotation] = useState(0);
  const [splashActive, setSplashActive] = useState(false);

  const currentSkin = SKIN_REGISTRY[currentDay];
  const center = { x: 200, y: 450 };
  const orbitRadius = 160;

  const phaseRef = useRef(0);
  const breathingScale = useMotionValue(1);
  const glowOpacity = useMotionValue(0.5);
  
  useAnimationFrame((time, delta) => {
    const frequency = 0.0002 + (knobValues.speed * 0.0015);
    phaseRef.current += delta * frequency;
    const amplitude = 0.005 + ((1 - knobValues.entropy) * 0.035);
    const harmonicWeight = 0.25 * (1 - knobValues.entropy);
    const t = phaseRef.current;
    const rawWave = Math.sin(t) + (harmonicWeight * Math.sin(t * 2));
    breathingScale.set(1 + rawWave * amplitude);
    const baseGlow = 0.2 + (1 - knobValues.entropy) * 0.6;
    glowOpacity.set(baseGlow + (rawWave * 0.1));
  });

  const handleSelect = (day: number) => {
    if (focusedNode === day) {
      setFocusedNode(null);
    } else {
      const targetIndex = day === 7 ? 6 : day - 1;
      if (day !== 7) {
        const targetRotation = -(targetIndex * 60);
        setAstrolabeRotation(targetRotation);
      }
      setFocusedNode(day);
      onSelectDay(day);
    }
  };

  const handleInject = (day: number) => {
    if (!injectedNodes.includes(day)) {
      setInjectedNodes(prev => [...prev, day]);
      setSplashActive(true);
      setTimeout(() => setSplashActive(false), 1000);
      onKnobChange({ ...knobValues, speed: Math.min(1.5, knobValues.speed + 0.1), entropy: Math.max(0, knobValues.entropy - 0.1) });
    }
  };

  const handleDrag = (_: any, info: any) => {
    if (focusedNode !== null) return;
    const delta = info.delta.x * (0.8 + knobValues.speed);
    setAstrolabeRotation(prev => prev + delta);
  };

  const isHighEntropy = knobValues.entropy > 0.7;

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950/85 rounded-[3.5rem] border border-white/10 group shadow-[inset_0_0_120px_rgba(0,0,0,0.8)]">
      <motion.div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(${isHighEntropy ? '#ef4444' : currentSkin.color} 1px, transparent 1px)`, 
          backgroundSize: '40px 40px',
          opacity: isHighEntropy ? 0.2 : glowOpacity as any
        }} 
      />

      <AnimatePresence>
        {focusedNode !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-black/95 backdrop-blur-3xl cursor-zoom-out" 
            onClick={() => setFocusedNode(null)} 
          />
        )}
      </AnimatePresence>

      <motion.svg 
        drag="x"
        onDrag={handleDrag}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        viewBox="0 0 400 1100" 
        className="w-full h-full transition-transform duration-1000 ease-out cursor-grab active:cursor-grabbing" 
        style={{ scale: breathingScale }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={3 + knobValues.blur * 5} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 0. Celestial Guidance Compass */}
        <CelestialCompass />

        {/* 1. Metatron Foundation & Central Singularity */}
        <motion.g
          animate={{ rotate: astrolabeRotation * (0.1 + knobValues.speed * 0.2) }}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        >
          <motion.path 
            d={getMetatronsCubePath(center, 215)}
            fill="none"
            stroke={currentSkin.color}
            strokeWidth="0.8"
            style={{ opacity: splashActive ? 0.8 : glowOpacity }}
          />
          
          <CentralSingularity 
            completionLevel={injectedNodes.length}
            baseColor={currentSkin.color}
            isHovered={isSingularityHovered}
            splashActive={splashActive}
          />
        </motion.g>

        {/* 2. Connection Beams (Energy Flow) */}
        <motion.g 
          animate={{ rotate: astrolabeRotation }}
          transition={{ type: "spring", damping: 25 + knobValues.entropy * 10, stiffness: 60 - knobValues.entropy * 20 }}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        >
          <AnimatePresence>
            {focusedNode === null && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ConnectionBeams 
                  radius={orbitRadius} 
                  color={currentSkin.color} 
                  completedDays={completedDays} 
                />
              </motion.g>
            )}
          </AnimatePresence>
        </motion.g>

        {/* 3. Crystal Nodes (Draggable satellites) */}
        <motion.g
          animate={{ rotate: astrolabeRotation }}
          transition={{ type: "spring", damping: 25, stiffness: 60 }}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        >
          {COURSE_DATA.slice(0, 6).map((day, i) => {
            const pos = getHexPosition(i, orbitRadius, center);
            const isFocused = focusedNode === day.day;
            const isHidden = focusedNode !== null && !isFocused;

            return (
              <motion.g 
                key={day.day}
                animate={{ 
                  opacity: isHidden ? 0.05 : 1, 
                  filter: isHidden ? 'grayscale(1) blur(8px)' : 'grayscale(0) blur(0px)',
                  rotate: -astrolabeRotation
                }}
                transition={{ type: "spring", damping: 30 }}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
              >
                <CrystalNode 
                  data={day}
                  x={pos.x}
                  y={pos.y}
                  isActive={currentDay === day.day}
                  isFocused={isFocused}
                  isCompleted={completedDays.includes(day.day)}
                  isInjected={injectedNodes.includes(day.day)}
                  memories={memory.immediate.filter(m => m.course_day === day.day)}
                  onSelect={() => handleSelect(day.day)}
                  onApplyScript={onApplyScript}
                  onKnobChange={onKnobChange}
                  onInject={handleInject}
                  onHoverSingularity={setIsSingularityHovered}
                />
              </motion.g>
            );
          })}
        </motion.g>

        <EnergyPedestal 
          values={knobValues} 
          color={currentSkin.color} 
          onChange={onKnobChange} 
        />
      </motion.svg>
      
      <div className="absolute top-10 left-10 pointer-events-none select-none z-20">
        <div className="flex items-center gap-4 mb-4">
          <motion.div 
            style={{ 
              backgroundColor: isHighEntropy ? '#ef4444' : currentSkin.color, 
              boxShadow: `0 0 20px ${isHighEntropy ? '#ef4444' : currentSkin.color}` 
            }}
            className="w-3 h-3 rounded-full" 
          />
          <div className="flex flex-col">
            <p className="text-[14px] font-black uppercase tracking-[0.6em] text-white">
              {injectedNodes.length === 6 ? "DREAM_COMPLETED" : "PSYCHO_MECH_ACTIVE"}
            </p>
            <p className="text-[7px] font-mono text-white/30 tracking-[0.2em]">PROTOCOL_V174_STABLE</p>
          </div>
        </div>
      </div>
    </div>
  );
};
