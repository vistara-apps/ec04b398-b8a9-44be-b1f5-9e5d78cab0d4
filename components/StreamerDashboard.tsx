'use client';

import { useState } from 'react';
import { MOCK_STREAMERS } from '../lib/constants';
import { formatNumber, formatCurrency, formatPercentage } from '../lib/utils';
import { TrendingUp, TrendingDown, Users, MessageCircle, Gamepad2, Star } from 'lucide-react';
import { StreamerCard } from './StreamerCard';

export function StreamerDashboard() {
  const [selectedStreamer, setSelectedStreamer] = useState(MOCK_STREAMERS[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Stream Streamers</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-white text-sm">
            <option>Viewers</option>
            <option>Market Value</option>
            <option>Activity</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_STREAMERS.map((streamer) => (
          <StreamerCard
            key={streamer.streamerId}
            streamer={streamer}
            isSelected={selectedStreamer.streamerId === streamer.streamerId}
            onClick={() => setSelectedStreamer(streamer)}
          />
        ))}
      </div>

      {/* Selected Streamer Details */}
      {selectedStreamer && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={selectedStreamer.avatar}
                alt={selectedStreamer.displayName}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-white">
                    {selectedStreamer.displayName}
                  </h3>
                  {selectedStreamer.isVerified && (
                    <Star className="w-4 h-4 text-green-400 fill-current" />
                  )}
                </div>
                <p className="text-gray-400 text-sm">@{selectedStreamer.farcasterId}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Token</p>
              <p className="font-semibold text-white">{selectedStreamer.tokenName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-900 rounded-md">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Viewers</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {formatNumber(selectedStreamer.currentViewers)}
              </p>
            </div>

            <div className="text-center p-3 bg-gray-900 rounded-md">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <MessageCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Chat/hr</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {formatNumber(selectedStreamer.chatActivity)}
              </p>
            </div>

            <div className="text-center p-3 bg-gray-900 rounded-md">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Gamepad2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-400">Game</span>
              </div>
              <p className="text-sm font-medium text-white">
                {selectedStreamer.gameGenre}
              </p>
            </div>

            <div className="text-center p-3 bg-gray-900 rounded-md">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Growth</span>
              </div>
              <p className="text-lg font-semibold text-green-400">+12.5%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
