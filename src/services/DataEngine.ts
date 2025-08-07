import { MarketData } from '../types';

export class DataEngine {
  private tickData: MarketData[] = [];
  private wsConnection: WebSocket | null = null;
  
  constructor() {
    this.generateHistoricalData();
    this.startRealTimeData();
  }

  private generateHistoricalData() {
    const now = new Date();
    let currentPrice = 1000 + Math.random() * 100;
    
    for (let i = 1000; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * 60 * 1000)); // 1-minute intervals
      
      // Simulate realistic price movement
      const change = (Math.random() - 0.5) * 2;
      const trend = Math.sin(i / 50) * 5;
      currentPrice += change + trend * 0.1;
      
      const high = currentPrice + Math.random() * 2;
      const low = currentPrice - Math.random() * 2;
      const volume = 1000 + Math.random() * 5000;
      
      this.tickData.push({
        timestamp,
        open: currentPrice - change,
        high,
        low,
        close: currentPrice,
        volume
      });
    }
  }

  private startRealTimeData() {
    // Simulate real-time data updates
    setInterval(() => {
      const latest = this.tickData[this.tickData.length - 1];
      const change = (Math.random() - 0.5) * 1.5;
      const newPrice = latest.close + change;
      
      const newTick: MarketData = {
        timestamp: new Date(),
        open: latest.close,
        high: Math.max(latest.close, newPrice + Math.random()),
        low: Math.min(latest.close, newPrice - Math.random()),
        close: newPrice,
        volume: 1000 + Math.random() * 3000
      };
      
      this.tickData.push(newTick);
      
      // Keep only last 1000 ticks
      if (this.tickData.length > 1000) {
        this.tickData.shift();
      }
    }, 1000);
  }

  getHistoricalData(asset: string, limit: number = 100): MarketData[] {
    return this.tickData.slice(-limit);
  }

  getLatestPrice(asset: string): number {
    return this.tickData[this.tickData.length - 1]?.close || 0;
  }

  subscribeToRealTime(asset: string, callback: (data: MarketData) => void) {
    // In a real implementation, this would connect to Deriv WebSocket API
    const interval = setInterval(() => {
      const latest = this.tickData[this.tickData.length - 1];
      if (latest) {
        callback(latest);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }
}