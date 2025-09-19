'use client';

import { useState } from 'react';
import { formatTimeRemaining, formatCurrency } from '../lib/utils';
import { Clock, Users, TrendingUp, Zap } from 'lucide-react';
import { PredictionOptionButton } from './PredictionOptionButton';
import { AIInsightBubble } from './AIInsightBubble';
import { MOCK_STREAMERS } from '../lib/constants';
import type { Prediction } from '../lib/types';

interface PredictionCardProps {
  prediction: Prediction;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [wagerAmount, setWagerAmount] = useState<string>('');
  const [isPlacingWager, setIsPlacingWager] = useState(false);

  const streamer = MOCK_STREAMERS.find(s => s.streamerId === prediction.streamerId);
  const timeRemaining = formatTimeRemaining(prediction.endTime);
  const isExpired = new Date() > prediction.endTime;

  const handlePlaceWager = async () => {
    if (!selectedOption || !wagerAmount || isPlacingWager) return;

    setIsPlacingWager(true);
    
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsPlacingWager(false);
    setSelectedOption(null);
    setWagerAmount('');
    
    // Show success message (in a real app, this would be a toast)
    alert('Wager placed successfully!');
  };

  const mockAIInsight = {
    predictionId: prediction.predictionId,
    confidence: 75,
    reasoning: 'Based on historical data and current trends',
    suggestedOption: prediction.options[0].id,
    type: 'positive' as const
  };

  return (
    <div className="card space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {streamer && (
            <img
              src={streamer.avatar}
              alt={streamer.displayName}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div>
            <h3 className="font-semibold text-text-primary">{prediction.prompt}</h3>
            <p className="text-sm text-text-muted">
              {streamer?.displayName} • {streamer?.tokenName}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-sm text-text-muted">
            <Clock className="w-4 h-4" />
            <span>{timeRemaining}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-text-muted">
            <Users className="w-4 h-4" />
            <span>{prediction.options.reduce((sum, opt) => sum + opt.wagerCount, 0)} bets</span>
          </div>
          <div className="flex items-center space-x-1 text-text-muted">
            <TrendingUp className="w-4 h-4" />
            <span>{formatCurrency(prediction.totalWagers)} total</span>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <AIInsightBubble insight={mockAIInsight} />

      {/* Options */}
      <div className="space-y-2">
        {prediction.options.map((option) => (
          <PredictionOptionButton
            key={option.id}
            option={option}
            isSelected={selectedOption === option.id}
            isDisabled={isExpired || prediction.resolved}
            onClick={() => setSelectedOption(option.id)}
          />
        ))}
      </div>

      {/* Wager Input */}
      {selectedOption && !isExpired && !prediction.resolved && (
        <div className="space-y-3 pt-3 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Wager amount"
                value={wagerAmount}
                onChange={(e) => setWagerAmount(e.target.value)}
                className="input w-full"
                min="1"
                max="10000"
              />
            </div>
            <button
              onClick={handlePlaceWager}
              disabled={!wagerAmount || isPlacingWager}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlacingWager ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span>{isPlacingWager ? 'Placing...' : 'Place Wager'}</span>
            </button>
          </div>
          <p className="text-xs text-text-muted">
            Potential payout: {wagerAmount ? formatCurrency(
              parseFloat(wagerAmount) * (prediction.options.find(o => o.id === selectedOption)?.odds || 1)
            ) : '$0'}
          </p>
        </div>
      )}

      {/* Status */}
      {(isExpired || prediction.resolved) && (
        <div className="text-center py-2 bg-surface-light rounded-md">
          <p className="text-sm text-text-muted">
            {prediction.resolved ? 'Resolved' : 'Expired'}
          </p>
        </div>
      )}
    </div>
  );
}
