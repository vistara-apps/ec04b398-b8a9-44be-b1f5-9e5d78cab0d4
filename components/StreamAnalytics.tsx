'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { generateMockStreamStats } from '../lib/utils';
import { TrendingUp, Users, MessageCircle, Clock } from 'lucide-react';

export function StreamAnalytics() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [selectedMetric, setSelectedMetric] = useState<'viewers' | 'chatMessages'>('viewers');
  
  const streamStats = generateMockStreamStats();
  
  const chartData = streamStats.map(stat => ({
    time: stat.timestamp.getHours(),
    viewers: stat.viewers,
    chatMessages: stat.chatMessages,
  }));

  const currentStats = streamStats[streamStats.length - 1];
  const previousStats = streamStats[streamStats.length - 2];
  
  const viewerChange = currentStats ? 
    ((currentStats.viewers - (previousStats?.viewers || currentStats.viewers)) / (previousStats?.viewers || 1)) * 100 : 0;
  
  const chatChange = currentStats ?
    ((currentStats.chatMessages - (previousStats?.chatMessages || currentStats.chatMessages)) / (previousStats?.chatMessages || 1)) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Stream Analytics</h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-white text-sm"
          >
            <option value="24h">24 Hours</option>
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-900 rounded-md">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Peak Viewers</span>
            </div>
            <p className="text-xl font-bold text-white">
              {Math.max(...chartData.map(d => d.viewers)).toLocaleString()}
            </p>
            <p className={`text-xs ${viewerChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {viewerChange >= 0 ? '+' : ''}{viewerChange.toFixed(1)}%
            </p>
          </div>

          <div className="text-center p-3 bg-gray-900 rounded-md">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <MessageCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Chat Activity</span>
            </div>
            <p className="text-xl font-bold text-white">
              {Math.max(...chartData.map(d => d.chatMessages)).toLocaleString()}
            </p>
            <p className={`text-xs ${chatChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {chatChange >= 0 ? '+' : ''}{chatChange.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setSelectedMetric('viewers')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              selectedMetric === 'viewers'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Viewers
          </button>
          <button
            onClick={() => setSelectedMetric('chatMessages')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              selectedMetric === 'chatMessages'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Chat Messages
          </button>
        </div>

        {/* Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(0, 0%, 50%)' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(0, 0%, 50%)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(230, 40%, 15%)',
                  border: '1px solid hsl(0, 0%, 30%)',
                  borderRadius: '8px',
                  color: 'hsl(0, 0%, 95%)'
                }}
              />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={selectedMetric === 'viewers' ? 'hsl(172, 70%, 50%)' : 'hsl(38, 92%, 50%)'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: selectedMetric === 'viewers' ? 'hsl(172, 70%, 50%)' : 'hsl(38, 92%, 50%)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Average Stream Duration</span>
            <span className="text-white font-medium">6.2 hours</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Most Played Game</span>
            <span className="text-white font-medium">Fortnite</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Peak Hour</span>
            <span className="text-white font-medium">8-9 PM</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Engagement Rate</span>
            <span className="text-green-400 font-medium">94.2%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
