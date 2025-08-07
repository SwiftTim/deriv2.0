import { Signal, Trade, PerformanceMetrics, MarketData } from '../types';

export class BacktestEngine {
  private balance = 10000;
  private trades: Trade[] = [];
  private equity: Array<{ timestamp: Date; value: number }> = [];

  async runBacktest(
    signals: Signal[],
    marketData: MarketData[],
    initialBalance = 10000
  ): Promise<{
    trades: Trade[];
    metrics: PerformanceMetrics;
    equity: Array<{ timestamp: Date; value: number }>;
  }> {
    this.balance = initialBalance;
    this.trades = [];
    this.equity = [{ timestamp: marketData[0].timestamp, value: initialBalance }];

    for (let i = 0; i < signals.length; i++) {
      const signal = signals[i];
      const currentPrice = this.findPriceAtTime(marketData, signal.timestamp);
      
      if (currentPrice && signal.direction !== 'hold') {
        await this.executeTrade(signal, currentPrice, marketData, i);
      }
    }

    // Close any remaining open trades
    this.closeOpenTrades(marketData[marketData.length - 1]);

    const metrics = this.calculateMetrics();
    return {
      trades: this.trades,
      metrics,
      equity: this.equity
    };
  }

  private async executeTrade(
    signal: Signal, 
    entryPrice: number, 
    marketData: MarketData[], 
    signalIndex: number
  ) {
    const positionSizeMultiplier = this.getPositionMultiplier(signal.positionSize);
    const tradeSize = this.balance * positionSizeMultiplier * 0.01; // Max 1% per trade
    
    if (tradeSize < 10) return; // Minimum trade size

    const trade: Trade = {
      id: `trade_${Date.now()}_${Math.random()}`,
      signal,
      entryPrice,
      entryTime: signal.timestamp,
      status: 'open'
    };

    // Simulate exit conditions (simplified)
    const exitTime = new Date(signal.timestamp.getTime() + 15 * 60 * 1000); // 15 minutes
    const exitPrice = this.findPriceAtTime(marketData, exitTime);

    if (exitPrice) {
      const pnl = this.calculatePnL(signal.direction, entryPrice, exitPrice, tradeSize);
      
      trade.exitPrice = exitPrice;
      trade.exitTime = exitTime;
      trade.pnl = pnl;
      trade.isWin = pnl > 0;
      trade.status = 'closed';
      
      this.balance += pnl;
      this.equity.push({
        timestamp: exitTime,
        value: this.balance
      });
    }

    this.trades.push(trade);
  }

  private findPriceAtTime(marketData: MarketData[], targetTime: Date): number | null {
    const closest = marketData.find(d => 
      Math.abs(d.timestamp.getTime() - targetTime.getTime()) < 60000 // Within 1 minute
    );
    return closest?.close || null;
  }

  private getPositionMultiplier(positionSize: string): number {
    switch (positionSize) {
      case 'low': return 0.25;
      case 'medium': return 0.5;
      case 'high': return 1.0;
      default: return 0;
    }
  }

  private calculatePnL(
    direction: string, 
    entryPrice: number, 
    exitPrice: number, 
    tradeSize: number
  ): number {
    const priceChange = exitPrice - entryPrice;
    const multiplier = direction === 'buy' ? 1 : -1;
    return (priceChange / entryPrice) * tradeSize * multiplier;
  }

  private closeOpenTrades(lastMarketData: MarketData) {
    this.trades
      .filter(trade => trade.status === 'open')
      .forEach(trade => {
        const pnl = this.calculatePnL(
          trade.signal.direction,
          trade.entryPrice,
          lastMarketData.close,
          this.balance * 0.01
        );
        
        trade.exitPrice = lastMarketData.close;
        trade.exitTime = lastMarketData.timestamp;
        trade.pnl = pnl;
        trade.isWin = pnl > 0;
        trade.status = 'closed';
        
        this.balance += pnl;
      });
  }

  private calculateMetrics(): PerformanceMetrics {
    const closedTrades = this.trades.filter(t => t.status === 'closed');
    const winningTrades = closedTrades.filter(t => t.isWin);
    const losingTrades = closedTrades.filter(t => !t.isWin);
    
    const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    
    const avgWin = winningTrades.length > 0 
      ? winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / winningTrades.length 
      : 0;
    
    const avgLoss = losingTrades.length > 0 
      ? Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / losingTrades.length)
      : 0;

    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;
    
    // Calculate Sharpe ratio (simplified)
    const returns = this.equity.slice(1).map((eq, i) => 
      (eq.value - this.equity[i].value) / this.equity[i].value
    );
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const returnStdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    );
    const sharpeRatio = returnStdDev > 0 ? (avgReturn / returnStdDev) * Math.sqrt(252) : 0;
    
    // Calculate max drawdown
    let maxDrawdown = 0;
    let peak = this.equity[0].value;
    
    this.equity.forEach(eq => {
      if (eq.value > peak) peak = eq.value;
      const drawdown = (peak - eq.value) / peak;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

    return {
      accuracy: winRate,
      winRate,
      sharpeRatio,
      maxDrawdown: maxDrawdown * 100,
      expectancy: avgWin * (winRate / 100) - avgLoss * ((100 - winRate) / 100),
      totalPnL,
      totalTrades: closedTrades.length,
      avgWin,
      avgLoss,
      profitFactor
    };
  }
}