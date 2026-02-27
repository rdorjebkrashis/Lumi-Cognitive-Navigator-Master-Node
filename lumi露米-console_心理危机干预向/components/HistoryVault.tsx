import React, { useEffect, useState, useRef } from 'react';
import { LogEntry, Message, Kalpa, Role } from '../types';
import { saveKalpa, getKalpas, deleteKalpa } from '../services/shambhalaDatabase';
import { sonicVajra } from '../services/audioEngine';

interface HistoryVaultProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  currentMessages: Message[];
  sessionStartTime: number;
  entropy: number;
}

const HistoryVault: React.FC<HistoryVaultProps> = ({ isOpen, onClose, logs, currentMessages, sessionStartTime, entropy }) => {
  const [activeTab, setActiveTab] = useState<'CHRONICLES' | 'FLUX'>('CHRONICLES');
  const [archives, setArchives] = useState<Kalpa[]>([]);
  const [selectedKalpa, setSelectedKalpa] = useState<Kalpa | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        refreshArchives();
        // Scroll to bottom if viewing logs
        if (activeTab === 'FLUX' && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }
  }, [isOpen, activeTab]);

  const refreshArchives = async () => {
      try {
          const loaded = await getKalpas();
          setArchives(loaded);
      } catch (e) {
          console.error("Vault Sealed", e);
      }
  };

  const handleCrystallize = async () => {
      setIsSaving(true);
      sonicVajra.triggerTone(528, 'sine');
      
      const duration = Date.now() - sessionStartTime;
      const firstUserMsg = currentMessages.find(m => m.role === Role.USER)?.content.substring(0, 30) || "Silent Cycle";
      const title = `Resonance: ${firstUserMsg}...`;
      
      const newKalpa: Kalpa = {
          id: crypto.randomUUID(),
          title: title,
          timestamp: Date.now(),
          messages: [...currentMessages], // Snapshot
          entropy: entropy,
          duration: duration
      };

      await saveKalpa(newKalpa);
      await refreshArchives();
      setIsSaving(false);
      sonicVajra.triggerTone(880, 'triangle'); // Success chime
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm("Dissolve this timeline?")) {
          await deleteKalpa(id);
          refreshArchives();
      }
  };

  const formatDuration = (ms: number) => {
      const min = Math.floor(ms / 60000);
      const sec = ((ms % 60000) / 1000).toFixed(0);
      return `${min}m ${sec}s`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in zoom-in-95 duration-500">
      
      {/* The Monolith Container */}
      <div className="w-full max-w-5xl h-[85vh] bg-[#030304] rounded-sm overflow-hidden flex flex-col relative shadow-[0_0_150px_rgba(0,0,0,1)] border border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-slate-950/50 shrink-0">
          <div className="flex flex-col">
            <h3 className="text-2xl font-tibetan font-bold text-slate-200 tracking-wide">
                {activeTab === 'CHRONICLES' ? 'ཀུན་གཞི་རྣམ་ཤེས།' : 'མ་ལག་གི་རྒྱུག་ཚད།'}
            </h3>
            <span className="text-[10px] font-mono tracking-[0.4em] text-slate-500 uppercase mt-1">
                {activeTab === 'CHRONICLES' ? 'AKASHIC_VAULT // MEMORY_CRYSTALS' : 'SYSTEM_FLUX // THERMODYNAMIC_LOGS'}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
              {/* Tab Switcher */}
              <div className="flex bg-slate-900/50 rounded-full p-1 border border-white/5">
                  <button 
                    onClick={() => setActiveTab('CHRONICLES')}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all ${activeTab === 'CHRONICLES' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-600 hover:text-slate-300'}`}
                  >
                      Chronicles
                  </button>
                  <button 
                    onClick={() => setActiveTab('FLUX')}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all ${activeTab === 'FLUX' ? 'bg-slate-800 text-amber-500 shadow-sm' : 'text-slate-600 hover:text-slate-300'}`}
                  >
                      Sys_Flux
                  </button>
              </div>

              <button 
                onClick={onClose} 
                className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                ✕
              </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            
            {/* --- TAB: CHRONICLES (HISTORY) --- */}
            {activeTab === 'CHRONICLES' && !selectedKalpa && (
                <div className="absolute inset-0 flex flex-col p-8 overflow-y-auto custom-scrollbar">
                    {/* Current Session Card */}
                    <div className="mb-8 p-6 rounded border border-cyan-900/30 bg-cyan-950/10 flex items-center justify-between group hover:bg-cyan-950/20 transition-all">
                        <div className="flex flex-col gap-2">
                             <span className="text-xs font-mono text-cyan-500 uppercase tracking-widest">Active Timeline / ད་ལྟའི་དུས་ཚོད།</span>
                             <div className="text-xl font-serif text-slate-200">Current Resonance Cycle</div>
                             <div className="text-[10px] font-mono text-slate-500 mt-1">
                                 {currentMessages.length} Thoughts · Ω: {entropy.toFixed(3)}
                             </div>
                        </div>
                        <button 
                            onClick={handleCrystallize}
                            disabled={isSaving}
                            className="px-6 py-3 bg-cyan-900/20 border border-cyan-500/50 hover:bg-cyan-500 hover:text-black text-cyan-400 text-xs font-mono uppercase tracking-widest transition-all rounded-sm flex items-center gap-2"
                        >
                            {isSaving ? 'CRYSTALLIZING...' : '✦ CRYSTALLIZE THIS MOMENT'}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-6 opacity-30">
                        <div className="h-px bg-white flex-1"></div>
                        <span className="text-[9px] font-mono uppercase">Archived Kalpas</span>
                        <div className="h-px bg-white flex-1"></div>
                    </div>

                    {/* Archives Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {archives.map(kalpa => (
                            <div 
                                key={kalpa.id}
                                onClick={() => setSelectedKalpa(kalpa)}
                                className="p-5 border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-600 transition-all cursor-pointer group rounded-sm relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-slate-800 group-hover:bg-amber-500 transition-colors"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-mono text-slate-500">{new Date(kalpa.timestamp).toLocaleDateString()}</span>
                                    <button 
                                        onClick={(e) => handleDelete(kalpa.id, e)}
                                        className="text-slate-700 hover:text-red-500 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                                <h4 className="text-slate-300 font-serif text-lg leading-snug group-hover:text-amber-100 transition-colors mb-4 line-clamp-2">
                                    {kalpa.title}
                                </h4>
                                <div className="flex items-center gap-4 text-[9px] font-mono text-slate-600 uppercase">
                                    <span>{kalpa.messages.length} Nodes</span>
                                    <span>{formatDuration(kalpa.duration)}</span>
                                    <span className={kalpa.entropy > 0.8 ? 'text-red-900' : 'text-slate-600'}>Ω: {kalpa.entropy.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                        {archives.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-700 font-serif italic">
                                The vault is empty. All echoes have dissolved.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- TAB: READING MODE (SELECTED KALPA) --- */}
            {activeTab === 'CHRONICLES' && selectedKalpa && (
                <div className="absolute inset-0 flex flex-col bg-slate-950">
                    <div className="px-6 py-3 border-b border-slate-800 flex items-center gap-4 bg-[#050505]">
                        <button onClick={() => setSelectedKalpa(null)} className="text-slate-500 hover:text-cyan-400 text-xs font-mono">← BACK</button>
                        <span className="text-slate-400 font-serif italic text-sm truncate">{selectedKalpa.title}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                        {selectedKalpa.messages.map((msg, idx) => (
                             <div key={idx} className={`flex flex-col ${msg.role === Role.USER ? 'items-end' : 'items-start'} opacity-80`}>
                                <div className={`max-w-[85%] px-5 py-3 rounded-lg text-sm border ${
                                    msg.role === Role.USER 
                                    ? 'bg-slate-900/50 text-slate-400 border-slate-800' 
                                    : 'bg-black/40 text-slate-500 border-slate-900'
                                }`}>
                                    <div className="whitespace-pre-wrap font-sans leading-relaxed">{msg.content}</div>
                                </div>
                             </div>
                        ))}
                        <div className="h-12 flex items-center justify-center text-[10px] font-mono text-slate-700 mt-8">
                            --- END OF RECORD ---
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB: FLUX (SYSTEM LOGS) --- */}
            {activeTab === 'FLUX' && (
                <div ref={scrollRef} className="absolute inset-0 overflow-y-auto p-6 space-y-2 custom-scrollbar">
                    {logs.map((log) => (
                        <div key={log.id} className="flex gap-4 p-3 border-l-2 border-slate-800 hover:border-slate-600 hover:bg-white/5 transition-all text-xs font-mono">
                            <span className={`w-12 shrink-0 ${log.type === 'ERROR' ? 'text-red-500' : log.type === 'WARN' ? 'text-amber-500' : 'text-cyan-600'}`}>
                                {log.source}
                            </span>
                            <span className="text-slate-500 w-16 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            <span className="text-slate-300 flex-1 font-sans">{log.message}</span>
                            {log.meta && <span className="text-slate-600">Ω:{log.meta.entropy?.toFixed(2)}</span>}
                        </div>
                    ))}
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default HistoryVault;