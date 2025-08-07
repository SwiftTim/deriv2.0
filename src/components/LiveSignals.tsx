import React from 'react';
import { TrendingUp, TrendingDown, Minus, Clock, Target, Activity } from 'lucide-react';
import { Signal, MarketData } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface LiveSignalsProps {
  signals: Signal[];
  marketData: MarketData[];
}

const LiveSignals: React.FC<LiveSignalsProps> = ({ signals, marketData }) => {
  const latestPrice = marketData[marketData.length - 1]?.close || 0;

  const getSignalIcon = (direction: string) => {
    switch (direction) {
      case 'buy':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'sell':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPositionSizeColor = (size: string) => {
    switch (size) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-yellow-600';
      case 'low':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">EUR/USD</p>
              <p className="text-2xl font-mono font-bold text-white">
                {latestPrice.toFixed(5)}
              </p>
            </div>
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Signals</p>
              <p className="text-2xl font-bold text-green-400">{signals.length}</p>
            </div>
            <Target className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Win Rate</p>
              <p className="text-2xl font-bold text-blue-400">72.3%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Confidence</p>
              <p className="text-2xl font-bold text-yellow-400">
                {signals.length > 0 
                  ? (signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length).toFixed(1)
                  : '0'
                }%
              </p>
            </div>
            <Activity className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Signals List */}
      <div className="bg-gray-800 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Recent Signals</h2>
        </div>
        
        <div className="divide-y divide-gray-700">
          {signals.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p>Waiting for signals...</p>
              <p className="text-sm mt-2">AI models are analyzing market data</p>
            </div>
          ) : (
            signals.map((signal) => (
              <div key={signal.id} className="p-6 hover:bg-gray-750 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      {getSignalIcon(signal.direction)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{signal.asset}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          signal.direction === 'buy' 
                            ? 'bg-green-600 text-green-100'
                            : signal.direction === 'sell'
                            ? 'bg-red-600 text-red-100' 
                            : 'bg-gray-600 text-gray-100'
                        }`}>
                          {signal.direction.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPositionSizeColor(signal.positionSize)} text-white`}>
                          {signal.positionSize.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-400">
                        Model: {signal.modelType} • Version: {signal.modelVersion}
                      </p>
                      
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(signal.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className={`text-lg font-bold ${getConfidenceColor(signal.confidence)}`}>
                      {signal.confidence.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">
                      R/R: {signal.riskRatio.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Expected: +{(signal.predictedReward * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveSignals;