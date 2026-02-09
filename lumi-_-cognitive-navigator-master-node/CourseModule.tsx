
import React from 'react';
import { KnobValues, HeterogeneousMemory } from '../types';
import { MandalaTree } from './MandalaTree';

interface CourseModuleProps {
  currentDay: number;
  completedDays: number[];
  inputText: string;
  knobValues: KnobValues;
  memory: HeterogeneousMemory;
  onKnobChange: (v: KnobValues) => void;
  onReset: () => void;
  onSelectDay: (day: number) => void;
  onApplyScript: (s: string) => void;
  onGenerateVideo: (text: string) => void;
}

export const CourseModule: React.FC<CourseModuleProps> = ({ 
  currentDay, 
  completedDays, 
  knobValues,
  memory,
  onKnobChange,
  onReset,
  onSelectDay, 
  onApplyScript, 
}) => {

  return (
    <div className="w-[480px] border-l border-white/[0.03] bg-[#080808]/80 backdrop-blur-2xl flex flex-col h-full relative overflow-hidden">
      {/* Header Info */}
      <div className="p-10 z-20 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/20">Phase Objective</p>
        <p className="text-[13px] text-white/60 font-medium leading-relaxed italic">
          "The most powerful choice is the one you don't have to make."
        </p>
      </div>

      <div className="flex-1 relative z-10 px-6 pb-6 overflow-hidden">
        <MandalaTree 
          currentDay={currentDay}
          completedDays={completedDays}
          knobValues={knobValues}
          memory={memory}
          onKnobChange={onKnobChange}
          onSelectDay={onSelectDay}
          onApplyScript={onApplyScript}
        />
        
        {/* Reset Trigger: Subtle floating button */}
        <div className="absolute top-10 right-10 z-30">
           <button 
             onClick={onReset}
             className="w-10 h-10 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center text-white/20 hover:text-white transition-all hover:bg-white/5 active:scale-90"
           >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
           </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="p-10 bg-transparent flex justify-between items-end z-20">
        <div className="space-y-1">
           <p className="text-[8px] tracking-[0.6em] text-white/10 uppercase font-black">Architecture</p>
           <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase font-bold">Vajra Descent v172</p>
        </div>
      </div>
    </div>
  );
};
