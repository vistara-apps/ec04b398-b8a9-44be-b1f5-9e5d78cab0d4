'use client';

import { formatCurrency } from '../lib/utils';
import { cn } from '../lib/utils';
import type { PredictionOption } from '../lib/types';

interface PredictionOptionButtonProps {
  option: PredictionOption;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export function PredictionOptionButton({
  option,
  isSelected,
  isDisabled,
  onClick
}: PredictionOptionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'prediction-option w-full text-left',
        isSelected && 'prediction-option-selected',
        isDisabled && 'prediction-option-disabled'
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{option.text}</p>
          <p className="text-sm text-text-muted">
            {option.wagerCount} bets • {formatCurrency(option.totalAmount)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{option.odds.toFixed(2)}x</p>
          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${Math.min(100, (option.totalAmount / 5000) * 100)}%`
              }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
