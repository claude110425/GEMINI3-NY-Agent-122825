
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, 
  Theme, 
  Language, 
  TabKey, 
  AgentHistoryEntry 
} from './types';
import { 
  LABELS, 
  PAINTER_STYLES, 
  STYLE_CONFIGS, 
  ALL_MODELS 
} from './constants';
import Dashboard from './components/Dashboard';
import Intelligence from './components/Intelligence';
import Transformer from './components/Transformer';
import SummaryEntities from './components/SummaryEntities';
import Comparator from './components/Comparator';
import ChecklistReport from './components/ChecklistReport';
import NoteKeeper from './components/NoteKeeper';

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    theme: 'Light',
    language: 'English',
    painterStyle: 'Van Gogh',
    defaultModel: 'gemini-3-flash-preview',
    maxTokens: 12000,
    temperature: 0.2,
    apiKey: process.env.API_KEY || ''
  });

  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [history, setHistory] = useState<AgentHistoryEntry[]>([]);
  
  // Persistence for some outputs
  const [transformerOutput, setTransformerOutput] = useState<string>('');

  const t = (key: string) => LABELS[key]?.[settings.language] || key;

  const handleJackpot = () => {
    const randomStyle = PAINTER_STYLES[Math.floor(Math.random() * PAINTER_STYLES.length)];
    setSettings(prev => ({ ...prev, painterStyle: randomStyle }));
  };

  const logActivity = (entry: Omit<AgentHistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: AgentHistoryEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setHistory(prev => [newEntry, ...prev]);
  };

  const bgGradient = useMemo(() => STYLE_CONFIGS[settings.painterStyle] || "from-gray-100 to-gray-200", [settings.painterStyle]);

  return (
    <div className={`h-screen w-full flex flex-col transition-colors duration-500 ${settings.theme === 'Dark' ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-zinc-900'}`}>
      
      {/* Dynamic Painter Header */}
      <div className={`h-2 w-full bg-gradient-to-r ${bgGradient}`}></div>
      
      <header className="px-6 py-4 border-b flex items-center justify-between border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${bgGradient} shadow-lg flex items-center justify-center font-bold text-white text-xl`}>
            FDA
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">510(k) Agentic Reviewer</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">{t('dashboard')} AI Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-lg">
            {(['dashboard', 'intelligence', 'transformer', 'summary', 'comparator', 'checklist', 'notekeeper'] as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab 
                    ? `bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white` 
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {t(tab)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
           {/* API Key Input (if not from env) */}
           {!process.env.API_KEY && (
             <input
               type="password"
               placeholder={t('apikey')}
               value={settings.apiKey}
               onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
               className="text-xs px-3 py-1.5 rounded border dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 w-40"
             />
           )}
           <button 
             onClick={() => setSettings(prev => ({ ...prev, theme: prev.theme === 'Light' ? 'Dark' : 'Light' }))}
             className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
           >
             {settings.theme === 'Light' ? '🌙' : '☀️'}
           </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Settings */}
        <aside className="w-64 border-r border-gray-200 dark:border-zinc-800 p-6 flex flex-col gap-6 overflow-y-auto">
          <section>
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">{t('settings')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5">{t('language')}</label>
                <select 
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value as Language }))}
                  className="w-full text-sm px-3 py-2 rounded border dark:bg-zinc-900 dark:border-zinc-700"
                >
                  <option value="English">English</option>
                  <option value="繁體中文">繁體中文</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">{t('style')}</label>
                <div className="flex gap-2">
                  <select 
                    value={settings.painterStyle}
                    onChange={(e) => setSettings(prev => ({ ...prev, painterStyle: e.target.value }))}
                    className="flex-1 text-sm px-3 py-2 rounded border dark:bg-zinc-900 dark:border-zinc-700"
                  >
                    {PAINTER_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button 
                    onClick={handleJackpot}
                    className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded border dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    title={t('jackpot')}
                  >
                    🎰
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">{t('model')}</label>
                <select 
                  value={settings.defaultModel}
                  onChange={(e) => setSettings(prev => ({ ...prev, defaultModel: e.target.value }))}
                  className="w-full text-sm px-3 py-2 rounded border dark:bg-zinc-900 dark:border-zinc-700"
                >
                  {ALL_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">Temperature</label>
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  value={settings.temperature}
                  onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          </section>
        </aside>

        {/* Dynamic Content */}
        <section className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {activeTab === 'dashboard' && <Dashboard history={history} />}
          {activeTab === 'intelligence' && <Intelligence settings={settings} onLog={logActivity} />}
          {activeTab === 'transformer' && <Transformer settings={settings} onLog={logActivity} onOutput={setTransformerOutput} />}
          {activeTab === 'summary' && <SummaryEntities settings={settings} initialInput={transformerOutput} onLog={logActivity} />}
          {activeTab === 'comparator' && <Comparator settings={settings} onLog={logActivity} />}
          {activeTab === 'checklist' && <ChecklistReport settings={settings} onLog={logActivity} />}
          {activeTab === 'notekeeper' && <NoteKeeper settings={settings} onLog={logActivity} />}
        </section>
      </main>
    </div>
  );
};

export default App;
