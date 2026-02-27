export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export type SystemMode = 'SOURCE' | 'SANDBOX';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  entropy?: number; 
  isLifeAnchor?: boolean; 
  anchorData?: LifeAnchorData; 
}

export interface LifeAnchorData {
  crystal_type: "LIFE_ANCHOR";
  event_node: string;
  summary: string;
  core_mantra: string;
  logic_seal: string;
  insights: string[]; 
}

export interface Kalpa {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
  entropy: number;
  duration: number;
}

export interface ToolCall {
  name: string;
  args: Record<string, any>;
  status?: 'PENDING' | 'EXECUTED' | 'FAILED';
}

export interface ShoushouResponse {
    text: string;
    entropy: number;
    latency: number;
    color: string;
    isLifeAnchor?: boolean;
    anchorData?: LifeAnchorData;
    toolCalls?: ToolCall[];
}

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  PROCESSING = 'PROCESSING',
  MEDITATING = 'MEDITATING'
}

export interface LogEntry {
  id: string;
  timestamp: number;
  type: 'INFO' | 'WARN' | 'ERROR' | 'FLUX';
  source: 'SYS' | 'NET' | 'CORE';
  message: string;
  meta?: {
    latency?: number;
    entropy?: number;
    mode?: SystemMode; // NEW: Track mode in logs
  };
}