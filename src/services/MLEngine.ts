import { Signal, MarketData } from '../types';

export class MLEngine {
  private lstmModel: LSTMModel;
  private transformerModel: TransformerModel;
  private qAgent: QAgent;

  constructor() {
    this.lstmModel = new LSTMModel();
    this.transformerModel = new TransformerModel();
    this.qAgent = new QAgent();
  }

  async generateSignal(marketData: MarketData[], asset: string): Promise<Signal> {
    // Simulate feature engineering
    const features = this.extractFeatures(marketData);
    
    // Get predictions from all models
    const lstmPrediction = await this.lstmModel.predict(features);
    const transformerPrediction = await this.transformerModel.predict(features);
    const qLearningAction = await this.qAgent.selectAction(features);
    
    // Ensemble prediction
    const direction = this.ensemblePrediction(lstmPrediction, transformerPrediction, qLearningAction);
    const confidence = this.calculateConfidence(lstmPrediction, transformerPrediction);
    
    return {
      id: `signal_${Date.now()}`,
      timestamp: new Date(),
      asset,
      direction,
      confidence,
      positionSize: this.calculatePositionSize(confidence, qLearningAction.positionSize),
      predictedReward: lstmPrediction.expectedReturn,
      riskRatio: transformerPrediction.riskReward,
      modelVersion: 'v2.1.0',
      modelType: 'Hybrid'
    };
  }

  private extractFeatures(marketData: MarketData[]) {
    const latest = marketData[marketData.length - 1];
    const prices = marketData.map(d => d.close);
    
    return {
      price: latest.close,
      rsi: this.calculateRSI(prices, 14),
      macd: this.calculateMACD(prices),
      ema: this.calculateEMA(prices, 20),
      bollinger: this.calculateBollingerBands(prices, 20),
      volatility: this.calculateVolatility(prices),
      volume: latest.volume,
      priceChange: (latest.close - marketData[marketData.length - 2]?.close) || 0
    };
  }

  private calculateRSI(prices: number[], period: number): number {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(prices: number[]) {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    return {
      macd: ema12 - ema26,
      signal: this.calculateEMA([ema12 - ema26], 9),
      histogram: (ema12 - ema26) - this.calculateEMA([ema12 - ema26], 9)
    };
  }

  private calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0;
    
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  private calculateBollingerBands(prices: number[], period: number) {
    const sma = prices.slice(-period).reduce((a, b) => a + b) / period;
    const variance = prices.slice(-period).reduce((a, b) => a + Math.pow(b - sma, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    
    return {
      upper: sma + (2 * stdDev),
      middle: sma,
      lower: sma - (2 * stdDev)
    };
  }

  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;
    
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push(Math.log(prices[i] / prices[i - 1]));
    }
    
    const mean = returns.reduce((a, b) => a + b) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance * 252); // Annualized volatility
  }

  private ensemblePrediction(lstm: any, transformer: any, qLearning: any): 'buy' | 'sell' | 'hold' {
    const votes = [lstm.direction, transformer.direction, qLearning.action];
    const buyVotes = votes.filter(v => v === 'buy').length;
    const sellVotes = votes.filter(v => v === 'sell').length;
    
    if (buyVotes > sellVotes) return 'buy';
    if (sellVotes > buyVotes) return 'sell';
    return 'hold';
  }

  private calculateConfidence(lstm: any, transformer: any): number {
    return Math.min(95, Math.max(55, (lstm.confidence + transformer.confidence) / 2));
  }

  private calculatePositionSize(confidence: number, qSize: string): 'none' | 'low' | 'medium' | 'high' {
    if (confidence < 60) return 'none';
    if (confidence < 70) return 'low';
    if (confidence < 80) return 'medium';
    return 'high';
  }
}

class LSTMModel {
  async predict(features: any) {
    // Simulate LSTM prediction
    const trend = Math.sin(Date.now() / 100000) + (Math.random() - 0.5) * 0.5;
    return {
      direction: trend > 0.1 ? 'buy' : trend < -0.1 ? 'sell' : 'hold',
      confidence: 60 + Math.random() * 25,
      expectedReturn: Math.abs(trend) * 0.02
    };
  }
}

class TransformerModel {
  async predict(features: any) {
    // Simulate Transformer prediction
    const signal = Math.cos(Date.now() / 80000) + (Math.random() - 0.5) * 0.3;
    return {
      direction: signal > 0.15 ? 'buy' : signal < -0.15 ? 'sell' : 'hold',
      confidence: 65 + Math.random() * 20,
      riskReward: 1.5 + Math.random() * 1.0
    };
  }
}

class QAgent {
  async selectAction(features: any) {
    // Simulate Q-Learning action selection
    const state = this.getState(features);
    const action = this.epsilonGreedy(state);
    
    return {
      action: action.direction,
      positionSize: action.size,
      qValue: Math.random() * 10
    };
  }

  private getState(features: any) {
    return {
      volatility: features.volatility > 0.2 ? 'high' : 'low',
      trend: features.rsi > 70 ? 'overbought' : features.rsi < 30 ? 'oversold' : 'neutral'
    };
  }

  private epsilonGreedy(state: any) {
    const actions = [
      { direction: 'buy', size: 'low' },
      { direction: 'buy', size: 'medium' },
      { direction: 'sell', size: 'low' },
      { direction: 'sell', size: 'medium' },
      { direction: 'hold', size: 'none' }
    ];
    
    return actions[Math.floor(Math.random() * actions.length)];
  }
}