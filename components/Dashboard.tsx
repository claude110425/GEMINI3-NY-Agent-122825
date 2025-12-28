
import React from 'react';
import { AgentHistoryEntry } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  history: AgentHistoryEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ history }) => {
  const stats = React.useMemo(() => {
    const totalRuns = history.length;
    const totalTokens = history.reduce((sum, entry) => sum + entry.tokensEst, 0);
    const tabCounts = history.reduce((acc, entry) => {
      acc[entry.tab] = (acc[entry.tab] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(tabCounts).map(([name, value]) => ({ name, value }));
    return { totalRuns, totalTokens, chartData };
  }, [history]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
          <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Total Runs</p>
          <h3 className="text-3xl font-bold">{stats.totalRuns}</h3>
        </div>
        <div className="p-6 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/50">
          <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-1">Est. Tokens</p>
          <h3 className="text-3xl font-bold">{stats.totalTokens.toLocaleString()}</h3>
        </div>
        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50">
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Active Sessions</p>
          <h3 className="text-3xl font-bold">{Math.ceil(stats.totalRuns / 2)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Activity by Agent</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888822" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {history.length > 0 ? (
              history.map(entry => (
                <div key={entry.id} className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-between border border-gray-100 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-semibold">{entry.agent}</p>
                    <p className="text-xs text-zinc-500">{new Date(entry.timestamp).toLocaleString()}</p>
                  </div>
                  <span className="text-xs font-mono bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                    {entry.model}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-zinc-400 italic">
                No activity yet. Run an agent to see stats.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
