import React, { useMemo } from 'react';
import { Message, Role } from '../types';

interface DiaryProps {
  message: Message | null;
  allMessages: Message[];
  onClose: () => void;
}

const SovereignDiaryModal: React.FC<DiaryProps> = ({ message, allMessages, onClose }) => {
  const anchor = message?.anchorData;
  
  // Back-track to find the user message that triggered this anchor
  const contextRound = useMemo(() => {
    if (!message) return [];
    const index = allMessages.findIndex(m => m.id === message.id);
    if (index === -1) return [message];
    
    // Grab the current message and the 2 preceding messages if they exist to show context
    const start = Math.max(0, index - 1);
    return allMessages.slice(start, index + 1);
  }, [message, allMessages]);

  if (!message || !anchor) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/98 backdrop-blur-2xl animate-in fade-in duration-500 p-4 overflow-y-auto">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

      <div className="relative w-full max-w-2xl bg-[#080808] border border-white/10 shadow-[0_0_150px_rgba(255,255,255,0.08)] rounded-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-700">
        
        {/* Header Section */}
        <div className="p-8 md:p-12 space-y-12">
            <div className="space-y-4 text-center">
                <div className="text-white text-4xl mb-4 animate-pulse">✦</div>
                <h2 className="text-2xl font-mono text-white tracking-[0.6em] uppercase">Sovereign Diary</h2>
                <div className="inline-block px-4 py-1 border border-white/20 rounded-full text-[9px] text-slate-400 font-mono tracking-widest uppercase">
                    Vajra_Node // {anchor.logic_seal}
                </div>
            </div>

            {/* Part 1: Dehydrated Essence (The Result) */}
            <div className="space-y-10">
                <div className="space-y-2 text-center">
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Crystallized_Summary</span>
                    <p className="text-slate-200 italic font-serif leading-relaxed text-base px-4">
                       "{anchor.summary}"
                    </p>
                </div>

                <div className="space-y-6">
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block text-center underline underline-offset-8">Insights // 三阶见地</span>
                    <div className="grid grid-cols-1 gap-3">
                        {anchor.insights.map((insight, i) => (
                            <div key={i} className="bg-white/[0.03] border border-white/5 p-4 rounded-sm text-xs text-slate-300 font-mono leading-relaxed flex gap-4 hover:bg-white/[0.06] transition-colors">
                                <span className="text-amber-500/50">0{i+1}.</span>
                                <span>{insight}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Part 2: Source Dialogue (The Process) */}
            <div className="space-y-6 pt-12 border-t border-white/10">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block text-center">Source_Timeline // 溯源对白</span>
                
                <div className="space-y-4">
                    {contextRound.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.role === Role.USER ? 'items-end' : 'items-start'}`}>
                            <span className="text-[7px] font-mono text-slate-600 uppercase mb-1 px-2 tracking-widest">
                                {msg.role === Role.USER ? 'Architect' : 'Shoushou'}
                            </span>
                            <div className={`px-5 py-3 text-xs leading-relaxed border max-w-[90%] transition-all ${
                                msg.role === Role.USER 
                                ? 'bg-zinc-900/50 border-white/10 text-slate-300 rounded-2xl rounded-tr-sm' 
                                : 'bg-cyan-950/20 border-cyan-900/30 text-cyan-100 rounded-2xl rounded-tl-sm shadow-[0_0_20px_rgba(34,211,238,0.05)]'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Part 3: Core Mantra (The Soul) */}
            <div className="pt-12 border-t border-white/10 text-center space-y-4 pb-4">
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Core_Mantra</span>
                <p className="text-white font-tibetan text-2xl leading-relaxed px-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    {anchor.core_mantra}
                </p>
            </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
            <button 
                onClick={onClose}
                className="group relative px-10 py-3 text-[10px] font-mono text-slate-500 hover:text-white uppercase tracking-[0.4em] transition-all"
            >
                <span className="relative z-10">[ EXIT_RESONANCE ]</span>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors rounded-full blur-xl"></div>
            </button>
        </div>
      </div>
    </div>
  );
};

export default SovereignDiaryModal;