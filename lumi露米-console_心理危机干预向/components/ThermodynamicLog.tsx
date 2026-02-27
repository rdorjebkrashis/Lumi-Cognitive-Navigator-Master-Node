import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface ThermodynamicLogProps {
  logs: LogEntry[];
  isOpen: boolean;
  onClose: () => void;
}

const ThermodynamicLog: React.FC<ThermodynamicLogProps> = ({ logs, isOpen, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-500">
      
      {/* The Monolith (Obsidian Archive) */}
      <div className="w-full max-w-4xl h-[80vh] bg-slate-950 rounded-lg overflow-hidden flex flex-col relative group shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-slate-800/50">
        
        {/* Glossy Sheen Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-10 mix-blend-overlay"></div>
        
        {/* Header: Engraved Stone look */}
        <div className="relative z-20 flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#080808] shrink-0">
          <div className="flex flex-col">
            <h3 className="text-2xl font-tibetan font-bold text-slate-200 tracking-wide drop-shadow-md">
                ཀུན་གཞི་རྣམ་ཤེས།
            </h3>
            <span className="text-[10px] font-mono tracking-[0.4em] text-slate-500 uppercase mt-1">
                ALAYA_ARCHIVE // OBSIDIAN_LAYER
            </span>
          </div>
          
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300 group-hover:scale-105"
          >
            ✕
          </button>
        </div>

        {/* Body: The Crystal Lattice */}
        <div 
          ref={scrollRef}
          className="relative z-20 flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar scroll-smooth bg-gradient-to-b from-[#050505] to-[#0a0a0a]"
        >
          {logs.length === 0 && (
            <div className="h-full flex items-center justify-center text-slate-800 font-serif italic text-lg opacity-50">
                The stone is silent...
            </div>
          )}
          
          {logs.map((log) => (
            <div 
                key={log.id} 
                className="relative group overflow-hidden rounded border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 ease-out hover:border-white/10 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              {/* Facet Reflection Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

              <div className="flex items-stretch min-h-[4rem]">
                  
                  {/* Left Edge: Color Code (The Vein) */}
                  <div className={`w-1 shrink-0 ${
                      log.type === 'ERROR' ? 'bg-red-900/50 group-hover:bg-red-500' :
                      log.type === 'FLUX' ? 'bg-amber-900/50 group-hover:bg-amber-500' :
                      'bg-cyan-900/50 group-hover:bg-cyan-500'
                  } transition-colors duration-500`} />

                  <div className="flex-1 p-4 flex flex-col md:flex-row gap-4 md:items-center">
                      
                      {/* Meta Data (Engraved) */}
                      <div className="flex flex-col gap-1 w-32 shrink-0 border-r border-white/5 pr-4">
                           <span className="font-mono text-[9px] text-slate-600 tracking-widest uppercase">
                               {log.source} :: {log.type}
                           </span>
                           <span className="font-mono text-[10px] text-slate-400">
                               {new Date(log.timestamp).toLocaleTimeString('en-GB')}
                           </span>
                      </div>

                      {/* Content (The Solid Mass) */}
                      <div className="flex-1 font-serif text-slate-300 text-sm leading-relaxed tracking-wide text-shadow-sm group-hover:text-slate-100 transition-colors">
                          {log.message}
                      </div>

                      {/* Metrics (Crystal Inclusions) */}
                      {log.meta && (
                        <div className="flex md:flex-col gap-2 shrink-0 pl-4 border-l border-white/5 items-end justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                            {log.meta.latency && (
                                <span className="font-mono text-[9px] text-cyan-700 group-hover:text-cyan-400">
                                    Δt: {log.meta.latency}ms
                                </span>
                            )}
                            {log.meta.entropy && (
                                <span className={`font-mono text-[9px] ${
                                    log.meta.entropy > 0.8 ? 'text-red-800 group-hover:text-red-500' : 'text-amber-800 group-hover:text-amber-500'
                                }`}>
                                   Ω: {log.meta.entropy.toFixed(3)}
                                </span>
                            )}
                        </div>
                      )}
                  </div>
              </div>
            </div>
          ))}
          
          {/* Bottom Fade - The Infinite Depth */}
          <div className="h-12 w-full bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none sticky bottom-0" />
        </div>

        {/* Footer: The Base */}
        <div className="relative z-20 px-6 py-3 bg-[#030303] border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-slate-700 uppercase tracking-[0.2em]">
            <span>Immutable Ledger</span>
            <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-800" />
                <span className="w-2 h-2 rounded-full bg-slate-800" />
                <span className="w-2 h-2 rounded-full bg-slate-800" />
            </div>
        </div>

      </div>
    </div>
  );
};

export default ThermodynamicLog;