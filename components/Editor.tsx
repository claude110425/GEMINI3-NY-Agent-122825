
import React, { useState } from 'react';

interface EditorProps {
  content: string;
  onChange: (val: string) => void;
  label?: string;
  isDark?: boolean;
}

const Editor: React.FC<EditorProps> = ({ content, onChange, label, isDark }) => {
  const [viewMode, setViewMode] = useState<'markdown' | 'text'>('markdown');

  return (
    <div className={`flex flex-col h-full rounded-xl border ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-white'} overflow-hidden shadow-sm`}>
      <div className={`px-4 py-2 flex items-center justify-between border-b ${isDark ? 'border-zinc-800 bg-zinc-800/40' : 'border-gray-100 bg-gray-50/50'}`}>
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label || 'Editor'}</span>
        <div className="flex gap-1 p-0.5 bg-gray-200 dark:bg-zinc-800 rounded-md">
          <button
            onClick={() => setViewMode('markdown')}
            className={`px-3 py-1 text-[10px] font-bold rounded ${viewMode === 'markdown' ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-500' : 'text-zinc-500'}`}
          >
            MD
          </button>
          <button
            onClick={() => setViewMode('text')}
            className={`px-3 py-1 text-[10px] font-bold rounded ${viewMode === 'text' ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-500' : 'text-zinc-500'}`}
          >
            TXT
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        {viewMode === 'text' ? (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm bg-transparent border-none focus:outline-none resize-none custom-scrollbar"
            placeholder="Edit results here..."
          />
        ) : (
          <div className="w-full h-full flex flex-col">
             <textarea
                value={content}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-1/2 p-4 font-mono text-xs bg-zinc-50 dark:bg-zinc-950/20 border-b border-gray-100 dark:border-zinc-800 focus:outline-none resize-none custom-scrollbar"
                placeholder="Source markdown..."
              />
              <div className="flex-1 p-6 overflow-y-auto prose dark:prose-invert prose-sm max-w-none custom-scrollbar">
                {/* Simulated Markdown Preview - standard rendering would use a library like react-markdown */}
                {content.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h1>;
                  if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-3 mb-1">{line.replace('## ', '')}</h2>;
                  if (line.startsWith('|')) return <div key={i} className="font-mono text-[10px] my-1 opacity-80 whitespace-pre">{line}</div>;
                  if (line.trim() === '') return <br key={i} />;
                  return <p key={i} className="mb-1 leading-relaxed">{line}</p>;
                })}
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
