export interface Streamer {
  streamerId: string;
  farcasterId: string;
  tokenName: string;
  tokenAddress: string;
  createdAt: Date;
  displayName: string;
  avatar?: string;
  isVerified?: boolean;
}

export interface Prediction {
  predictionId: string;
  streamerId: string;
  prompt: string;
  options: PredictionOption[];
  startTime: Date;
  endTime: Date;
  outcome?: string;
  resolved: boolean;
  createdAt: Date;
  totalWagers: number;
  streamer?: Streamer;
}

export interface PredictionOption {
  id: string;
  text: string;
  odds: number;
  totalAmount: number;
  wagerCount: number;
}

export interface Wager {
  wagerId: string;
  predictionId: string;
  userId: string;
  predictionOption: string;
  amount: number;
  txHash: string;
  createdAt: Date;
  prediction?: Prediction;
  user?: User;
}

export interface User {
  userId: string;
  farcasterId: string;
  walletAddress: string;
  createdAt: Date;
  displayName?: string;
  avatar?: string;
}

export interface StreamStats {
  streamerId: string;
  timestamp: Date;
  viewers: number;
  chatMessages: number;
  gameGenre: string;
  streamer?: Streamer;
}

export interface AIInsight {
  predictionId: string;
  confidence: number;
  reasoning: string;
  suggestedOption: string;
  type: 'positive' | 'neutral' | 'negative';
}

export type PredictionStatus = 'active' | 'resolved' | 'expired';
export type WagerStatus = 'pending' | 'confirmed' | 'won' | 'lost';
