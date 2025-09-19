'use client';

import { formatNumber, formatCurrency, formatPercentage } from '../lib/utils';
import { TrendingUp, TrendingDown, Star, Users } from 'lucide-react';
import { cn } from '../lib/utils';

interface StreamerCardProps {
  streamer: {
    streamerId: string;
    displayName: string;
    tokenName: string;
    avatar: string;
    isVerified: boolean;
    currentViewers: number;
    chatActivity: number;
    gameGenre: string;
  };
  isSelected?: boolean;
  onClick?: () => void;
}

export function StreamerCard({ streamer, isSelected, onClick }: StreamerCardProps) {
  const marketValue = Math.floor(Math.random() * 1000) + 500;
  const change = (Math.random() - 0.5) * 20;
  const isPositive = change > 0;

  return (
    <div
      className={cn(
        'card cursor-pointer transition-all duration-200 hover:shadow-lg',
        isSelected && 'ring-2 ring-primary'
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={streamer.avatar}
            alt={streamer.displayName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="flex items-center space-x-1">
              <h3 className="font-semibold text-text-primary">{streamer.displayName}</h3>
              {streamer.isVerified && (
                <Star className="w-3 h-3 text-accent fill-current" />
              )}
            </div>
            <p className="text-xs text-text-muted">{streamer.tokenName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-text-primary">
            {formatCurrency(marketValue)}
          </p>
          <div className={cn(
            'flex items-center space-x-1 text-xs',
            isPositive ? 'text-success' : 'text-error'
          )}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{formatPercentage(Math.abs(change))}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-text-muted">Viewers</p>
          <p className="text-sm font-medium text-text-primary">
            {formatNumber(streamer.currentViewers)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Chat/hr</p>
          <p className="text-sm font-medium text-text-primary">
            {formatNumber(streamer.chatActivity)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Game</p>
          <p className="text-xs font-medium text-text-primary truncate">
            {streamer.gameGenre}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">Live Status</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-success">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
