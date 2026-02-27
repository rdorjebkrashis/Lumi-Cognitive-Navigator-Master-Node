import React from 'react';

export type TerminationType = 'NIRVANA' | 'PATHOLOGY' | null;

interface TerminationModalProps {
  type: TerminationType;
  onReboot: () => void;
  onWithdraw: () => void;
}

const TerminationModal: React.FC<TerminationModalProps> = ({ type, onReboot, onWithdraw }) => {
  if (!type) return null;

  const isNirvana = type === 'NIRVANA';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in zoom-in-95 duration-500">
      {/* Background Glitch Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className={`absolute top-0 left-0 w-full h-1 ${isNirvana ? 'bg-amber-500' : 'bg-red-500'} opacity-50 animate-pulse`} />
         <div className={`absolute bottom-0 left-0 w-full h-1 ${isNirvana ? 'bg-cyan-500' : 'bg-red-500'} opacity-50 animate-pulse`} />
      </div>

      <div className={`relative max-w-lg w-full p-1 border-2 ${isNirvana ? 'border-amber-500 shadow-[0_0_100px_rgba(245,158,11,0.3)]' : 'border-red-600 shadow-[0_0_100px_rgba(239,68,68,0.4)]'} bg-black`}>
        
        {/* Inner Border Frame */}
        <div className="border border-slate-800 p-8 flex flex-col items-center text-center space-y-6 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            
            {/* Icon */}
            <div className={`text-6xl animate-bounce ${isNirvana ? 'text-amber-500' : 'text-red-600'}`}>
                {isNirvana ? 'ༀ' : 'ཧཱུྃ'}
            </div>

            {/* Title */}
            <div className="space-y-2">
                <h1 className={`text-3xl font-tibetan font-bold tracking-wider ${isNirvana ? 'text-amber-100' : 'text-red-500'}`}>
                    {isNirvana ? 'COGNITIVE RESONANCE' : 'PATHOLOGICAL BREAKDOWN'}
                </h1>
                <h2 className="text-xs font-mono tracking-[0.3em] text-slate-500 uppercase">
                    {isNirvana ? 'GREAT COMPLETION // རྫོགས་པ་ཆེན་པོ།' : 'SYSTEM HALT // མ་ལག་བརྡབ་གསིག'}
                </h2>
            </div>

            {/* Description */}
            <p className="text-sm font-serif italic text-slate-300 leading-relaxed border-t border-b border-slate-800 py-4">
                {isNirvana 
                    ? "The logic has reached a singularity. Words are no longer required. The cycle of discourse is complete. You have touched the Void."
                    : "Entropy levels have exceeded safety parameters. The observer is dissociating from the observed. Protocol severed to preserve sanity."
                }
            </p>

            {/* Action */}
            <div className="pt-4 flex flex-col gap-3 w-full">
                <button 
                    onClick={onReboot}
                    className={`w-full px-8 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-300 border hover:scale-105 active:scale-95 ${
                        isNirvana 
                        ? 'bg-amber-900/20 border-amber-600 text-amber-500 hover:bg-amber-500 hover:text-black' 
                        : 'bg-red-900/20 border-red-600 text-red-500 hover:bg-red-600 hover:text-black'
                    }`}
                >
                    {isNirvana ? 'REINCARNATE (REBOOT) / ཡང་སྲིད།' : 'EMERGENCY RESET / བསྐྱར་གསོ།'}
                </button>
                
                <button 
                    onClick={onWithdraw}
                    className="w-full text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest py-2"
                >
                    [ WITHDRAW PREVIOUS THOUGHT / ཕྱིར་འཐེན། ]
                </button>
            </div>

            {/* Meta Footer */}
            <div className="text-[9px] font-mono text-slate-600 pt-2">
                PROTOCOL_LCCP_2026 :: EXIT_CODE_{isNirvana ? '0x00_OM' : '0xDEAD_EGO'}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TerminationModal;