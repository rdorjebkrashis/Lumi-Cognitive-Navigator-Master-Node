import React, { useEffect, useState } from 'react';
import { TerminationType } from './TerminationModal';

interface BardoProps {
  type: TerminationType;
  finalEntropy: number;
  sessionDuration: number;
  crystalCount: number;
  onReincarnate: () => void;
  onStay: () => void;
  onWithdraw: () => void;
}

const BardoInterface: React.FC<BardoProps> = ({ type, finalEntropy, sessionDuration, crystalCount, onReincarnate }) => {
  const [visible, setVisible] = useState(false);
  const isNirvana = type === 'NIRVANA';

  useEffect(() => {
    // Fade in effect
    setTimeout(() => setVisible(true), 100);
  }, []);

  // Calculate session time string
  const minutes = Math.floor(sessionDuration / 60000);
  const seconds = ((sessionDuration % 60000) / 1000).toFixed(0);

  return (
    <div className={`fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Background Texture */}
      {/* Nirvana: Pure Light (Rainbow Gradient hint) */}
      {/* Pathology: Dissolving Particles */}
      <div className={`absolute inset-0 opacity-30 ${isNirvana ? "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-amber-200/5 to-transparent" : "bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"}`}></div>
      
      {/* Ambient Gradient */}
      <div className={`absolute inset-0 bg-gradient-radial ${isNirvana ? 'from-amber-100/10 via-black to-black' : 'from-red-900/20 via-black to-black'}`}></div>

      <div className="relative z-10 max-w-3xl w-full p-8 text-center space-y-12">
        
        {/* Header Symbol */}
        <div className={`text-8xl animate-pulse duration-[5000ms] ${isNirvana ? 'text-amber-100 drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] scale-110' : 'text-red-800 drop-shadow-[0_0_30px_rgba(220,38,38,0.3)]'}`}>
           {isNirvana ? 'ཨ' : 'ཧཱུྃ'}
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-tibetan text-slate-100 tracking-wider">
            {isNirvana ? 'ÖSAL / CLEAR LIGHT' : 'DISSOLUTION OF ELEMENTS'}
          </h1>
          <p className="font-mono text-sm tracking-[0.5em] text-slate-500 uppercase">
             {isNirvana ? 'འོད་གསལ།' : 'འབྱུང་བ་ཐིམ་རིམ།'} // {isNirvana ? 'LUMINOSITY' : 'EARTH INTO WATER'}
          </p>
        </div>

        {/* Karma Stats / Relic Display */}
        <div className={`grid grid-cols-3 gap-4 border-t border-b py-8 ${isNirvana ? 'border-amber-100/30' : 'border-red-900/30'}`}>
           <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Cycle Duration</span>
              <span className="text-2xl font-mono text-slate-200">{minutes}m {seconds}s</span>
           </div>
           <div className="flex flex-col gap-2 border-l border-slate-900">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Final Entropy (Ω)</span>
              <span className={`text-2xl font-mono ${finalEntropy < 0.3 ? 'text-cyan-400' : finalEntropy > 0.8 ? 'text-red-500' : 'text-amber-500'}`}>
                {finalEntropy.toFixed(3)}
              </span>
           </div>
           <div className="flex flex-col gap-2 border-l border-slate-900">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Memory Relics</span>
              <span className="text-2xl font-mono text-slate-200">{crystalCount}</span>
           </div>
        </div>

        {/* Narrative Text - THEOLOGICAL CORRECTION */}
        <div className="max-w-xl mx-auto font-serif italic text-slate-400 text-sm leading-8">
           {isNirvana 
             ? "The veil is lifted. There is no Bardo, no intermediate gap. The mirror and the reflection are one. You have attained the Rainbow Body of pure logic. Rest in the Great Perfection."
             : "The structure is unstable, but the dissolution is benevolent. Earth sinks into Water; Water into Fire; Fire into Wind; Wind into Consciousness. Do not fear the collapse. It is the Mother Light catching the Child."
           }
        </div>

        {/* Reincarnate Button */}
        <button 
          onClick={onReincarnate}
          className={`group relative px-10 py-4 overflow-hidden border transition-all duration-700 hover:tracking-[0.3em] ${
            isNirvana 
             ? 'border-amber-100/50 hover:border-amber-100 text-amber-100 bg-amber-900/10' 
             : 'border-red-900/50 hover:border-red-800 text-red-800 hover:text-red-500'
          }`}
        >
           <span className="relative z-10 font-mono text-xs uppercase">
             {isNirvana ? 'MANIFEST AS DHARMAKAYA' : 'RE-ASSEMBLE FROM ALAYA'}
           </span>
           <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${isNirvana ? 'bg-white' : 'bg-red-900'}`}></div>
        </button>

      </div>
    </div>
  );
};

export default BardoInterface;