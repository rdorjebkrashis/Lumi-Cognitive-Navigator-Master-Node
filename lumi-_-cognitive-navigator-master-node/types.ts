
export interface KnobValues {
  entropy: number; 
  blur: number;    
  speed: number;   
}

export type CrystalShape = 'Tetrahedron' | 'Cube' | 'Octahedron' | 'Dodecahedron' | 'Sphere';
export type TopologyPattern = 'chaotic' | 'grid' | 'fluid' | 'mandala';

/**
 * [REALITY_STATE_MACHINE]
 * Strict linear flow to prevent UI flickering or state loss.
 */
export enum AppState {
  IDLE = 'IDLE',
  INPUTTING = 'INPUTTING',
  THINKING = 'THINKING',
  SYNTHESIZING = 'SYNTHESIZING',
  PROCESSING = 'PROCESSING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  type: 'SOVEREIGN_EVENT' | 'AUTO_TUNE' | 'MIRROR_REFLEX' | 'GROWTH_PHASE';
  message: string;
  payload: any;
}

export interface MemorySnapshot {
  timestamp: number;
  poison_vector: string;
  wisdom_manifest: string;
  color_hex: string;
  topology_depth: number;
  commander_intent_summary: string;
  intent_purity: number;
  entropy_level: number;
  flux_intensity: number;
  crystalline_index?: number;
  intent_entropy?: number;
  course_day: number;
  recommended_day?: number;
  growth_shape?: CrystalShape;
  alchemical_review?: string;
  action_anchor?: string;
}

export interface FractalDay {
  day: number;
  title: string;
  goal: string;
  mandala_layer: string;
  entropy_threshold: number;
  scripts: {
    highEntropy: string[];
    lowEntropy: string[];
    transition?: string;
  };
  default_anchor: {
    type: string;
    instruction: string;
    mantra: string;
  };
  branches: { term: string; def: string }[];
}

export interface HeterogeneousMemory {
  immediate: MemorySnapshot[];
  resonance: any[];
  anchors: any[];
}

export interface AlchemicalContext {
  shape: CrystalShape;
  day: number;
  entropy: number;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}