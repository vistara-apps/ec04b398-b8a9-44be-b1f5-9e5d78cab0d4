'use client';

import { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Prediction } from '../lib/types';

interface AIInsightsProps {
  prediction: Prediction;
}

export function AIInsights({ prediction }: AIInsightsProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    const generateInsights = async () => {
      setLoading(true);

      // Mock AI analysis based on prediction data
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockInsights = {
        confidence: Math.random() * 100,
        reasoning: generateMockReasoning(prediction),
        suggestedOption: prediction.options[Math.floor(Math.random() * prediction.options.length)],
        type: Math.random() > 0.5 ? 'positive' : 'neutral',
        factors: [
          { name: 'Historical Performance', impact: Math.random() * 20 - 10 },
          { name: 'Current Trends', impact: Math.random() * 20 - 10 },
          { name: 'Market Sentiment', impact: Math.random() * 20 - 10 },
          { name: 'Streamer Activity', impact: Math.random() * 20 - 10 },
        ],
      };

      setInsights(mockInsights);
      setLoading(false);
    };

    generateInsights();
  }, [prediction]);

  const generateMockReasoning = (prediction: Prediction) => {
    const streamerName = prediction.streamer?.displayName || 'the streamer';
    const reasons = [
      `Based on ${streamerName}'s recent performance metrics and historical data, this prediction shows strong indicators.`,
      `Current market trends and chat activity suggest this outcome is likely.`,
      `Statistical analysis of similar predictions indicates a favorable probability.`,
      `Real-time data analysis points to this being the most probable result.`,
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-accent animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">AI Analysis</h3>
            <p className="text-sm text-text-muted">Analyzing prediction data...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-surface-light rounded w-3/4"></div>
          <div className="h-4 bg-surface-light rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  const getInsightIcon = () => {
    switch (insights.type) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-error" />;
      default:
        return <Minus className="w-4 h-4 text-warning" />;
    }
  };

  const getInsightColor = () => {
    switch (insights.type) {
      case 'positive':
        return 'bg-success/20 text-success border-success/30';
      case 'negative':
        return 'bg-error/20 text-error border-error/30';
      default:
        return 'bg-warning/20 text-warning border-warning/30';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
          <Brain className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">AI Prediction Insights</h3>
          <p className="text-sm text-text-muted">Powered by advanced analytics</p>
        </div>
      </div>

      <div className={`p-4 rounded-lg border mb-4 ${getInsightColor()}`}>
        <div className="flex items-center space-x-2 mb-2">
          {getInsightIcon()}
          <span className="font-medium">Suggested: {insights.suggestedOption}</span>
          <span className="text-sm opacity-75">({insights.confidence.toFixed(1)}% confidence)</span>
        </div>
        <p className="text-sm opacity-90">{insights.reasoning}</p>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-text-primary">Key Factors</h4>
        {insights.factors.map((factor: any, index: number) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">{factor.name}</span>
            <div className="flex items-center space-x-2">
              <div className={`w-16 h-2 rounded-full ${
                factor.impact > 0 ? 'bg-success/30' : 'bg-error/30'
              }`}>
                <div
                  className={`h-full rounded-full ${
                    factor.impact > 0 ? 'bg-success' : 'bg-error'
                  }`}
                  style={{ width: `${Math.abs(factor.impact) * 2}%` }}
                ></div>
              </div>
              <span className={`text-xs font-medium ${
                factor.impact > 0 ? 'text-success' : 'text-error'
              }`}>
                {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-surface-light rounded-md">
        <p className="text-xs text-text-muted">
          AI insights are for informational purposes only. Always do your own research before placing wagers.
        </p>
      </div>
    </div>
  );
}

