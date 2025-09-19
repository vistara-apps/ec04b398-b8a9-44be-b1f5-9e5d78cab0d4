'use client';

import { Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../lib/utils';
import type { AIInsight } from '../lib/types';

interface AIInsightBubbleProps {
  insight: AIInsight;
}

export function AIInsightBubble({ insight }: AIInsightBubbleProps) {
  const getIcon = () => {
    switch (insight.type) {
      case 'positive':
        return <TrendingUp className="w-4 h-4" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getColorClasses = () => {
    switch (insight.type) {
      case 'positive':
        return 'bg-success/10 border-success/20 text-success';
      case 'negative':
        return 'bg-error/10 border-error/20 text-error';
      default:
        return 'bg-accent/10 border-accent/20 text-accent';
    }
  };

  return (
    <div className={cn(
      'flex items-start space-x-3 p-3 rounded-md border',
      getColorClasses()
    )}>
      <div className="flex items-center space-x-1 mt-0.5">
        <Brain className="w-4 h-4" />
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium">AI Insight</p>
          <span className="text-xs opacity-75">{insight.confidence}% confidence</span>
        </div>
        <p className="text-xs opacity-90">{insight.reasoning}</p>
      </div>
    </div>
  );
}
