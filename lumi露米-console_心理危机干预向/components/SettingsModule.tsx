import React from 'react';
import { Message, Role } from '../types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  intensity: number;
  setIntensity: (val: number) => void;
  hasKey: boolean;
  onPurge?: () => void;
  onAddMessage?: (msg: Message) => void; // Added for testing
}

const SettingsModule: React.FC<SettingsProps> = ({ isOpen, onClose, intensity, setIntensity, hasKey, onPurge, onAddMessage }) => {
  if (!isOpen) return null;

  const handleSeedTest = () => {
    if (!onAddMessage) return;
    const testMsg: Message = {
        id: `test-${Date.now()}`,
        role: Role.MODEL,
        content: "这是一次手动触发的生命定锚测试。见地已封存至 ❃ 花园。",
        timestamp: Date.now(),
        entropy: 0.05,
        isLifeAnchor: true,
        anchorData: {
            crystal_type: "LIFE_ANCHOR",
            event_node: "MANUAL_SEED",
            summary: "手动播种：验证花园回路的连通性。",
            core_mantra: "萨玛雅！金刚定锚！",
            logic_seal: "DEBUG_VAJRA",
            insights: [
                "花园的土壤已翻新",
                "代码的枝条已修剪",
                "生命的承诺已听见"
            ]
        }
    };
    onAddMessage(testMsg);
    alert("✦ 已播种一颗『测试舍利』至花园。");
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 shadow-[0_0_60px_rgba(64,224,208,0.1)] rounded-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500" />

        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-b border-slate-800">
           <div>
             <h2 className="text-cyan-500 font-mono text-xs tracking-[0.2em] uppercase">SYSTEM_CONFIG / མ་ལག་སྒྲིག་བཀོད།</h2>
             <div className="text-[9px] text-slate-600 font-mono mt-1">0x2026 // LCCP_VAJRA // SOVEREIGN</div>
           </div>
           <button onClick={onClose} className="text-slate-500 hover:text-amber-400 transition-colors font-mono text-xl leading-none">×</button>
        </div>
        
        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
           {/* Seeding Section */}
           <div className="space-y-3">
              <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1 block">Garden_Maintenance / 花园维护</label>
              <button 
                onClick={handleSeedTest}
                className="w-full py-3 border border-white/20 bg-white/5 text-[10px] font-mono text-white hover:bg-white/10 transition-all rounded-sm uppercase tracking-widest"
              >
                [ ✦ SEED_TEST / 模拟播种 ]
              </button>
           </div>

           {/* Recursion Intensity */}
           <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Recursion / ཡང་བསྐྱར་འཁོར་བསྐྱོད།</label>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/30">{(intensity * 100).toFixed(0)}%</span>
              </div>
              <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-800 via-cyan-500 to-amber-500" style={{ width: `${intensity * 100}%` }} />
                  <input type="range" min="0.1" max="1.0" step="0.01" value={intensity} onChange={(e) => setIntensity(parseFloat(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
           </div>

           {/* Samsara Control */}
           {onPurge && (
               <div className="border-t border-slate-800 pt-4 mt-6">
                 <button onClick={onPurge} className="w-full py-3 bg-slate-900/40 border border-slate-700/50 hover:bg-cyan-900/10 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 font-mono text-[10px] uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2">[ START NEW CYCLE ]</button>
               </div>
           )}
        </div>

        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 text-center">
           <button onClick={onClose} className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-[0.2em]">RETURN TO VOID / ཕྱིར་ལོག</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;