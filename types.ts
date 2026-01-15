export enum TimeHorizon {
  SHORT = 'SHORT_TERM', // 1 Day - 2 Weeks (Sniper)
  MID = 'MID_TERM',     // 1 Month - 6 Months (Swing)
  LONG = 'LONG_TERM'    // 1 Year - 3 Years (Strategic)
}

export enum Sentiment {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL'
}

export interface TradeSignal {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  horizon: TimeHorizon;
  action: 'BUY' | 'SELL' | 'HOLD';
  probability: number; // 0-100
  reasoning: string;
  catalystKeyword: string; // e.g., "Drill", "Tariff"
  timestamp: number;
  entryPrice?: number;
  stopLoss?: number;
}

export interface IntelItem {
  id: string;
  source: 'TRUTH_SOCIAL' | 'TWITTER' | 'OFFICIAL_WH';
  author: string;
  content: string;
  timestamp: number;
  analyzed: boolean;
  relatedSignalId?: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
}