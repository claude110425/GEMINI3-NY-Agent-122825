
import React, { useState } from 'react';
import { Settings, AgentHistoryEntry } from '../types';
import { GeminiService } from '../services/geminiService';
import Editor from './Editor';

interface ChecklistReportProps {
  settings: Settings;
  onLog: (entry: Omit<AgentHistoryEntry, 'id' | 'timestamp'>) => void;
}

const ChecklistReport: React.FC<ChecklistReportProps> = ({ settings, onLog }) => {
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState('');
  const [checklist, setChecklist] = useState('');
  const [results, setResults] = useState('');
  const [finalReport, setFinalReport] = useState('');

  const generateChecklist = async () => {
    if (!settings.apiKey) return alert("API Key required");
    setLoading(true);
    const service = new GeminiService(settings.apiKey);
    try {
      const result = await service.generate(
        settings.defaultModel,
        "You are an FDA guidance interpreter. You turn official guidance documents into actionable review checklists.",
        `Create a review checklist based on this guidance:\n${guidance}\nLanguage: ${settings.language}`,
        settings.maxTokens
      );
      setChecklist(result);
      onLog({ tab: 'Checklist', agent: 'Guidance Agent', model: settings.defaultModel, tokensEst: Math.ceil(result.length / 4) });
    } catch (e) { alert("Checklist error"); } finally { setLoading(false); }
  };

  const generateReport = async () => {
    if (!settings.apiKey) return alert("API Key required");
    setLoading(true);
    const service = new GeminiService(settings.apiKey);
    try {
      const result = await service.generate(
        settings.defaultModel,
        "You are a professional FDA review writer. You combine checklists and findings into polished, formal review reports.",
        `Create a final review report based on the checklist and results provided:\n\nChecklist:\n${checklist}\n\nResults:\n${results}\nLanguage: ${settings.language}`,
        settings.maxTokens
      );
      setFinalReport(result);
      onLog({ tab: 'Report', agent: 'Report Agent', model: settings.defaultModel, tokensEst: Math.ceil(result.length / 4) });
    } catch (e) { alert("Report error"); } finally { setLoading(false); }
  };

  return (
    <div className="h-full flex flex-col gap-12">
      {/* Step 1: Guidance to Checklist */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">1</span>
          Guidance to Checklist
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[300px]">
          <textarea 
            className="p-4 border rounded dark:bg-zinc-900 dark:border-zinc-800 text-sm font-mono custom-scrollbar" 
            placeholder="Paste Guidance (Text/MD/PDF content)..."
            value={guidance}
            onChange={(e) => setGuidance(e.target.value)}
          />
          <Editor content={checklist} onChange={setChecklist} label="Generated Checklist" isDark={settings.theme === 'Dark'} />
        </div>
        <button onClick={generateChecklist} disabled={loading || !guidance} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Processing Guidance...' : 'Generate Review Checklist'}
        </button>
      </div>

      <div className="h-px bg-gray-200 dark:bg-zinc-800"></div>

      {/* Step 2: Checklist + Results to Report */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">2</span>
          Build Review Report
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[300px]">
          <textarea 
            className="p-4 border rounded dark:bg-zinc-900 dark:border-zinc-800 text-sm font-mono custom-scrollbar" 
            placeholder="Paste Review Results/Findings..."
            value={results}
            onChange={(e) => setResults(e.target.value)}
          />
          <Editor content={finalReport} onChange={setFinalReport} label="Final Review Report" isDark={settings.theme === 'Dark'} />
        </div>
        <button onClick={generateReport} disabled={loading || !checklist || !results} className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
          {loading ? 'Synthesizing Report...' : 'Synthesize Official Review Report'}
        </button>
      </div>
    </div>
  );
};

export default ChecklistReport;
