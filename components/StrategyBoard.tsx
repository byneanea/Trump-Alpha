import React from 'react';
import { TradeSignal, TimeHorizon } from '../types';
import { TrendingUp, TrendingDown, Target, ShieldAlert, Clock } from 'lucide-react';

interface StrategyBoardProps {
  signals: TradeSignal[];
}

export const StrategyBoard: React.FC<StrategyBoardProps> = ({ signals }) => {
  
  const renderHorizonColumn = (horizon: TimeHorizon, title: string, description: string, colorClass: string) => {
    const relevantSignals = signals.filter(s => s.horizon === horizon);

    return (
      <div className="flex flex-col bg-terminal-panel border border-gray-800 rounded-xl overflow-hidden shadow-lg h-full">
        {/* Header */}
        <div className={`p-4 border-b border-gray-800 ${colorClass} bg-opacity-10`}>
          <div className="flex justify-between items-center mb-1">
             <h3 className="font-bold text-white text-lg tracking-wide">{title}</h3>
             <Clock size={16} className="text-gray-400" />
          </div>
          <p className="text-xs text-gray-400 font-mono">{description}</p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto min-h-[400px]">
           {relevantSignals.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
               <Target size={40} />
               <span className="text-sm mt-2 font-mono">NO ACTIVE TARGETS</span>
             </div>
           ) : (
             relevantSignals.map(signal => (
               <div key={signal.id} className="bg-black/40 border border-gray-700 rounded-lg p-3 hover:border-gray-500 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xl font-bold text-white">{signal.ticker}</span>
                      <span className="text-xs text-gray-500 ml-2 block">{signal.name}</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      signal.action === 'BUY' ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-900' : 'bg-red-900/40 text-red-400 border border-red-900'
                    }`}>
                      {signal.action}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Probability</span>
                      <span className="text-white font-mono">{signal.probability}%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${signal.probability > 75 ? 'bg-gold-accent' : signal.probability > 50 ? 'bg-emerald-500' : 'bg-gray-500'}`} 
                        style={{ width: `${signal.probability}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 p-2 rounded text-xs text-gray-300 font-mono mb-2 border border-gray-700/50">
                    <span className="text-gray-500 mr-1">Logic:</span>
                    {signal.reasoning}
                  </div>
                  
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-wider">
                    <ShieldAlert size={10} /> Catalyst: <span className="text-gray-300">{signal.catalystKeyword}</span>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {renderHorizonColumn(
        TimeHorizon.SHORT, 
        "SNIPER (Short)", 
        "1D - 2 Weeks | Event Driven", 
        "bg-red-900"
      )}
      {renderHorizonColumn(
        TimeHorizon.MID, 
        "SWING (Mid)", 
        "1M - 6 Months | Policy Waves", 
        "bg-blue-900"
      )}
      {renderHorizonColumn(
        TimeHorizon.LONG, 
        "STRATEGIC (Long)", 
        "1Y - 3 Years | Regime Shift", 
        "bg-emerald-900"
      )}
    </div>
  );
};