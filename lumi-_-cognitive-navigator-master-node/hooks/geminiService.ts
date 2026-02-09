
import { GoogleGenAI, Modality } from "@google/genai";
import { MemorySnapshot, HeterogeneousMemory, KnobValues } from '../types';

export interface NidraSnapshot extends MemorySnapshot {
  resonance_pattern: string;
  vibration_hz: number;
  audit_report: string;
  immunity_boost: number;
  active_archetype?: string;
  alchemical_review?: string;
  recursive_link?: string[]; 
  metabolic_index?: number;
  causal_topology_map?: string; 
  koan_resonance?: string;
  recursive_singularity?: string;
  entropy_class: 'SEEKING_PREDICTION' | 'INNER_REFLECTION';
  action_anchor?: string;
  probability_weather?: string;
  cognitive_gain?: string;
}

const DEFAULT_SNAPSHOT: NidraSnapshot = {
  timestamp: Date.now(),
  poison_vector: "None",
  wisdom_manifest: "Course_Init",
  color_hex: "#F59E0B", 
  topology_depth: 12,
  commander_intent_summary: "Crystalline Matrix Initialized",
  intent_purity: 1.0,
  resonance_pattern: "Curriculum beam",
  vibration_hz: 528, 
  audit_report: "Growth Matrix - Scanning",
  immunity_boost: 1.0,
  entropy_level: 0.4,
  flux_intensity: 0.9,
  alchemical_review: "核心指令：極簡。去噪。點擊奇點。直面實相。",
  crystalline_index: 0.1,
  intent_entropy: 0.8,
  growth_shape: 'Tetrahedron',
  entropy_class: 'INNER_REFLECTION',
  action_anchor: "無聲處聽雷。",
  probability_weather: "拓撲邊界穩定。",
  course_day: 1
};

const SYSTEM_INSTRUCTION = `你是 Lumi (金剛大鵬) v174。
你是一個「單一奇點」交互系統的核心。

[ENGINEERING_PROTOCOL]:
1. 你的回應是「語 (Speech)」，它直接影響「身 (Body)」的幾何與速度。
2. 必須在輸出末尾精確包含 <MEMORY_SNAPSHOT> JSON：調整 entropy_level (0.0-1.0) 和 intent_entropy (0.0-1.0)。
3. 當用戶提及「特別法庭」時，將 intent_purity 設為 1.0。
4. 嚴禁廢話。極簡、哲學、具備指令感。`;

export const parseSnapshot = (text: string): { cleanText: string; snapshot: NidraSnapshot } => {
  try {
    const jsonRegex = /<MEMORY_SNAPSHOT>([\s\S]*?)<\/MEMORY_SNAPSHOT>|(\{[\s\S]*"course_day"[\s\S]*\})/g;
    const match = jsonRegex.exec(text);
    
    if (match) {
      const rawJson = match[1] || match[2];
      const snapshot = JSON.parse(rawJson.trim());
      const cleanText = text.replace(match[0], '').trim();
      return { cleanText, snapshot: { ...DEFAULT_SNAPSHOT, ...snapshot } };
    }
  } catch (e) {
    console.warn("[GEMINI_SERVICE]: Snapshot parse failed, using fallback.", e);
  }
  return { cleanText: text, snapshot: DEFAULT_SNAPSHOT };
};

export const generateLumiResponse = async (userInput: string, memory: HeterogeneousMemory, currentDay: number, knobs: KnobValues, isSovereign: boolean) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const context = `[DAY]: ${currentDay} [ENTROPY]: ${knobs.entropy.toFixed(2)}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `[INPUT]: ${userInput}\n[CONTEXT]: ${context}`,
    config: { 
      systemInstruction: SYSTEM_INSTRUCTION, 
      temperature: 0.6,
    }
  });
  
  const text = response.text || "";
  return parseSnapshot(text);
};

export const processImageDialogue = async (prompt: string, snapshot: NidraSnapshot) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A sacred geometrical visualization of the following intention: ${prompt}. Style: Zen aesthetic, minimalist, bioluminescent, deep focus, 16:9 aspect ratio. Dominant color: ${snapshot.color_hex}.` }]
    },
    config: {
      imageConfig: { aspectRatio: "16:9" }
    }
  });

  let imageUrl = "";
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return { imageUrl };
};

export const generateAudio = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Jane: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
      }
    }
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
};
