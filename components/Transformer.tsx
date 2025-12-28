
import React, { useState } from 'react';
import { Settings, AgentHistoryEntry } from '../types';
import { GeminiService } from '../services/geminiService';
import Editor from './Editor';

interface TransformerProps {
  settings: Settings;
  onLog: (entry: Omit<AgentHistoryEntry, 'id' | 'timestamp'>) => void;
  onOutput: (val: string) => void;
}

const Transformer: React.FC<TransformerProps> = ({ settings, onLog, onOutput }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState('1-10');
  const [output, setOutput] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const runAgent = async () => {
    if (!settings.apiKey) return alert("API Key required");
    if (!file) return alert("Upload PDF first");

    setLoading(true);
    const service = new GeminiService(settings.apiKey);
    
    // In a browser environment, we'd normally parse PDF bytes. 
    // For this prototype, we'll simulate the "transformation" instruction.
    // Real implementation would use FileReader and potentially Gemini's multimodal PDF support if enabled.
    
    const userPrompt = `
      Instructions: Transform the following PDF document content into organized Markdown.
      Pages requested: ${pages}
      Document Name: ${file.name}
      Please maintain headers, lists, and tables structure.
      Language: ${settings.language}
    `;

    try {
      const result = await service.generate(
        settings.defaultModel,
        "You are a professional PDF-to-Markdown transformer. You excel at extracting clean structural markdown from regulatory documents.",
        userPrompt,
        settings.maxTokens,
        settings.temperature
      );
      setOutput(result);
      onOutput(result);
      onLog({
        tab: 'Transformer',
        agent: 'PDF Transformer',
        model: settings.defaultModel,
        tokensEst: Math.ceil(result.length / 4)
      });
    } catch (e) {
      alert("Error processing PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="p-8 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center gap-4 bg-gray-50/50 dark:bg-zinc-900/20">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" />
        <label htmlFor="pdf-upload" className="cursor-pointer px-6 py-3 bg-white dark:bg-zinc-800 border rounded-xl shadow-sm hover:shadow-md transition-all">
          {file ? `📄 ${file.name}` : '📁 Click to upload PDF'}
        </label>
        <p className="text-xs text-zinc-500 uppercase tracking-widest">Supports medical device 510(k) submissions</p>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex flex-col gap-1 w-32">
          <label className="text-xs font-bold text-zinc-500 uppercase">Page Range</label>
          <input 
            className="p-2 border rounded dark:bg-zinc-900 dark:border-zinc-800" 
            value={pages} 
            onChange={(e) => setPages(e.target.value)}
          />
        </div>
        <button 
          onClick={runAgent}
          disabled={loading || !file}
          className="flex-1 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-bold rounded-lg disabled:opacity-50 transition-all"
        >
          {loading ? 'Processing...' : '⚡ Transform to Markdown'}
        </button>
      </div>

      <div className="flex-1">
        <Editor content={output} onChange={setOutput} label="Markdown View" isDark={settings.theme === 'Dark'} />
      </div>
    </div>
  );
};

export default Transformer;
