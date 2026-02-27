import React, { useMemo } from 'react';
import { Message, Role } from '../types';
import { sonicVajra } from '../services/audioEngine';

interface CrystalFieldProps {
  messages: Message[];
  onOpenAnchor: (msg: Message) => void;
}

const pseudoRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const x = Math.abs(Math.sin(hash) * 10000) % 1;
  const y = Math.abs(Math.cos(hash) * 10000) % 1;
  return { x, y };
};

const CrystalField: React.FC<CrystalFieldProps> = ({ messages, onOpenAnchor }) => {
  
  const crystals = useMemo(() => {
    return messages.map((msg) => {
      const { x, y } = pseudoRandom(msg.id);
      const left = `${5 + x * 90}%`;
      const top = `${5 + y * 90}%`;
      const delay = `${x * 10}s`;
      const duration = `${15 + y * 15}s`;
      
      return { ...msg, left, top, delay, duration };
    });
  }, [messages]);

  const handleCrystalInteraction = (crystal: Message) => {
      const baseFreq = crystal.role === Role.USER ? 880 : 440;
      const entropyMod = (crystal.entropy || 0.5) * 500;
      sonicVajra.triggerTone(baseFreq + (crystal.isLifeAnchor ? 0 : entropyMod), (crystal.isLifeAnchor || crystal.anchorData) ? 'sine' : 'triangle');
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {crystals.map((crystal) => {
        const isUser = crystal.role === Role.USER;
        const entropy = crystal.entropy || 0.5;
        const hasAnchor = crystal.isLifeAnchor || !!crystal.anchorData;
        
        let color = '#94a3b8'; 
        let shadowColor = 'rgba(255,255,255,0.3)';
        let shapeClass = 'rounded-full';
        let size = isUser ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5';

        if (hasAnchor) {
            color = '#ffffff';
            shadowColor = 'rgba(255, 255, 255, 1)';
            shapeClass = 'rotate-45 rounded-sm';
            size = 'w-5 h-5 scale-150';
        } else if (!isUser) {
            if (entropy > 0.8) {
                color = '#ef4444'; 
                shadowColor = 'rgba(239, 68, 68, 0.8)';
                shapeClass = 'rotate-45 rounded-none';
                size = 'w-3 h-3';
            } else if (entropy > 0.4) {
                color = '#f59e0b';
                shadowColor = 'rgba(245, 158, 11, 0.6)';
                shapeClass = 'rounded-sm';
                size = 'w-2.5 h-2.5';
            } else {
                color = '#22d3ee';
                shadowColor = 'rgba(34, 211, 238, 0.6)';
                shapeClass = 'rounded-full';
                size = 'w-3 h-3';
            }
        }

        return (
          <div
            key={crystal.id}
            onClick={() => {
                handleCrystalInteraction(crystal);
                if (hasAnchor) {
                    onOpenAnchor(crystal);
                }
            }}
            className={`absolute ${shapeClass} ${size} transition-all duration-1000 animate-in fade-in cursor-pointer pointer-events-auto group z-10 hover:scale-150 hover:z-30 ${hasAnchor ? 'shadow-[0_0_30px_white]' : ''}`}
            style={{
              left: crystal.left,
              top: crystal.top,
              backgroundColor: color,
              boxShadow: `0 0 15px ${shadowColor}`,
              opacity: hasAnchor ? 1 : (isUser ? 0.6 : 0.9),
              animation: `float ${crystal.duration} ease-in-out infinite alternate`,
              animationDelay: crystal.delay,
            }}
          >
             {/* Interaction Ring for Anchors */}
             {hasAnchor && (
                 <>
                    <div className="absolute inset-[-8px] border border-white/20 rounded-full animate-ping duration-[3s]"></div>
                    <div className="absolute inset-[-15px] border border-white/10 rounded-full animate-pulse duration-[5s]"></div>
                 </>
             )}

             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-3 bg-slate-900/95 border border-white/20 rounded-sm text-[10px] font-mono text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none max-w-[250px] truncate shadow-[0_0_40px_rgba(0,0,0,1)] z-40">
                 {hasAnchor ? (
                     <div className="flex flex-col gap-1">
                        <span className="text-white font-bold tracking-widest">✦ SOVEREIGN_DIARY_NODE</span>
                        <span className="text-white/40 italic">"{crystal.anchorData?.summary?.substring(0, 30)}..."</span>
                        <span className="text-[8px] text-white/20 mt-1 uppercase">Click to re-enter this moment</span>
                     </div>
                 ) : crystal.content.substring(0, 40) + "..."}
                 <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900/95" />
             </div>
          </div>
        );
      })}
      
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(30px, -30px) rotate(15deg); }
        }
      `}</style>
    </div>
  );
};

export default CrystalField;