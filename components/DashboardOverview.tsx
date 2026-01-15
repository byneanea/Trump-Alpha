import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { TradeSignal } from '../types';

interface DashboardProps {
  signals: TradeSignal[];
}

const mockChartData = [
  { time: '08:00', sentiment: 45, volume: 200 },
  { time: '10:00', sentiment: 55, volume: 450 },
  { time: '12:00', sentiment: 40, volume: 300 },
  { time: '14:00', sentiment: 75, volume: 800 }, // Simulated Trump Tweet Spike
  { time: '16:00', sentiment: 85, volume: 900 },
  { time: '18:00', sentiment: 80, volume: 600 },
];

export const DashboardOverview: React.FC<DashboardProps> = ({ signals }) => {
  const highProbSignals = signals.filter(s => s.probability > 75);

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-terminal-panel border border-gray-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-mono uppercase">Trump Sentiment</p>
            <h4 className="text-2xl font-bold text-white mt-1">BULLISH</h4>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-500">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="bg-terminal-panel border border-gray-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-mono uppercase">Active Signals</p>
            <h4 className="text-2xl font-bold text-white mt-1">{signals.length}</h4>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-500">
            <Activity size={20} />
          </div>
        </div>
        <div className="bg-terminal-panel border border-gray-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-mono uppercase">High Conviction</p>
            <h4 className="text-2xl font-bold text-gold-accent mt-1">{highProbSignals.length}</h4>
          </div>
          <div className="h-10 w-10 rounded-full bg-yellow-900/30 flex items-center justify-center text-gold-accent">
            <Zap size={20} />
          </div>
        </div>
        <div className="bg-terminal-panel border border-gray-800 p-4 rounded-xl flex items-center justify-between border-red-900/30">
          <div>
            <p className="text-gray-500 text-xs font-mono uppercase">Risk Level</p>
            <h4 className="text-2xl font-bold text-trump-red mt-1">HIGH</h4>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-900/30 flex items-center justify-center text-trump-red">
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-terminal-panel border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-trump-red rounded-full"></span>
              Volatility & Sentiment Index (Live)
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B22234" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#B22234" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" tick={{fontSize: 12}} />
                <YAxis stroke="#666" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1a1a1d', borderColor: '#333', color: '#fff'}}
                  itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="sentiment" stroke="#B22234" fillOpacity={1} fill="url(#colorSentiment)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Alerts */}
        <div className="lg:col-span-1 bg-terminal-panel border border-gray-800 rounded-xl p-6 overflow-hidden">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
            Priority Action Items
          </h3>
          <div className="space-y-3">
            {highProbSignals.length > 0 ? (
               highProbSignals.slice(0, 4).map(sig => (
                 <div key={sig.id} className="bg-gray-800/40 p-3 rounded border-l-2 border-gold-accent">
                    <div className="flex justify-between">
                      <span className="font-bold text-white">{sig.ticker}</span>
                      <span className="text-xs font-mono text-gold-accent">{sig.probability}% PROB</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 truncate">{sig.reasoning}</p>
                 </div>
               ))
            ) : (
              <div className="text-center py-10 text-gray-500 text-sm">Waiting for high conviction data...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};