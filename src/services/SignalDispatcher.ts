import { Signal } from '../types';

export class SignalDispatcher {
  private subscribers: Array<(signal: Signal) => void> = [];
  private signalQueue: Signal[] = [];

  subscribe(callback: (signal: Signal) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  dispatch(signal: Signal) {
    this.signalQueue.push(signal);
    this.notifySubscribers(signal);
    
    // Simulate delivery to external channels
    this.deliverToTelegram(signal);
    this.deliverToDiscord(signal);
    this.deliverToEmail(signal);
  }

  private notifySubscribers(signal: Signal) {
    this.subscribers.forEach(callback => {
      try {
        callback(signal);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  private deliverToTelegram(signal: Signal) {
    // Simulate Telegram delivery
    console.log(`📱 Telegram: ${signal.asset} ${signal.direction.toUpperCase()} - Confidence: ${signal.confidence.toFixed(1)}%`);
  }

  private deliverToDiscord(signal: Signal) {
    // Simulate Discord delivery
    console.log(`💬 Discord: ${signal.asset} ${signal.direction.toUpperCase()} - Confidence: ${signal.confidence.toFixed(1)}%`);
  }

  private deliverToEmail(signal: Signal) {
    // Simulate email delivery
    console.log(`📧 Email: ${signal.asset} ${signal.direction.toUpperCase()} - Confidence: ${signal.confidence.toFixed(1)}%`);
  }

  getRecentSignals(limit: number = 50): Signal[] {
    return this.signalQueue.slice(-limit);
  }

  clearHistory() {
    this.signalQueue = [];
  }
}