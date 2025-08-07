import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MarketData, Signal } from '../types';
import { format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MarketChartProps {
  data: MarketData[];
  signals: Signal[];
}

const MarketChart: React.FC<MarketChartProps> = ({ data, signals }) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const chartData = {
    labels: data.map(d => format(d.timestamp, 'HH:mm')),
    datasets: [
      {
        label: 'EUR/USD',
        data: data.map(d => d.close),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: function(value: any) {
            return typeof value === 'number' ? value.toFixed(5) : value;
          },
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (chart && signals.length > 0) {
      // Add signal annotations
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      
      signals.forEach((signal) => {
        const signalTime = signal.timestamp;
        const dataIndex = data.findIndex(d => 
          Math.abs(d.timestamp.getTime() - signalTime.getTime()) < 60000
        );
        
        if (dataIndex >= 0 && dataIndex < data.length) {
          const x = chart.scales.x.getPixelForValue(dataIndex);
          const y = chart.scales.y.getPixelForValue(data[dataIndex].close);
          
          // Draw signal arrow
          ctx.save();
          ctx.fillStyle = signal.direction === 'buy' ? '#10B981' : '#EF4444';
          ctx.strokeStyle = signal.direction === 'buy' ? '#10B981' : '#EF4444';
          ctx.lineWidth = 2;
          
          const arrowSize = 8;
          const arrowY = signal.direction === 'buy' ? y + 15 : y - 15;
          
          ctx.beginPath();
          ctx.moveTo(x, arrowY);
          ctx.lineTo(x - arrowSize, arrowY + (signal.direction === 'buy' ? arrowSize : -arrowSize));
          ctx.lineTo(x + arrowSize, arrowY + (signal.direction === 'buy' ? arrowSize : -arrowSize));
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          
          ctx.restore();
        }
      });
    }
  }, [data, signals]);

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-white">EUR/USD - 1M Chart</h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-400">Buy Signals</span>
              <div className="w-3 h-3 bg-red-500 rounded-full ml-4"></div>
              <span className="text-sm text-red-400">Sell Signals</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-400">Current:</span>
              <span className="text-white font-mono ml-2">
                {data[data.length - 1]?.close.toFixed(5) || '0.00000'}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Change:</span>
              <span className={`font-mono ml-2 ${
                data.length > 1 && data[data.length - 1]?.close > data[data.length - 2]?.close
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {data.length > 1 
                  ? ((data[data.length - 1]?.close - data[data.length - 2]?.close) || 0).toFixed(5)
                  : '0.00000'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="h-96">
          <Line ref={chartRef} data={chartData} options={options} />
        </div>
      </div>

      {/* Technical Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-4">RSI (14)</h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-yellow-400">64.2</span>
            <span className="text-sm text-gray-400">Neutral</span>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-4">MACD</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">MACD:</span>
              <span className="text-green-400">0.0012</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Signal:</span>
              <span className="text-red-400">0.0008</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Bollinger Bands</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Upper:</span>
              <span className="text-gray-300">{(data[data.length - 1]?.close * 1.002 || 0).toFixed(5)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Lower:</span>
              <span className="text-gray-300">{(data[data.length - 1]?.close * 0.998 || 0).toFixed(5)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketChart;