
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, KnobValues } from '../types';

interface VoidPortalProps {
  state: AppState;
  onClose: () => void;
  onSubmit: (text: string) => void;
  lastLumiText: string;
  knobValues: KnobValues;
}

export const VoidPortal: React.FC<VoidPortalProps> = ({ state, onClose, onSubmit, lastLumiText, knobValues }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state === AppState.INPUTTING) {
      inputRef.current?.focus();
    }
  }, [state]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        onSubmit(input);
        setInput("");
      }
    }
    if (e.key === 'Escape') onClose();
  };

  const statusText = state === AppState.THINKING ? "正在觀測意圖..." : 
                     state === AppState.SYNTHESIZING ? "正在生成法界影像..." : 
                     "將意圖注入虛空...";

  return (
    <motion.div 
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      className="fixed inset-0 z-40 bg-black/80 flex flex-col items-center justify-center p-10"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl flex flex-col items-center gap-16" 
        onClick={e => e.stopPropagation()}
      >
        {/* Status Messaging */}
        <div className="text-center space-y-4">
           <motion.p 
             key={statusText}
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="text-[10px] font-black uppercase tracking-[0.8em] text-white/30"
           >
             {statusText}
           </motion.p>
           
           {(state === AppState.THINKING || state === AppState.SYNTHESIZING) && (
             <div className="w-48 h-[1px] bg-white/10 mx-auto relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-white/40"
                  animate={{ x: [-200, 200] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
             </div>
           )}
        </div>

        {/* Input Area */}
        <div className="w-full relative flex flex-col items-center">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="..."
            disabled={state !== AppState.INPUTTING}
            className="w-full bg-transparent border-none text-center text-4xl font-light text-white placeholder:text-white/5 focus:ring-0 resize-none overflow-hidden h-24 tracking-tighter"
            style={{ 
              textShadow: `0 0 ${10 + knobValues.blur * 20}px rgba(255,255,255,${0.2})`,
              opacity: state === AppState.INPUTTING ? 1 : 0.2
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};
