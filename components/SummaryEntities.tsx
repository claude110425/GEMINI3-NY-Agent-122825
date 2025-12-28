
import React, { useState, useEffect } from 'react';
import { Settings, AgentHistoryEntry } from '../types';
import { GeminiService } from '../services/geminiService';
import Editor from './Editor';

interface SummaryEntitiesProps {
  settings: Settings;
  initialInput?: string;
  onLog: (entry: Omit<AgentHistoryEntry, 'id' | 'timestamp'>) => void;
}

const SummaryEntities: React.FC<SummaryEntitiesProps> = ({ settings, initialInput, onLog }) => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(initialInput || '');
  const [output, setOutput] = useState('');
  const [prompt, setPrompt] = useState('Create a comprehensive summary (3000-4000 words) of the doc in markdown. Also identify 20 key entities with context and comments in a table.');

  useEffect(() => {
    if (initialInput) setInput(initialInput);
  }, [initialInput]);

  const runAgent = async () => {
    if (!settings.apiKey) return alert("API Key required");
    setLoading(true);
    const service = new GeminiService(settings.apiKey);
    
    const userPrompt = `
      Instructions: ${prompt}
      Input Document:
      ${input}
      Language: ${settings.language}
    `;

    try {
      const result = await service.generate(
        settings.defaultModel,
        "You are an expert regulatory summarizing agent. You provide high-fidelity, extensive summaries and detailed entity extraction for medical device documentation.",
        userPrompt,
        settings.maxTokens,
        settings.temperature
      );
      setOutput(result);
      onLog({
        tab: 'Summary',
        agent: 'Summary & Entities Agent',
        model: settings.defaultModel,
        tokensEst: Math.ceil(result.length / 4)
      });
    } catch (e) {
      alert("Error summarizing doc");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[400px]">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-zinc-500 uppercase">Markdown Input</label>
          <textarea 
            className="flex-1 p-4 border rounded dark:bg-zinc-900 dark:border-zinc-800 text-sm font-mono custom-scrollbar" 
            placeholder="Paste source markdown here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-zinc-500 uppercase">Prompt Configuration</label>
          <textarea 
            className="flex-1 p-4 border rounded dark:bg-zinc-900 dark:border-zinc-800 text-sm" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={runAgent}
            disabled={loading || !input}
            className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Synthesizing...' : '🧠 Generate Deep Summary'}
          </button>
        </div>
      </div>

      <div className="flex-1">
        <Editor content={output} onChange={setOutput} label="Summary & Entities Result" isDark={settings.theme === 'Dark'} />
      </div>
    </div>
  );
};

export default SummaryEntities;
