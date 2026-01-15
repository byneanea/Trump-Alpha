import React, { useState, useEffect } from 'react';
import { Send, Cpu, AlertTriangle, CheckCircle } from 'lucide-react';
import { IntelItem, TradeSignal } from '../types';
import { analyzeIntelWithGemini } from '../services/geminiService';

interface IntelFeedProps {
  onSignalGenerated: (signal: TradeSignal) => void;
}

export const IntelFeed: React.FC<IntelFeedProps> = ({ onSignalGenerated }) => {
  const [inputText, setInputText] = useState('');
  const [apiKey, setApiKey] = useState(process.env.API_KEY || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feed, setFeed] = useState<IntelItem[]>([
    {
      id: '1',
      source: 'TRUTH_SOCIAL',
      author: 'Donald J. Trump',
      content: 'DRILL, BABY, DRILL! We will bring energy prices down by 50% in the first year. American Energy Dominance!',
      timestamp: Date.now() - 1000 * 60 * 60 * 2,
      analyzed: true
    },
    {
      id: '2',
      source: 'TWITTER',
      author: 'Elon Musk',
      content: 'DOGE will fix the government efficiency issues. It is inevitable.',
      timestamp: Date.now() - 1000 * 60 * 60 * 4,
      analyzed: true
    }
  ]);

  // Handle manual API Key input if not in env
  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    if (!apiKey) {
      alert("Please enter a Gemini API Key to use the AI Analysis features.");
      return;
    }

    setIsAnalyzing(true);
    const newId = Date.now().toString();
    
    // Add to feed locally
    const newItem: IntelItem = {
      id: newId,
      source: 'TRUTH_SOCIAL', // Simulated source
      author: 'Donald J. Trump (Simulated)',
      content: inputText,
      timestamp: Date.now(),
      analyzed: false
    };
    
    setFeed(prev => [newItem, ...prev]);
    setInputText('');

    try {
      const result = await analyzeIntelWithGemini(newItem.content, apiKey);
      
      if (result) {
        // Complete the signal
        const fullSignal: TradeSignal = {
          id: `SIG-${Date.now()}`,
          ticker: result.ticker || 'UNKNOWN',
          name: result.name || 'Unknown Asset',
          sector: result.sector || 'General',
          horizon: result.horizon || 'SHORT_TERM', // Fix: Ensure strictly matches enum in a real app
          action: result.action || 'HOLD',
          probability: result.probability || 50,
          reasoning: result.reasoning || 'No reasoning provided.',
          catalystKeyword: result.catalystKeyword || 'Manual Input',
          timestamp: Date.now(),
          entryPrice: 0, 
        } as TradeSignal;

        onSignalGenerated(fullSignal);
        
        // Update feed item status
        setFeed(prev => prev.map(item => item.id === newId ? { ...item, analyzed: true, relatedSignalId: fullSignal.id } : item));
      }
    } catch (e) {
      console.error(e);
      alert("Analysis failed. Check console/API Key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input / Control Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-terminal-panel border border-gray-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="text-gold-accent" size={20} />
            <h3 className="font-bold text-white">Signal Decoder</h3>
          </div>
          
          {!process.env.API_KEY && (
            <input
              type="password"
              placeholder="Enter Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 rounded-md px-3 py-2 text-sm text-white mb-4 focus:border-trump-red focus:outline-none"
            />
          )}

          <textarea
            className="w-full h-32 bg-black/40 border border-gray-700 rounded-md p-3 text-sm text-white resize-none focus:border-trump-blue focus:outline-none"
            placeholder="Paste raw text from Truth Social, X, or White House Briefings..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`w-full mt-3 py-2 rounded-md font-bold text-sm uppercase tracking-wide transition-colors flex justify-center items-center gap-2 ${
              isAnalyzing 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-trump-red hover:bg-red-700 text-white shadow-md shadow-red-900/20'
            }`}
          >
            {isAnalyzing ? 'Decoding Signal...' : <>Decode Signal <Send size={14}/></>}
          </button>
        </div>

        <div className="bg-blue-900/20 border border-blue-900/50 rounded-xl p-5">
           <h4 className="text-xs font-bold text-blue-400 uppercase mb-3">Monitoring Sources</h4>
           <div className="space-y-2">
             <div className="flex items-center justify-between text-sm text-gray-400">
               <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Truth Social</span>
               <span className="font-mono text-xs">LIVE</span>
             </div>
             <div className="flex items-center justify-between text-sm text-gray-400">
               <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> X (Elon Musk)</span>
               <span className="font-mono text-xs">LIVE</span>
             </div>
             <div className="flex items-center justify-between text-sm text-gray-400">
               <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Polymarket</span>
               <span className="font-mono text-xs">LIVE</span>
             </div>
           </div>
        </div>
      </div>

      {/* Feed Display */}
      <div className="lg:col-span-2 bg-terminal-panel border border-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-[600px]">
        <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
          <h3 className="font-bold text-white">Live Intelligence Stream</h3>
          <span className="text-xs font-mono text-gray-500">REFRESH RATE: 100ms</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {feed.map((item) => (
            <div key={item.id} className="relative pl-6 pb-2 border-l-2 border-gray-700 last:border-0">
              <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${item.source === 'TRUTH_SOCIAL' ? 'border-trump-red bg-gray-900' : 'border-blue-500 bg-gray-900'}`}></div>
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-2">
                     <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                       item.source === 'TRUTH_SOCIAL' ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'
                     }`}>{item.source}</span>
                     <span className="font-bold text-sm text-gray-200">{item.author}</span>
                   </div>
                   <span className="text-xs font-mono text-gray-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed font-mono">
                  "{item.content}"
                </p>
                {item.analyzed && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle size={12} />
                    <span>Signal Decoded & Sent to Strategy</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};