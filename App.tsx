import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DashboardOverview } from './components/DashboardOverview';
import { IntelFeed } from './components/IntelFeed';
import { StrategyBoard } from './components/StrategyBoard';
import { TradeSignal, TimeHorizon } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Initial Mock Data (Pre-loaded with examples from the prompt)
  const [signals, setSignals] = useState<TradeSignal[]>([
    {
      id: 'init-1',
      ticker: 'GEO',
      name: 'Geo Group Inc',
      sector: 'Private Prisons',
      horizon: TimeHorizon.SHORT,
      action: 'BUY',
      probability: 85,
      reasoning: 'Strong correlation with "Border" rhetoric.',
      catalystKeyword: 'Border',
      timestamp: Date.now()
    },
    {
      id: 'init-2',
      ticker: 'DJT',
      name: 'Trump Media',
      sector: 'Technology',
      horizon: TimeHorizon.SHORT,
      action: 'BUY',
      probability: 90,
      reasoning: 'Hype momentum on "Fake News" attacks.',
      catalystKeyword: 'Fake News',
      timestamp: Date.now()
    },
    {
      id: 'init-3',
      ticker: 'X',
      name: 'US Steel',
      sector: 'Industrial',
      horizon: TimeHorizon.MID,
      action: 'BUY',
      probability: 70,
      reasoning: 'Tariff protection expectations.',
      catalystKeyword: 'Tariff',
      timestamp: Date.now()
    },
    {
      id: 'init-4',
      ticker: 'WMT',
      name: 'Walmart',
      sector: 'Retail',
      horizon: TimeHorizon.MID,
      action: 'SELL',
      probability: 65,
      reasoning: 'Supply chain costs increase due to tariffs.',
      catalystKeyword: 'Tariff',
      timestamp: Date.now()
    },
     {
      id: 'init-5',
      ticker: 'RTX',
      name: 'Raytheon',
      sector: 'Defense',
      horizon: TimeHorizon.LONG,
      action: 'BUY',
      probability: 80,
      reasoning: 'Strategic deterrence needs regardless of war status.',
      catalystKeyword: 'Military',
      timestamp: Date.now()
    }
  ]);

  const handleNewSignal = (signal: TradeSignal) => {
    setSignals(prev => [signal, ...prev]);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardOverview signals={signals} />}
      {activeTab === 'intel' && <IntelFeed onSignalGenerated={handleNewSignal} />}
      {activeTab === 'strategy' && <StrategyBoard signals={signals} />}
    </Layout>
  );
}