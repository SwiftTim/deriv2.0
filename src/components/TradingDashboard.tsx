import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, AlertCircle, Users, Settings } from 'lucide-react';
import { Signal, PerformanceMetrics, MarketData } from '../types';
import { MLEngine } from '../services/MLEngine';
import { DataEngine } from '../services/DataEngine';
import { SignalDispatcher } from '../services/SignalDispatcher';
import LiveSignals from './LiveSignals';
import PerformanceDashboard from './PerformanceDashboard';
import MarketChart from './MarketChart';
import StrategyPanel from './StrategyPanel';

const TradingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('signals');
  const [signals, setSignals] = useState<Signal[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isGeneratingSignals, setIsGeneratingSignals] = useState(false);
  
  // Initialize services
  const [mlEngine] = useState(() => new MLEngine());
  const [dataEngine] = useState(() => new DataEngine());
  const [signalDispatcher] = useState(() => new SignalDispatcher());

  useEffect(() => {
    // Load initial data
    const initialData = dataEngine.getHistoricalData('EURUSD', 500);
    setMarketData(initialData);

    // Subscribe to real-time data
    const unsubscribeData = dataEngine.subscribeToRealTime('EURUSD', (newData) => {
      setMarketData(prev => [...prev.slice(-499), newData]);
    });

    // Subscribe to signals
    const unsubscribeSignals = signalDispatcher.subscribe((signal) => {
      setSignals(prev => [signal, ...prev.slice(0, 49)]);
    });

    // Load recent signals
    const recentSignals = signalDispatcher.getRecentSignals();
    setSignals(recentSignals.reverse());

    // Generate mock metrics
    setMetrics({
      accuracy: 68.5,
      winRate: 72.3,
      sharpeRatio: 1.84,
      maxDrawdown: 12.4,
      expectancy: 0.23,
      totalPnL: 2847.65,
      totalTrades: 156,
      avgWin: 45.8,
      avgLoss: -23.2,
      profitFactor: 1.97
    });

    return () => {
      unsubscribeData();
      unsubscribeSignals();
    };
  }, [dataEngine, signalDispatcher]);

  useEffect(() => {
    // Auto-generate signals
    if (!isGeneratingSignals && marketData.length > 50) {
      setIsGeneratingSignals(true);
      
      const generateSignal = async () => {
        try {
          const signal = await mlEngine.generateSignal(marketData, 'EURUSD');
          signalDispatcher.dispatch(signal);
        } catch (error) {
          console.error('Error generating signal:', error);
        }
      };

      // Generate first signal immediately
      generateSignal();

      // Then generate signals every 30 seconds
      const interval = setInterval(generateSignal, 30000);
      
      return () => clearInterval(interval);
    }
  }, [marketData, mlEngine, signalDispatcher, isGeneratingSignals]);

  const tabs = [
    { id: 'signals', label: 'Live Signals', icon: Activity },
    { id: 'chart', label: 'Market Chart', icon: TrendingUp },
    { id: 'performance', label: 'Analytics', icon: AlertCircle },
    { id: 'strategies', label: 'Strategies', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">Deriv AI Trading Signals</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-400">Balance:</span>
              <span className="text-green-400 font-mono ml-2">$12,847.65</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Today P&L:</span>
              <span className="text-green-400 font-mono ml-2">+$247.32</span>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">Live</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'signals' && (
          <LiveSignals signals={signals} marketData={marketData} />
        )}
        
        {activeTab === 'chart' && (
          <MarketChart data={marketData} signals={signals} />
        )}
        
        {activeTab === 'performance' && metrics && (
          <PerformanceDashboard metrics={metrics} signals={signals} />
        )}
        
        {activeTab === 'strategies' && (
          <StrategyPanel />
        )}
      </main>
    </div>
  );
};

export default TradingDashboard;