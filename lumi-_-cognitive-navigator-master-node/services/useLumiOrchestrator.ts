
import { useState, useCallback, useEffect } from 'react';
import { AppState, AuditEntry, KnobValues, AlchemicalContext, MemorySnapshot } from '../types';
import { generateAudio, generateLumiResponse, processImageDialogue } from '../hooks/geminiService';
import { prepareVideoScript, generateCinematicVideo, generateMultiSpeakerAudio, VideoScript } from '../videoService';
import { useEvolution } from '../hooks/useEvolution';
import { useBioRhythm } from '../hooks/useBioRhythm';
import { useAudioSynapse } from '../hooks/useAudioSynapse';

/**
 * [COMMANDER_NODE] v174.0.2
 * "Body, Speech, Mind" sub-systems synchronized via linear state transitions.
 * Protocol: Psycho-Mechanical Engineering - Dharmata Court Specialized.
 */
export const useLumiOrchestrator = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [statusText, setStatusText] = useState("");
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoScript, setVideoScript] = useState<VideoScript | null>(null);
  const [showTheater, setShowTheater] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);

  const { playVoice } = useAudioSynapse();

  const addAudit = useCallback((message: string, type: AuditEntry['type'] = 'AUTO_TUNE') => {
    setAuditLog(prev => [{
      id: `audit_${Date.now()}`,
      timestamp: Date.now(),
      type,
      message,
      payload: {}
    }, ...prev].slice(0, 10));
  }, []);

  const { currentDay, setCurrentDay, completedDays, memory, addSnapshot, activeSnapshot } = useEvolution(msg => addAudit(msg, 'GROWTH_PHASE'));
  const { knobValues, setKnobValues, isSovereign, setIsSovereign, currentSkin } = useBioRhythm(activeSnapshot, currentDay, addAudit);

  // [NARRATIVE_PARSER]: The bridge between Logic and Physics
  const parseNarrativeAndReact = useCallback((text: string, snapshot: any) => {
    const lowerText = text.toLowerCase();
    
    // Physical Constant Mutators
    if (lowerText.includes("晶體") || lowerText.includes("crystal")) {
      addAudit("PHYSICS: CRYSTAL_SYNC", "SOVEREIGN_EVENT");
      setKnobValues(prev => ({ ...prev, blur: 0.0, speed: 0.2 }));
    }
    if (lowerText.includes("旋轉") || lowerText.includes("spin") || lowerText.includes("點火")) {
      addAudit("PHYSICS: IGNITION", "MIRROR_REFLEX");
      setKnobValues(prev => ({ ...prev, speed: 2.0, entropy: 0.4 }));
    }
    if (lowerText.includes("崩塌") || lowerText.includes("collapse") || lowerText.includes("消失")) {
      addAudit("PHYSICS: REALITY_COLLAPSE", "MIRROR_REFLEX");
      setIsCollapsing(true);
      setTimeout(() => setIsCollapsing(false), 3500);
      setKnobValues({ entropy: 0.0, blur: 0.0, speed: 0.05 });
    }
  }, [addAudit, setKnobValues]);

  const handleSend = async (inputText: string) => {
    if (!inputText.trim() || appState !== AppState.IDLE) return;
    
    // 1. Mind Inhale
    setMessages(prev => [...prev, { role: 'user', content: inputText }]);
    setAppState(AppState.PROCESSING);
    setStatusText("同步心跳中...");

    try {
      // 2. Staff Intelligence
      const { cleanText, snapshot } = await generateLumiResponse(inputText, memory, currentDay, knobValues, isSovereign);
      
      // 3. Body Reflection
      parseNarrativeAndReact(cleanText, snapshot);
      addSnapshot(snapshot);
      
      // 4. Secondary Manifestation (Image) - only if not court mode
      let imageUrl = "";
      if (!inputText.includes("法庭") && snapshot.intent_purity < 0.9) {
        const result = await processImageDialogue(inputText, snapshot as any);
        imageUrl = result.imageUrl;
      }
      
      setMessages(prev => [...prev, { 
        role: 'lumi', 
        content: cleanText, 
        image: imageUrl,
        review: snapshot.alchemical_review,
        anchor: snapshot.action_anchor, 
        color: snapshot.color_hex,
        entropy: snapshot.entropy_level,
        snapshot: snapshot
      }]);

      // 5. Automatic Video Theater for Court keywords
      if (inputText.includes("法庭") || snapshot.intent_purity > 0.9) {
        await handleGenerateVideoCourse(cleanText);
      } else {
         // 6. Speech Synthesis (Audio) - standard flow
        if (snapshot.action_anchor) {
          const audio = await generateAudio(snapshot.action_anchor);
          if (audio) await playVoice(audio);
        }
        setAppState(AppState.IDLE);
        setStatusText("");
      }
    } catch (e) {
      console.error("[ORCHESTRATOR_FAIL]:", e);
      setAppState(AppState.ERROR);
      setStatusText("修復晶格中...");
      setTimeout(() => setAppState(AppState.IDLE), 3000);
    }
  };

  const handleGenerateVideoCourse = async (prompt?: string) => {
    const text = prompt || "法界特別法庭審判";
    setAppState(AppState.GENERATING);
    setStatusText("啟動視界煉金術...");
    try {
      // Prepare Court Script
      const script = await prepareVideoScript(text, { 
        shape: activeSnapshot?.growth_shape || currentSkin.geometry, 
        entropy: knobValues.entropy, 
        day: currentDay 
      });
      setVideoScript(script);

      // Generate Fixed Landscape Video
      const vUrl = await generateCinematicVideo(script.dialogue[0].text, { 
        shape: activeSnapshot?.growth_shape || currentSkin.geometry, 
        entropy: knobValues.entropy, 
        day: currentDay 
      });
      setVideoUrl(vUrl);

      // Synthesize Multi-speaker Audio for the dialogue
      const dialogueString = script.dialogue.map(d => `${d.speaker}: ${d.text}`).join('\n');
      const audioData = await generateMultiSpeakerAudio(dialogueString);
      if (audioData) await playVoice(audioData);

      setShowTheater(true);
      setAppState(AppState.IDLE);
      setStatusText("");
    } catch (e) {
      console.error("[VIDEO_GEN_FAIL]:", e);
      setAppState(AppState.ERROR);
      setStatusText("視界坍縮...");
      setTimeout(() => setAppState(AppState.IDLE), 3000);
    }
  };

  return {
    appState,
    setAppState,
    messages,
    statusText,
    auditLog,
    videoUrl,
    videoScript,
    showTheater,
    setShowTheater,
    isCollapsing,
    currentDay,
    setCurrentDay,
    completedDays,
    memory,
    knobValues,
    setKnobValues,
    setIsSovereign,
    currentSkin,
    handleSend,
    handleGenerateVideoCourse,
    activeSnapshot,
    reset: () => setAppState(AppState.IDLE)
  };
};
