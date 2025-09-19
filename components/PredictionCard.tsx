'use client';

import { useState, useEffect } from 'react';
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

    try {
      const response = await fetch('/api/wagers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          predictionId: prediction.predictionId,
          optionId: selectedOption,
          amount: parseFloat(wagerAmount),
          userAddress: '0x1234567890123456789012345678901234567890', // Mock address
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Show success message
        alert(`Wager placed successfully! TX: ${data.data.txHash}`);
        setSelectedOption(null);
        setWagerAmount('');
        // In a real app, you'd refresh the prediction data here
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Wager error:', error);
      alert('Failed to place wager. Please try again.');
    } finally {
      setIsPlacingWager(false);
    }
  };

  const [aiInsight, setAiInsight] = useState<any>(null);
  const [loadingInsight, setLoadingInsight] = useState(true);

  useEffect(() => {
    const fetchAIInsight = async () => {
      try {
        const response = await fetch(`/api/ai-insights?predictionId=${prediction.predictionId}`);
        const data = await response.json();
        if (data.success) {
          setAiInsight({
            predictionId: data.data.predictionId,
            confidence: data.data.confidence,
            reasoning: data.data.reasoning,
            suggestedOption: data.data.recommendedOption,
            type: data.data.confidence > 80 ? 'positive' : data.data.confidence > 60 ? 'neutral' : 'negative',
          });
        }
      } catch (error) {
        console.error('Failed to fetch AI insight:', error);
      } finally {
        setLoadingInsight(false);
      }
    };

    fetchAIInsight();
  }, [prediction.predictionId]);

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
      {loadingInsight ? (
        <div className="flex items-center space-x-3 p-3 rounded-md border border-accent/20 bg-accent/10">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-accent">Analyzing prediction data...</span>
        </div>
      ) : aiInsight ? (
        <AIInsightBubble insight={aiInsight} />
      ) : null}

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
