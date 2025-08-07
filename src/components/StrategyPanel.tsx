import React, { useState } from 'react';
import { Settings, Play, Pause, RotateCcw, TrendingUp, Brain, Zap } from 'lucide-react';

const StrategyPanel: React.FC = () => {
  const [strategies, setStrategies] = useState([
    {
      id: 'lstm-primary',
      name: 'LSTM Primary',
      type: 'AI',
      status: 'active',
      confidence: 74.2,
      trades: 45,
      winRate: 68.9,
      pnl: 1247.65
    },
    {
      id: 'transformer-secondary',
      name: 'Transformer Secondary',
      type: 'AI',
      status: 'active',
      confidence: 71.8,
      trades: 38,
      winRate: 73.7,
      pnl: 982.34
    },
    {
      id: 'q-learning',
      name: 'Q-Learning Agent',
      type: 'RL',
      status: 'active',
      confidence: 69.5,
      trades: 52,
      winRate: 65.4,
      pnl: 617.98
    },
    {
      id: 'manual-rules',
      name: 'Manual RSI+MACD',
      type: 'Manual',
      status: 'paused',
      confidence: 62.1,
      trades: 28,
      winRate: 64.3,
      pnl: -123.45
    }
  ]);

  const toggleStrategy = (id: string) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === id 
        ? { ...strategy, status: strategy.status === 'active' ? 'paused' : 'active' }
        : strategy
    ));
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? 
      <Play className="w-4 h-4 text-green-400" /> : 
      <Pause className="w-4 h-4 text-gray-400" />;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'AI':
        return <Brain className="w-5 h-5 text-blue-400" />;
      case 'RL':
        return <Zap className="w-5 h-5 text-purple-400" />;
      default:
        return <Settings className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Strategy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Strategies</p>
              <p className="text-2xl font-bold text-green-400">
                {strategies.filter(s => s.status === 'active').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Confidence</p>
              <p className="text-2xl font-bold text-blue-400">
                {(strategies.reduce((sum, s) => sum + s.confidence, 0) / strategies.length).toFixed(1)}%
              </p>
            </div>
            <Brain className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Trades</p>
              <p className="text-2xl font-bold text-yellow-400">
                {strategies.reduce((sum, s) => sum + s.trades, 0)}
              </p>
            </div>
            <Settings className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Combined P&L</p>
              <p className="text-2xl font-bold text-green-400">
                ${strategies.reduce((sum, s) => sum + s.pnl, 0).toFixed(2)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Strategy List */}
      <div className="bg-gray-800 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Strategy Management</h2>
        </div>
        
        <div className="divide-y divide-gray-700">
          {strategies.map((strategy) => (
            <div key={strategy.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    {getTypeIcon(strategy.type)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-white">{strategy.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        strategy.type === 'AI' ? 'bg-blue-600 text-blue-100' :
                        strategy.type === 'RL' ? 'bg-purple-600 text-purple-100' :
                        'bg-gray-600 text-gray-100'
                      }`}>
                        {strategy.type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        strategy.status === 'active' 
                          ? 'bg-green-600 text-green-100'
                          : 'bg-gray-600 text-gray-100'
                      }`}>
                        {strategy.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-6 text-sm">
                      <div>
                        <span className="text-gray-400">Confidence:</span>
                        <span className="text-white ml-2 font-mono">{strategy.confidence.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Trades:</span>
                        <span className="text-white ml-2 font-mono">{strategy.trades}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Win Rate:</span>
                        <span className="text-white ml-2 font-mono">{strategy.winRate.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">P&L:</span>
                        <span className={`ml-2 font-mono ${strategy.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${strategy.pnl.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleStrategy(strategy.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      strategy.status === 'active'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {getStatusIcon(strategy.status === 'active' ? 'paused' : 'active')}
                    <span>{strategy.status === 'active' ? 'Pause' : 'Start'}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-white transition-colors">
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Risk Management</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Max Position Size (%)
              </label>
              <input 
                type="range" 
                min="0.1" 
                max="5.0" 
                step="0.1" 
                defaultValue="2.0"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.1%</span>
                <span>5.0%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Stop Loss (%)
              </label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="0.5" 
                defaultValue="3"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span>10%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Take Profit (%)
              </label>
              <input 
                type="range" 
                min="1" 
                max="15" 
                step="0.5" 
                defaultValue="6"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span>15%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Signal Filters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Minimum Confidence (%)
              </label>
              <input 
                type="range" 
                min="50" 
                max="95" 
                step="1" 
                defaultValue="65"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50%</span>
                <span>95%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Min Risk/Reward Ratio
              </label>
              <input 
                type="range" 
                min="1.0" 
                max="5.0" 
                step="0.1" 
                defaultValue="1.5"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1.0</span>
                <span>5.0</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-400">Enable News Filter</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-400">Market Hours Only</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyPanel;