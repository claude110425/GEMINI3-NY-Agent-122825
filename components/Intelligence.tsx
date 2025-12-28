
import React, { useState } from 'react';
import { Settings, AgentHistoryEntry } from '../types';
import { GeminiService } from '../services/geminiService';
import Editor from './Editor';

interface IntelligenceProps {
  settings: Settings;
  onLog: (entry: Omit<AgentHistoryEntry, 'id' | 'timestamp'>) => void;
}

const Intelligence: React.FC<IntelligenceProps> = ({ settings, onLog }) => {
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({ deviceName: '', kNumber: '', sponsor: '', prodCode: '' });
  const [output, setOutput] = useState('');
  const [prompt, setPrompt] = useState('Search FDA related information and summarize in markdown (3000-4000 words). Include at least 5 tables on: Overview, Indications, Technical comparison, Testing, and Risks.');

  const runAgent = async () => {
    if (!settings.apiKey) {
      alert("Please provide an API Key.");
      return;
    }
    setLoading(true);
    const service = new GeminiService(settings.apiKey);
    
    const fullPrompt = `
      User Input:
      Device Name: ${inputs.deviceName}
      510(k) Number: ${inputs.kNumber}
      Sponsor: ${inputs.sponsor}
      Product Code: ${inputs.prodCode}
      
      Instructions: ${prompt}
      Language: ${settings.language}
    `;

    try {
      // For searching, we use Search Grounding
      const result = await service.generate(
        settings.defaultModel,
        "You are an FDA 510(k) specialist agent. You provide comprehensive, detailed regulatory analysis.",
        fullPrompt,
        settings.maxTokens,
        settings.temperature,
        true // Enable Search Grounding
      );
      setOutput(result);
      onLog({
        tab: 'Intelligence',
        agent: 'FDA Search Agent',
        model: settings.defaultModel,
        tokensEst: Math.ceil(result.length / 4)
      });
    } catch (e) {
      console.error(e);
      alert("Error running agent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-zinc-500 uppercase">Device Name</label>
          <input 
            className="p-2 border rounded dark:bg-zinc-900 dark:border-zinc-800" 
            value={inputs.deviceName} 
            onChange={(e) => setInputs({...inputs, deviceName: e.target.value})}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-zinc-500 uppercase">510(k) Number</label>
          <input 
            className="p-2 border rounded dark:bg-zinc-900 dark:border-zinc-800" 
            value={inputs.kNumber} 
            onChange={(e) => setInputs({...inputs, kNumber: e.target.value})}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-zinc-500 uppercase">Sponsor</label>
          <input 
            className="p-2 border rounded dark:bg-zinc-900 dark:border-zinc-800" 
            value={inputs.sponsor} 
            onChange={(e) => setInputs({...inputs, sponsor: e.target.value})}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-zinc-500 uppercase">Product Code</label>
          <input 
            className="p-2 border rounded dark:bg-zinc-900 dark:border-zinc-800" 
            value={inputs.prodCode} 
            onChange={(e) => setInputs({...inputs, prodCode: e.target.value})}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-500 uppercase">Custom Prompt Instruction</label>
        <textarea 
          className="p-3 border rounded dark:bg-zinc-900 dark:border-zinc-800 h-24 text-sm" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <button 
        onClick={runAgent}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {loading ? <span className="animate-spin text-xl">🌀</span> : '🚀'} Run Intelligence Analysis
      </button>

      <div className="flex-1 min-h-[500px]">
        <Editor content={output} onChange={setOutput} label="Analysis Results" isDark={settings.theme === 'Dark'} />
      </div>
    </div>
  );
};

export default Intelligence;
