import React, { useState, useEffect, useCallback } from 'react';
import MandalaVisualizer from './components/MandalaVisualizer';
import Terminal from './components/Terminal';
import FiveWisdomsMonitor from './components/FiveWisdomsMonitor'; 
import MandalaNav, { ViewMode } from './components/MandalaNav';
import SovereignDiaryModal from './components/SovereignDiaryModal';
import DiaryGarden from './components/DiaryGarden';
import CrystalField from './components/CrystalField';
import HistoryVault from './components/HistoryVault';
import DreamSpace from './components/DreamSpace';
import SettingsModule from './components/SettingsModule';
import { sendMessageToShoushou, dehydrateMessageIntoAnchor } from './services/geminiService';
import { initDB, saveMemoryCrystal, loadAlayaVijnana, dissolveKarma } from './services/shambhalaDatabase';
import { sonicVajra } from './services/audioEngine';
import { Message, Role, SystemMode, LifeAnchorData, LogEntry } from './types';

const generateId = () => Math.random().toString(36).substring(2, 15);

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVoidActive, setIsVoidActive] = useState(false); 
  const [showVajraSeal, setShowVajraSeal] = useState(false);
  const [selectedAnchorMsg, setSelectedAnchorMsg] = useState<Message | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>('COMMAND'); 
  const [intensity, setIntensity] = useState(0.5); 
  const [colorMode, setColorMode] = useState('BLUE'); 
  const [systemMode, setSystemMode] = useState<SystemMode>('SOURCE');
  
  const [sessionStartTime] = useState(Date.now());

  useEffect(() => {
    initDB().then(() => {
        loadAlayaVijnana().then(data => {
            setMessages(data);
            console.log(`[ALAYA] Rehydrated ${data.length} messages.`);
        });
    });
  }, []); 

  const addManualMessage = useCallback((msg: Message) => {
    setMessages(prev => {
        const updated = [...prev, msg];
        saveMemoryCrystal(msg);
        return updated;
    });
  }, []);

  const handleCrystallizeMessage = async (msg: Message) => {
      setIsProcessing(true);
      sonicVajra.triggerTone(432, 'sine');
      
      try {
          const anchorData = await dehydrateMessageIntoAnchor(msg);
          if (anchorData) {
              setMessages(prev => {
                  const updated = prev.map(m => m.id === msg.id ? { ...m, anchorData, isLifeAnchor: true } : m);
                  const updatedMsg = updated.find(m => m.id === msg.id);
                  if (updatedMsg) saveMemoryCrystal(updatedMsg);
                  return updated;
              });
              
              setShowVajraSeal(true);
              sonicVajra.triggerTone(528, 'sine');
              setTimeout(() => setShowVajraSeal(false), 3000);
          }
      } catch (e) {
          console.error("MANUAL_CRYSTAL_FAILED", e);
      } finally {
          setIsProcessing(false);
      }
  };

  const handleSendMessage = async (text: string) => {
    if (isVoidActive || isProcessing) return;
    const userMsg: Message = { id: generateId(), role: Role.USER, content: text, timestamp: Date.now() };
    
    setMessages(prev => {
        const updated = [...prev, userMsg];
        saveMemoryCrystal(userMsg);
        return updated;
    });

    setIsProcessing(true);

    try {
      const response = await sendMessageToShoushou(text, [...messages, userMsg], systemMode);
      
      if (response.isLifeAnchor) {
          setColorMode('WHITE');
          setIntensity(0.05);
          setShowVajraSeal(true);
          sonicVajra.triggerTone(528, 'sine');
          setTimeout(() => setShowVajraSeal(false), 5000);
      } else {
          setIntensity(response.entropy);
          setColorMode(response.color as any);
      }

      const modelMsg: Message = {
        id: generateId(), 
        role: Role.MODEL, 
        content: response.text, 
        timestamp: Date.now(), 
        entropy: response.entropy, 
        isLifeAnchor: response.isLifeAnchor, 
        anchorData: response.anchorData
      };

      setMessages(prev => {
          const updated = [...prev, modelMsg];
          saveMemoryCrystal(modelMsg);
          return updated;
      });
      
      sonicVajra.updateEntropy(response.entropy);
    } catch (e) {
      console.error("COMM_ERROR", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleSystemMode = () => {
    const nextMode = systemMode === 'SOURCE' ? 'SANDBOX' : 'SOURCE';
    setSystemMode(nextMode);
    
    if (nextMode === 'SANDBOX') {
        sonicVajra.triggerTone(216, 'square'); 
        setColorMode('WHITE');
    } else {
        sonicVajra.triggerTone(432, 'sine'); 
        setColorMode('BLUE');
    }
    
    setLogs(prev => [{
        id: generateId(),
        timestamp: Date.now(),
        type: 'FLUX',
        source: 'CORE',
        message: `Field Shift Detected: Entering ${nextMode} Context.`,
        meta: { mode: nextMode, entropy: intensity }
    }, ...prev]);
  };

  const handlePurge = async () => {
      if (window.confirm("RESET ALAYA? This will dissolve all current memories.")) {
          await dissolveKarma();
          window.location.reload();
      }
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${isVoidActive ? 'bg-zinc-800' : 'bg-black'} text-slate-200 overflow-hidden`}>
      <CrystalField messages={messages} onOpenAnchor={(msg) => setSelectedAnchorMsg(msg)} />
      
      <MandalaNav 
        activeView={activeView} 
        onChangeView={setActiveView} 
        intensity={intensity} 
        systemMode={systemMode} 
        onToggleMode={handleToggleSystemMode} 
      />

      <main className={`relative z-10 container mx-auto h-screen p-6 flex gap-6 transition-all duration-700 ${activeView !== 'COMMAND' ? 'opacity-20 blur-sm pointer-events-none' : 'opacity-100'}`}>
        <div className="w-[340px] flex flex-col gap-6">
          <div className="p-6 rounded-xl border border-white/5 bg-black/20 backdrop-blur-md">
             <h1 className="text-2xl font-tibetan font-bold uppercase tracking-tighter">Lumi_v2</h1>
             <div className="mt-4">
                <FiveWisdomsMonitor intensity={intensity} colorMode={isVoidActive ? 'GRAY' : colorMode} />
             </div>
          </div>
          <div className="flex-1 rounded-xl border border-white/5 overflow-hidden bg-black/40 relative">
             <MandalaVisualizer 
                intensity={intensity} 
                isProcessing={isProcessing} 
                colorMode={isVoidActive ? 'GRAY' : colorMode} 
                isSandboxMode={systemMode === 'SANDBOX'} 
                isVoidActive={isVoidActive} 
             />
             <div className="absolute bottom-4 left-0 w-full text-center">
                <span className={`text-[9px] font-mono uppercase tracking-[0.5em] ${systemMode === 'SANDBOX' ? 'text-green-500' : 'text-cyan-500'} opacity-50`}>
                    Dream_Sync: {systemMode}
                </span>
             </div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
             <Terminal 
                messages={messages} 
                isProcessing={isProcessing} 
                onSendMessage={handleSendMessage} 
                onCrystallize={handleCrystallizeMessage}
                intensity={intensity} 
                onOpenAnchor={(msg) => setSelectedAnchorMsg(msg)} 
             />
        </div>
      </main>

      <HistoryVault isOpen={activeView === 'ARCHIVE'} onClose={() => setActiveView('COMMAND')} logs={logs} currentMessages={messages} sessionStartTime={sessionStartTime} entropy={intensity} />
      <DreamSpace isOpen={activeView === 'VISION'} onClose={() => setActiveView('COMMAND')} />
      <DiaryGarden isOpen={activeView === 'DIARY'} onClose={() => setActiveView('COMMAND')} messages={messages} onOpenAnchor={(msg) => setSelectedAnchorMsg(msg)} />
      <SettingsModule isOpen={activeView === 'SYSTEM'} onClose={() => setActiveView('COMMAND')} intensity={intensity} setIntensity={setIntensity} hasKey={true} onPurge={handlePurge} onAddMessage={addManualMessage} />

      {showVajraSeal && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[300] bg-white text-black px-8 py-4 rounded-full font-mono text-xs shadow-[0_0_50px_rgba(255,255,255,0.4)] animate-in fade-in slide-in-from-top-4 flex items-center gap-3">
              <span className="animate-pulse font-tibetan text-lg">ཨ</span>
              <span className="font-bold tracking-widest">梦境定锚：见地已提炼</span>
          </div>
      )}
      
      <SovereignDiaryModal message={selectedAnchorMsg} allMessages={messages} onClose={() => setSelectedAnchorMsg(null)} />
    </div>
  );
};

export default App;