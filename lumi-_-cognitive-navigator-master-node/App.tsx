
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiKeySelector } from './components/ApiKeySelector';
import { VajraCore } from './components/VajraCore';
import { CourseModule } from './CourseModule';
import { VideoTheater } from './components/VideoTheater';
import { TopologyBackground } from './components/TopologyBackground';
import { useLumiOrchestrator } from './services/useLumiOrchestrator';
import { AppState } from './types';

/**
 * [PSYCHO_MECHANICAL_ENGINEERING]: v174.0.2
 * Status: Commander-Staff-Sapper architecture stable.
 * Feature: Hidden Door (Spacebar) for Override.
 */

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    appState, messages, statusText, auditLog,
    videoUrl, videoScript, showTheater, setShowTheater,
    isCollapsing, currentDay, setCurrentDay, completedDays,
    memory, knobValues, setKnobValues, setIsSovereign,
    currentSkin, handleSend, handleGenerateVideoCourse,
    activeSnapshot, reset
  } = useLumiOrchestrator();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, statusText]);

  // [HIDDEN_DOOR]: Spacebar to toggle Input
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault(); 
        setShowInput(prev => !prev);
      }
      if (e.code === 'Escape') {
        setShowInput(false);
        reset();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [reset]);

  const onManualSend = () => {
    if (manualInput.trim()) {
      handleSend(manualInput);
      setManualInput("");
      setShowInput(false);
    }
  };

  return (
    <div className={`h-[100dvh] flex flex-row relative overflow-hidden font-sans bg-black transition-all duration-1000 ${isCollapsing ? 'scale-110 grayscale invert brightness-150' : ''}`}>
      <ApiKeySelector onKeySelected={() => setIsAuthenticated(true)} />
      
      <TopologyBackground pattern={currentSkin.topology} color={currentSkin.color} />

      {/* Audit Log Stream (Left) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden lg:flex flex-col gap-4 opacity-30">
         {auditLog.map(log => (
           <div key={log.id} className="text-[9px] font-mono text-white/50 tracking-tighter uppercase">
             [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, second: '2-digit' })}] {log.message}
           </div>
         ))}
      </div>

      <AnimatePresence>
        {showTheater && videoUrl && videoScript && (
          <VideoTheater videoUrl={videoUrl} script={videoScript} onClose={() => setShowTheater(false)} title="法界特別法庭" subtitle={`PHASE ${currentDay}`} />
        )}
      </AnimatePresence>

      {/* Main Interface */}
      <div className="flex-1 flex flex-col relative overflow-hidden border-x border-white/5">
        <header className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md z-10">
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-[0.3em] text-white">LUMI <span className="opacity-20 font-light">v174</span></h1>
            <p className="text-[7px] tracking-[0.4em] uppercase font-bold text-white/40">{currentSkin.name} // STABLE_CORE</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </header>

        <main ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-12 custom-scrollbar relative">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-12">
              <VajraCore state={appState} activeSnapshot={activeSnapshot} knobValues={knobValues} currentDay={currentDay} onClick={() => setShowInput(true)} />
              <div className="text-center space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[1em] text-white/20 animate-pulse">PRESS SPACE TO OVERRIDE</p>
                {statusText && <p className="text-[8px] text-white/40 font-mono uppercase">{statusText}</p>}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto flex flex-col gap-12 py-12">
              {messages.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} gap-4`}
                >
                  <div className={`max-w-[85%] p-8 rounded-[3rem] border border-white/10 backdrop-blur-3xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-white/5 text-white/90' : 'bg-black/40 text-white/80'}`}>
                    {m.content}
                    {m.image && <img src={m.image} className="mt-6 rounded-2xl w-full border border-white/10" alt="manifestation" />}
                    {m.anchor && (
                      <div className="mt-6 pt-6 border-t border-white/5">
                        <span className="text-[7px] font-black uppercase tracking-widest text-amber-500/50 block mb-2">Anchor</span>
                        <p className="text-xs font-black text-amber-500/80 uppercase tracking-widest">{m.anchor}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {statusText && (
                <div className="flex justify-start animate-pulse">
                  <div className="p-4 rounded-full bg-white/5 border border-white/10 text-[8px] text-white/40 uppercase tracking-widest">
                    {statusText}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Hidden Door Footer */}
        <footer className="p-10 border-t border-white/5 bg-black/60 flex flex-col items-center gap-6 z-10">
          <AnimatePresence>
            {showInput ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-lg flex flex-col items-center"
              >
                <input 
                  autoFocus
                  className="w-full bg-transparent border-b border-white/20 text-center py-4 text-white text-lg font-light tracking-wide outline-none focus:border-white/60 transition-colors"
                  placeholder="PROTOCOL OVERRIDE..."
                  value={manualInput}
                  onChange={e => setManualInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      onManualSend();
                    }
                  }}
                />
                <p className="text-[7px] text-white/20 mt-4 tracking-widest uppercase">Intention Injection Active</p>
              </motion.div>
            ) : (
              <p className="text-[8px] uppercase tracking-[1.5em] font-black text-white/10">LUCID_ENGINE_ACTIVE // v174</p>
            )}
          </AnimatePresence>
        </footer>
      </div>

      {/* Course Module (Right) */}
      <CourseModule 
        currentDay={currentDay} completedDays={completedDays} inputText={manualInput} 
        knobValues={knobValues} memory={memory}
        onKnobChange={setKnobValues} onReset={() => {}} 
        onSelectDay={setCurrentDay} onApplyScript={handleSend} 
        onGenerateVideo={handleGenerateVideoCourse} 
      />
    </div>
  );
}

export default App;
