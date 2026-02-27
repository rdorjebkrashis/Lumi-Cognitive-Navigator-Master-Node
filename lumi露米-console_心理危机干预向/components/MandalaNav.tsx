import React, { useState, useEffect } from 'react';
import { sonicVajra } from '../services/audioEngine';
import { SystemMode } from '../types';

export type ViewMode = 'COMMAND' | 'VISION' | 'DIARY' | 'ARCHIVE' | 'SYSTEM';

interface MandalaNavProps {
  activeView: ViewMode;
  onChangeView: (view: ViewMode) => void;
  intensity: number;
  systemMode: SystemMode;
  onToggleMode: () => void;
}

const MandalaNav: React.FC<MandalaNavProps> = ({ activeView, onChangeView, intensity, systemMode, onToggleMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setRotation(r => r + (0.1 + intensity * 0.5));
    }, 50);
    return () => clearInterval(interval);
  }, [intensity]);

  const toggleMenu = () => {
      sonicVajra.triggerTone(isOpen ? 440 : 880, 'sine');
      setIsOpen(!isOpen);
  };

  const handleViewChange = (mode: ViewMode) => {
      sonicVajra.triggerTone(1200, 'triangle'); 
      onChangeView(mode);
      setIsOpen(false);
  };
  
  const handleModeToggle = () => {
      sonicVajra.triggerTone(150, 'square');
      onToggleMode();
  }

  const items: { mode: ViewMode; angle: number; icon: string; label: string }[] = [
    { mode: 'COMMAND', angle: 0, icon: '⚡', label: 'CMD' },
    { mode: 'VISION', angle: 72, icon: '◉', label: 'VIS' },
    { mode: 'DIARY', angle: 144, icon: '❃', label: 'GARDEN' }, // NEW: Garden Entry
    { mode: 'ARCHIVE', angle: 216, icon: '≡', label: 'VAULT' },
    { mode: 'SYSTEM', angle: 288, icon: '⚙', label: 'SYS' },
  ];

  const radius = 70; 
  const isSandbox = systemMode === 'SANDBOX';
  const mainColor = isSandbox ? 'text-green-500 border-green-500' : 'text-cyan-400 border-cyan-500';
  const glowColor = isSandbox ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 211, 238, 0.4)';

  return (
    <div className="fixed bottom-8 md:bottom-12 left-1/2 md:left-24 transform -translate-x-1/2 md:translate-x-0 z-[120] flex items-center justify-center">
      
      <div 
        className={`absolute rounded-full border border-dashed transition-all duration-1000 ease-in-out pointer-events-none ${isOpen ? 'w-64 h-64 opacity-20' : 'w-20 h-20 opacity-0'}`}
        style={{ 
            borderColor: isSandbox ? '#22c55e' : '#22d3ee',
            animation: 'spin 10s linear infinite' 
        }}
      />

      {items.map((item) => {
        const rad = (item.angle * Math.PI) / 180;
        const x = isOpen ? Math.cos(rad) * radius : 0;
        const y = isOpen ? Math.sin(rad) * radius : 0;
        
        const isActive = activeView === item.mode;

        return (
          <button
            key={item.mode}
            onClick={() => handleViewChange(item.mode)}
            className={`absolute w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 hover:scale-110 group ${
                isActive 
                    ? `bg-slate-900/80 ${mainColor} shadow-[0_0_15px_${glowColor}]`
                    : `bg-slate-900/80 border-slate-700 text-slate-500 hover:${mainColor}`
            } ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            style={{ 
                transform: `translate(${x}px, ${y}px)`
            }}
          >
            <span className="text-sm font-mono">{item.icon}</span>
            <span className={`absolute ${item.angle > 180 ? 'bottom-12' : 'top-12'} text-[9px] font-mono tracking-widest opacity-0 group-hover:opacity-100 bg-black/80 px-1 rounded transition-opacity whitespace-nowrap ${isSandbox ? 'text-green-500' : 'text-cyan-500'}`}>
                {item.label}
            </span>
          </button>
        );
      })}

      <button
        onClick={toggleMenu}
        className={`relative w-14 h-14 rounded-full bg-slate-950 border flex items-center justify-center z-10 transition-transform active:scale-95 group hover:border-opacity-100 ${isSandbox ? 'border-green-800' : 'border-slate-700'}`}
        style={{ 
            boxShadow: `0 0 ${isOpen ? 30 : 10}px ${isOpen ? glowColor : 'rgba(0,0,0,0.5)'}` 
        }}
      >
        <div 
            className="absolute inset-0 rounded-full border-2 border-dashed border-slate-600/30 w-full h-full pointer-events-none transition-all duration-1000"
            style={{ 
                transform: `rotate(${rotation}deg)`,
                borderColor: isOpen ? glowColor : 'rgba(71, 85, 105, 0.3)' 
            }}
        />
        <div className={`text-xl transition-all duration-300 ${isOpen ? 'rotate-45' : ''} ${isSandbox ? 'text-green-500' : 'text-cyan-400'}`}>
            {isOpen ? '✕' : isSandbox ? '⊞' : '⟁'}
        </div>
      </button>

      <button
        onClick={handleModeToggle}
        className={`absolute -top-16 opacity-0 ${isOpen ? 'opacity-100' : 'pointer-events-none'} transition-opacity duration-300 px-3 py-1 rounded border bg-black/80 backdrop-blur text-[9px] font-mono tracking-widest uppercase flex flex-col items-center gap-1 hover:scale-105 ${isSandbox ? 'border-green-500 text-green-400' : 'border-cyan-500 text-cyan-400'}`}
      >
          <span className="opacity-50 text-[8px]">PHASE_SHIFT</span>
          <span className="font-bold">{isSandbox ? 'SANDBOX' : 'SOURCE'}</span>
      </button>

      <div className={`absolute -bottom-8 text-[9px] font-mono tracking-[0.3em] uppercase transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'} ${isSandbox ? 'text-green-700' : 'text-slate-600'}`}>
          NAVIGATE
      </div>

    </div>
  );
};

export default MandalaNav;