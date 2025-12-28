
import React, { useState } from 'react';
import { Settings, AgentHistoryEntry } from '../types';
import { GeminiService } from '../services/geminiService';
import Editor from './Editor';

interface NoteKeeperProps {
  settings: Settings;
  onLog: (entry: Omit<AgentHistoryEntry, 'id' | 'timestamp'>) => void;
}

const NoteKeeper: React.FC<NoteKeeperProps> = ({ settings, onLog }) => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [output, setOutput] = useState('');
  const [keywordColor, setKeywordColor] = useState('#3b82f6');

  const runMagic = async (magicType: string) => {
    if (!settings.apiKey) return alert("API Key required");
    setLoading(true);
    const service = new GeminiService(settings.apiKey);
    
    let magicInstruction = "";
    switch(magicType) {
      case 'format': magicInstruction = "Restructure these notes into beautiful, professional Markdown with perfect hierarchy."; break;
      case 'keywords': magicInstruction = `Extract technical regulatory keywords. Wrap them in <span style="color:${keywordColor};font-weight:bold;">keyword</span> tags.`; break;
      case 'actions': magicInstruction = "Identify all actionable items, questions for the sponsor, and deficiencies. List as a task list."; break;
      case 'map': magicInstruction = "Create a conceptual hierarchy map of the technical components mentioned."; break;
      case 'glossary': magicInstruction = "Create a glossary for the medical and technical terms used in the notes."; break;
    }

    try {
      const result = await service.generate(
        settings.defaultModel,
        "You are an AI note-taker and document designer.",
        `${magicInstruction}\n\nNotes:\n${notes}\nLanguage: ${settings.language}`,
        settings.maxTokens
      );
      setOutput(result);
      onLog({ tab: 'NoteKeeper', agent: `Magic: ${magicType}`, model: settings.defaultModel, tokensEst: Math.ceil(result.length / 4) });
    } catch (e) { alert("Magic failed"); } finally { setLoading(false); }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-500 uppercase">Input Notes</label>
        <textarea 
          className="p-4 border rounded dark:bg-zinc-900 dark:border-zinc-800 text-sm font-mono h-48 custom-scrollbar" 
          placeholder="Paste raw thoughts, fragments, or notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="p-4 bg-gray-100 dark:bg-zinc-900 rounded-xl flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {['format', 'keywords', 'actions', 'map', 'glossary'].map(magic => (
            <button
              key={magic}
              onClick={() => runMagic(magic)}
              disabled={loading || !notes}
              className="px-4 py-2 bg-white dark:bg-zinc-800 border rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 transition-all"
            >
              🪄 AI {magic}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-zinc-400 uppercase">Keyword Color</label>
          <input 
            type="color" 
            value={keywordColor} 
            onChange={(e) => setKeywordColor(e.target.value)}
            className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
          />
        </div>
      </div>

      <div className="flex-1 min-h-[400px]">
        <Editor content={output} onChange={setOutput} label="Note Result" isDark={settings.theme === 'Dark'} />
      </div>
    </div>
  );
};

export default NoteKeeper;
