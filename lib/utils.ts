import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatCurrency(amount: number, symbol: string = '$'): string {
  return `${symbol}${amount.toLocaleString()}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatTimeRemaining(endTime: Date): string {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();
  
  if (diff <= 0) return 'Ended';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function calculateOdds(totalAmount: number, optionAmount: number): number {
  if (optionAmount === 0) return 2.0;
  return Math.max(1.1, totalAmount / optionAmount);
}

export function generateMockPredictions() {
  return [
    {
      predictionId: '1',
      streamerId: '1',
      prompt: 'Will Ninja reach 50K viewers today?',
      options: [
        { id: '1a', text: 'Yes', odds: 1.8, totalAmount: 2500, wagerCount: 45 },
        { id: '1b', text: 'No', odds: 2.2, totalAmount: 2000, wagerCount: 32 }
      ],
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
      resolved: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      totalWagers: 4500
    },
    {
      predictionId: '2',
      streamerId: '2',
      prompt: 'Will xQc play Valorant for more than 3 hours?',
      options: [
        { id: '2a', text: 'Yes', odds: 1.5, totalAmount: 3200, wagerCount: 67 },
        { id: '2b', text: 'No', odds: 2.8, totalAmount: 1800, wagerCount: 28 }
      ],
      startTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
      resolved: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      totalWagers: 5000
    },
    {
      predictionId: '3',
      streamerId: '3',
      prompt: 'Will Pokimane have over 1000 chat messages per hour?',
      options: [
        { id: '3a', text: 'Yes', odds: 2.1, totalAmount: 1500, wagerCount: 23 },
        { id: '3b', text: 'No', odds: 1.9, totalAmount: 1700, wagerCount: 31 }
      ],
      startTime: new Date(Date.now() - 30 * 60 * 1000),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      resolved: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      totalWagers: 3200
    }
  ];
}

export function generateMockStreamStats() {
  const now = new Date();
  const stats = [];
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    stats.push({
      timestamp,
      viewers: Math.floor(Math.random() * 20000) + 30000,
      chatMessages: Math.floor(Math.random() * 1000) + 500,
      gameGenre: 'Fortnite'
    });
  }
  
  return stats;
}
