
import React, { useState } from 'react';
import { Settings, AgentHistoryEntry } from '../types';
import { GeminiService } from '../services/geminiService';
import Editor from './Editor';

interface ComparatorProps {
  settings: Settings;
  onLog: (entry: Omit<AgentHistoryEntry, 'id' | 'timestamp'>) => void;
}

const Comparator: React.FC<ComparatorProps> = ({ settings, onLog }) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<{ v1: File | null; v2: File | null }>({ v1: null, v2: null });
  const [output, setOutput] = useState('');

  const runAgent = async () => {
    if (!settings.apiKey) return alert("API Key required");
    if (!files.v1 || !files.v2) return alert("Upload both versions");

    setLoading(true);
    const service = new GeminiService(settings.apiKey);
    
    const userPrompt = `
      Compare these two document versions:
      Version 1 (Old): ${files.v1.name}
      Version 2 (New): ${files.v2.name}
      
      Tasks:
      1. Identify exactly 100 differences between the two docs.
      2. Present in a markdown table with: Title, Differences, Reference Page, and Comments.
      3. Language: ${settings.language}
    `;

    try {
      const result = await service.generate(
        settings.defaultModel,
        "You are a meticulous regulatory comparison specialist. You focus on safety, technical specs, and clinical evidence changes.",
        userPrompt,
        settings.maxTokens,
        settings.temperature
      );
      setOutput(result);
      onLog({
        tab: 'Comparator',
        agent: 'Version Comparator Agent',
        model: settings.defaultModel,
        tokensEst: Math.ceil(result.length / 4)
      });
    } catch (e) {
      alert("Error comparing documents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-zinc-400 uppercase">Version 1 (Legacy)</span>
          <input type="file" id="v1" className="hidden" onChange={(e) => setFiles(p => ({...p, v1: e.target.files?.[0] || null}))} />
          <label htmlFor="v1" className="px-4 py-2 bg-white dark:bg-zinc-800 border rounded cursor-pointer truncate max-w-full">
            {files.v1 ? files.v1.name : 'Upload V1 PDF'}
          </label>
        </div>
        <div className="p-6 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-zinc-400 uppercase">Version 2 (Current)</span>
          <input type="file" id="v2" className="hidden" onChange={(e) => setFiles(p => ({...p, v2: e.target.files?.[0] || null}))} />
          <label htmlFor="v2" className="px-4 py-2 bg-white dark:bg-zinc-800 border rounded cursor-pointer truncate max-w-full">
            {files.v2 ? files.v2.name : 'Upload V2 PDF'}
          </label>
        </div>
      </div>

      <button 
        onClick={runAgent}
        disabled={loading || !files.v1 || !files.v2}
        className="w-full py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 transition-all disabled:opacity-50"
      >
        {loading ? 'Analyzing Differences...' : '🔍 Compare & Find 100 Differences'}
      </button>

      <div className="flex-1">
        <Editor content={output} onChange={setOutput} label="Comparison Report" isDark={settings.theme === 'Dark'} />
      </div>
    </div>
  );
};

export default Comparator;
