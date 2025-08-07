export interface Signal {
  id: string;
  timestamp: Date;
  asset: string;
  direction: 'buy' | 'sell' | 'hold';
  confidence: number;
  positionSize: 'none' | 'low' | 'medium' | 'high';
  predictedReward: number;
  riskRatio: number;
  modelVersion: string;
  modelType: 'LSTM' | 'Transformer' | 'Q-Learning' | 'Manual' | 'Hybrid';
}

export interface Trade {
  id: string;
  signal: Signal;
  entryPrice: number;
  exitPrice?: number;
  entryTime: Date;
  exitTime?: Date;
  status: 'open' | 'closed' | 'cancelled';
  pnl?: number;
  isWin?: boolean;
}

export interface PerformanceMetrics {
  accuracy: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
  expectancy: number;
  totalPnL: number;
  totalTrades: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
}

export interface MarketData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'premium';
  signalsUsed: number;
  signalsLimit: number;
  subscriptionEnd?: Date;
}

export interface Strategy {
  id: string;
  name: string;
  type: 'ai' | 'manual' | 'hybrid';
  enabled: boolean;
  parameters: Record<string, any>;
  performance: PerformanceMetrics;
}