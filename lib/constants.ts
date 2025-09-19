export const MOCK_STREAMERS: Array<{
  streamerId: string;
  farcasterId: string;
  displayName: string;
  tokenName: string;
  tokenAddress: string;
  avatar: string;
  isVerified: boolean;
  currentViewers: number;
  chatActivity: number;
  gameGenre: string;
}> = [
  {
    streamerId: '1',
    farcasterId: 'ninja',
    displayName: 'Ninja',
    tokenName: 'NINJA',
    tokenAddress: '0x1234...5678',
    avatar: 'https://via.placeholder.com/40/6366f1/ffffff?text=N',
    isVerified: true,
    currentViewers: 45000,
    chatActivity: 1250,
    gameGenre: 'Fortnite'
  },
  {
    streamerId: '2',
    farcasterId: 'xqc',
    displayName: 'xQc',
    tokenName: 'XQC',
    tokenAddress: '0x2345...6789',
    avatar: 'https://via.placeholder.com/40/06b6d4/ffffff?text=X',
    isVerified: true,
    currentViewers: 38000,
    chatActivity: 2100,
    gameGenre: 'Valorant'
  },
  {
    streamerId: '3',
    farcasterId: 'pokimane',
    displayName: 'Pokimane',
    tokenName: 'POKI',
    tokenAddress: '0x3456...7890',
    avatar: 'https://via.placeholder.com/40/ec4899/ffffff?text=P',
    isVerified: true,
    currentViewers: 28000,
    chatActivity: 890,
    gameGenre: 'Just Chatting'
  }
];

export const PREDICTION_CATEGORIES = [
  'Viewer Count',
  'Game Performance',
  'Stream Duration',
  'Chat Activity',
  'Special Events'
] as const;

export const GAME_GENRES = [
  'Fortnite',
  'Valorant',
  'League of Legends',
  'Just Chatting',
  'Minecraft',
  'Call of Duty',
  'Apex Legends',
  'Other'
] as const;

export const TOKEN_DECIMALS = 18;
export const MIN_WAGER_AMOUNT = 1;
export const MAX_WAGER_AMOUNT = 10000;

export const CHART_COLORS = {
  primary: 'hsl(240, 80%, 55%)',
  accent: 'hsl(172, 70%, 50%)',
  success: 'hsl(142, 76%, 36%)',
  warning: 'hsl(38, 92%, 50%)',
  error: 'hsl(0, 84%, 60%)',
};
