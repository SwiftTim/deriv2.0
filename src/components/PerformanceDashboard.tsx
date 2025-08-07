import React from 'react';
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3, Activity } from 'lucide-react';
import { PerformanceMetrics, Signal } from '../types';

interface PerformanceDashboardProps {
  metrics: PerformanceMetrics;
  signals: Signal[];
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ metrics, signals }) => {
  const getMetricColor = (value: number, good: number, bad: number) => {
    if (value >= good) return 'text-green-400';
    if (value <= bad) return 'text-red-400';
    return 'text-yellow-400';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Total P&L</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-2">
            <p className={`text-2xl font-bold ${metrics.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(metrics.totalPnL)}
            </p>
            <p className="text-sm text-gray-400">{metrics.totalTrades} trades</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Win Rate</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-2">
            <p className={`text-2xl font-bold ${getMetricColor(metrics.winRate, 60, 40)}`}>
              {metrics.winRate.toFixed(1)}%
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${metrics.winRate >= 60 ? 'bg-green-400' : metrics.winRate >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
                style={{ width: `${Math.min(metrics.winRate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Sharpe Ratio</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-2">
            <p className={`text-2xl font-bold ${getMetricColor(metrics.sharpeRatio, 1.5, 0.5)}`}>
              {metrics.sharpeRatio.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400">Risk-adjusted return</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Max Drawdown</h3>
            <TrendingDown className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-2">
            <p className={`text-2xl font-bold ${getMetricColor(-metrics.maxDrawdown, -5, -20)}`}>
              -{metrics.maxDrawdown.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-400">Maximum loss period</p>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Trading Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Profit Factor</span>
              <span className={`font-semibold ${getMetricColor(metrics.profitFactor, 2, 1)}`}>
                {metrics.profitFactor.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Expectancy</span>
              <span className={`font-semibold ${metrics.expectancy >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(metrics.expectancy)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Win</span>
              <span className="font-semibold text-green-400">
                {formatCurrency(metrics.avgWin)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Loss</span>
              <span className="font-semibold text-red-400">
                {formatCurrency(-metrics.avgLoss)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Accuracy</span>
              <span className={`font-semibold ${getMetricColor(metrics.accuracy, 65, 50)}`}>
                {metrics.accuracy.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Signal Distribution</h3>
          <div className="space-y-4">
            {['buy', 'sell', 'hold'].map(direction => {
              const count = signals.filter(s => s.direction === direction).length;
              const percentage = signals.length > 0 ? (count / signals.length) * 100 : 0;
              
              return (
                <div key={direction} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 capitalize flex items-center">
                      {direction === 'buy' && <TrendingUp className="w-4 h-4 mr-2 text-green-400" />}
                      {direction === 'sell' && <TrendingDown className="w-4 h-4 mr-2 text-red-400" />}
                      {direction === 'hold' && <Activity className="w-4 h-4 mr-2 text-gray-400" />}
                      {direction}
                    </span>
                    <span className="font-semibold text-white">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        direction === 'buy' ? 'bg-green-400' : 
                        direction === 'sell' ? 'bg-red-400' : 'bg-gray-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Targets */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Performance Targets vs Actual</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Signal Accuracy</span>
              <span className="text-sm text-gray-500">Target: {'>'}65%</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${metrics.accuracy >= 65 ? 'bg-green-400' : 'bg-yellow-400'}`}
                  style={{ width: `${Math.min((metrics.accuracy / 65) * 100, 100)}%` }}
                />
              </div>
              <span className={`font-semibold ${metrics.accuracy >= 65 ? 'text-green-400' : 'text-yellow-400'}`}>
                {metrics.accuracy.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Sharpe Ratio</span>
              <span className="text-sm text-gray-500">Target: {'>'}1.5</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${metrics.sharpeRatio >= 1.5 ? 'bg-green-400' : 'bg-yellow-400'}`}
                  style={{ width: `${Math.min((metrics.sharpeRatio / 1.5) * 100, 100)}%` }}
                />
              </div>
              <span className={`font-semibold ${metrics.sharpeRatio >= 1.5 ? 'text-green-400' : 'text-yellow-400'}`}>
                {metrics.sharpeRatio.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Max Drawdown</span>
              <span className="text-sm text-gray-500">Target: {'<'}20%</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${metrics.maxDrawdown <= 20 ? 'bg-green-400' : 'bg-red-400'}`}
                  style={{ width: `${(metrics.maxDrawdown / 20) * 100}%` }}
                />
              </div>
              <span className={`font-semibold ${metrics.maxDrawdown <= 20 ? 'text-green-400' : 'text-red-400'}`}>
                {metrics.maxDrawdown.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;