import React, { useMemo } from 'react';
import { Message } from '../types';
import { sonicVajra } from '../services/audioEngine';

interface DiaryGardenProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onOpenAnchor: (msg: Message) => void;
}

const DiaryGarden: React.FC<DiaryGardenProps> = ({ isOpen, onClose, messages, onOpenAnchor }) => {
  // 逻辑修剪：不再仅依赖 isLifeAnchor 标记，只要有数据就展示
  const anchors = useMemo(() => {
    return messages.filter(m => (m.anchorData || m.isLifeAnchor) && m.role === 'model');
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-[#020202] flex flex-col items-center p-8 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_0%,_transparent_70%)] pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-6xl flex flex-col h-full">
        <header className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-tibetan text-slate-100 tracking-wider">生命定錨花園</h2>
            <div className="flex items-center gap-3">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em]">Sovereign_Diary // Memory Sharira Gallery</p>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/30 font-mono">COUNT: {anchors.length}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-white/20 text-[10px] font-mono text-slate-400 hover:text-white hover:border-white transition-all rounded-full uppercase tracking-widest bg-white/5"
          >
            [ 返回指挥中心 ]
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
          {anchors.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40">
                <div className="w-16 h-16 rounded-full border border-dashed border-white/20 flex items-center justify-center animate-spin-slow">
                    <span className="text-2xl text-white">❃</span>
                </div>
                <div className="text-center space-y-2">
                    <p className="font-mono text-xs uppercase tracking-[0.2em]">花园尚在孕育中 (Garden is Empty)</p>
                    <p className="text-[10px] text-slate-600 max-w-xs leading-relaxed mx-auto">
                        当对话触及生命的深层承诺时，兽兽会通过「金刚定锚」将瞬间凝结为永恒。
                    </p>
                </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {anchors.map((msg) => {
                const data = msg.anchorData;
                if (!data) return null;
                
                return (
                  <div 
                    key={msg.id}
                    onClick={() => {
                        sonicVajra.triggerTone(528, 'sine');
                        onOpenAnchor(msg);
                    }}
                    className="group relative p-8 bg-white/[0.02] border border-white/10 rounded-sm hover:bg-white/[0.05] hover:border-white/30 transition-all cursor-pointer flex flex-col space-y-6 shadow-2xl hover:shadow-white/5"
                  >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                            <span className="text-[9px] font-mono text-white/40 tracking-widest uppercase">{data.crystal_type}</span>
                        </div>
                        <span className="text-[8px] font-mono text-slate-600">{new Date(msg.timestamp).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="space-y-2">
                        <h4 className="text-sm font-mono text-white group-hover:text-amber-100 transition-colors uppercase tracking-tight">
                            {data.logic_seal || "UNLABELED_结印"}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-3 italic font-serif leading-relaxed">
                            "{data.summary}"
                        </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <div className="flex gap-1">
                            {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors"></div>)}
                        </div>
                        <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-200 transition-colors uppercase">溯源对白 →</span>
                    </div>

                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                        <span className="text-xl text-white">✦</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DiaryGarden;