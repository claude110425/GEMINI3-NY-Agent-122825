
import React from 'react';

export const ALL_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash-lite-latest',
  'gemini-flash-latest'
];

export const PAINTER_STYLES = [
  "Van Gogh", "Monet", "Picasso", "Da Vinci", "Rembrandt",
  "Matisse", "Kandinsky", "Hokusai", "Yayoi Kusama", "Frida Kahlo",
  "Salvador Dali", "Rothko", "Pollock", "Chagall", "Basquiat",
  "Haring", "Georgia O'Keeffe", "Turner", "Seurat", "Escher"
];

export const STYLE_CONFIGS: Record<string, string> = {
  "Van Gogh": "from-blue-900 via-indigo-800 to-yellow-600",
  "Monet": "from-blue-200 via-pink-100 to-green-100",
  "Picasso": "from-red-400 via-yellow-400 to-blue-500",
  "Da Vinci": "from-amber-100 via-orange-100 to-stone-300",
  "Rembrandt": "from-stone-900 via-stone-800 to-orange-950",
  "Matisse": "from-pink-300 via-red-400 to-blue-300",
  "Kandinsky": "from-cyan-400 via-purple-500 to-yellow-300",
  "Hokusai": "from-blue-600 via-cyan-100 to-stone-400",
  "Yayoi Kusama": "from-yellow-400 via-orange-500 to-red-600",
  "Frida Kahlo": "from-emerald-400 via-pink-400 to-red-400",
  "Salvador Dali": "from-indigo-600 via-amber-400 to-blue-300",
  "Rothko": "from-red-800 via-orange-700 to-red-900",
  "Pollock": "from-stone-800 via-stone-400 to-stone-900",
  "Chagall": "from-blue-400 via-purple-300 to-pink-200",
  "Basquiat": "from-yellow-400 via-black to-red-500",
  "Haring": "from-red-500 via-white to-blue-500",
  "Georgia O'Keeffe": "from-rose-100 via-orange-500 to-stone-100",
  "Turner": "from-yellow-200 via-amber-300 to-gray-400",
  "Seurat": "from-blue-50 via-green-50 to-pink-50",
  "Escher": "from-gray-300 via-gray-600 to-gray-900"
};

export const LABELS: Record<string, { English: string; '繁體中文': string }> = {
  dashboard: { English: 'Dashboard', '繁體中文': '儀表板' },
  intelligence: { English: '510(k) Intelligence', '繁體中文': '510(k) 智能分析' },
  transformer: { English: 'PDF Transformer', '繁體中文': 'PDF 轉換' },
  summary: { English: 'Summary & Entities', '繁體中文': '摘要與實體' },
  comparator: { English: 'Comparator', '繁體中文': '版本比較' },
  checklist: { English: 'Checklist & Report', '繁體中文': '清單與報告' },
  notekeeper: { English: 'Note Keeper', '繁體中文': '筆記助手' },
  settings: { English: 'Global Settings', '繁體中文': '全局設置' },
  theme: { English: 'Theme', '繁體中文': '主題' },
  language: { English: 'Language', '繁體中文': '語言' },
  style: { English: 'Painter Style', '繁體中文': '繪畫風格' },
  jackpot: { English: 'Jackpot!', '繁體中文': '隨機風格!' },
  model: { English: 'Model', '繁體中文': '模型' },
  run: { English: 'Run Agent', '繁體中文': '執行代理' },
  output: { English: 'Output', '繁體中文': '輸出結果' },
  markdown: { English: 'Markdown', '繁體中文': 'Markdown 預覽' },
  plaintext: { English: 'Text', '繁體中文': '純文本' },
  apikey: { English: 'Gemini API Key', '繁體中文': 'Gemini API 金鑰' },
};
