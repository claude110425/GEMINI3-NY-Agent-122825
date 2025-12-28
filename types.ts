
export type Language = 'English' | '繁體中文';
export type Theme = 'Light' | 'Dark';

export interface Settings {
  theme: Theme;
  language: Language;
  painterStyle: string;
  defaultModel: string;
  maxTokens: number;
  temperature: number;
  apiKey: string;
}

export interface AgentHistoryEntry {
  id: string;
  tab: string;
  agent: string;
  model: string;
  tokensEst: number;
  timestamp: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  systemPrompt: string;
  defaultModel: string;
}

export type TabKey = 
  | 'dashboard' 
  | 'intelligence' 
  | 'transformer' 
  | 'summary' 
  | 'comparator' 
  | 'checklist' 
  | 'notekeeper';
