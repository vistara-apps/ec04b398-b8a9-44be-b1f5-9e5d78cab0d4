# StreamPredict - Base Mini App

StreamPredict is a Base Mini App that allows streamers to create branded prediction markets for their fans to engage with, using the streamer's native token and offering AI-driven insights.

## Features

- **Streamer Prediction Hub**: Dedicated interface for streamers to create and manage prediction markets
- **Fan Prediction Interface**: Intuitive UI for fans to participate in predictions using streamer tokens
- **Performance Metrics Dashboard**: Real-time analytics and performance data
- **AI Prediction Insights**: AI-driven suggestions and probabilities for prediction outcomes

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (Ethereum L2)
- **Smart Contracts**: Solidity with OpenZeppelin
- **Wallet Integration**: MiniKit + OnchainKit
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Hardhat
- **Farcaster Integration**: Frames vNext

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd streampredict
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your OnchainKit API key and other required variables.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Your OnchainKit API key for Base integration
- `NEXT_PUBLIC_BASE_URL`: The base URL of your application (for frames)
- `NEXT_PUBLIC_BASE_RPC_URL`: Base RPC endpoint URL
- `NEXT_PUBLIC_STREAM_PREDICT_ADDRESS`: Deployed StreamPredict contract address
- `PRIVATE_KEY`: Private key for contract deployment (never commit!)
- `BASESCAN_API_KEY`: API key for contract verification on BaseScan

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (frames, OG images)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # App providers (MiniKit, OnchainKit)
├── components/            # React components
│   ├── Header.tsx         # App header with wallet connection
│   ├── StreamerDashboard.tsx  # Streamer management interface
│   ├── PredictionMarkets.tsx  # Prediction markets display
│   ├── StreamAnalytics.tsx    # Analytics dashboard
│   └── ...               # Other components
├── lib/                   # Utilities and types
│   ├── types.ts          # TypeScript type definitions
│   ├── constants.ts      # App constants and mock data
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Key Components

### StreamerDashboard
Displays available streamers with their stats and allows selection for detailed view.

### PredictionMarkets
Shows active prediction markets with options to place wagers and view AI insights.

### StreamAnalytics
Provides real-time analytics with charts showing viewer counts, chat activity, and other metrics.

### AI Insights
Displays AI-powered predictions and confidence levels to help users make informed decisions.

## Smart Contracts

The application uses two main smart contracts:

### StreamPredict.sol
- Manages prediction market creation and resolution
- Handles wager placement and token transfers
- Distributes winnings to successful predictors
- Built with OpenZeppelin for security

### StreamerToken.sol
- ERC20 token contract for streamer-specific tokens
- Minting and burning capabilities
- Standard token functionality with custom features

### Deployment
```bash
# Install Hardhat dependencies
npm install

# Deploy to Base Sepolia (testnet)
npx hardhat run scripts/deploy.js --network baseSepolia

# Deploy to Base Mainnet
npx hardhat run scripts/deploy.js --network base
```

## API Endpoints

### Farcaster Frames API
- `GET /api/frame`: Main frame handler with dynamic views
- `POST /api/frame`: Handles frame interactions and state management

### Prediction API
- `GET /api/predictions`: Fetch prediction markets with filtering
- `POST /api/predictions`: Create new prediction markets

### Wager API
- `POST /api/wagers`: Place wagers on prediction markets

### AI Insights API
- `GET /api/ai-insights`: Get AI-powered prediction analysis

### OG Image API
- `GET /api/og`: Generate dynamic Open Graph images

## Base Mini App Integration

This app is built as a Base Mini App with:
- MiniKit integration for Farcaster frames
- OnchainKit for Base blockchain interactions
- Proper frame metadata for social sharing
- Mobile-first responsive design
- Token-based wagering system

## Development

### Adding New Features

1. Define types in `lib/types.ts`
2. Add constants in `lib/constants.ts`
3. Create components in `components/`
4. Add utility functions in `lib/utils.ts`

### Styling Guidelines

- Use the defined color palette in `tailwind.config.js`
- Follow the component variants defined in `globals.css`
- Maintain mobile-first responsive design
- Use semantic class names

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

3. Update environment variables in production

4. Test frame functionality in Farcaster clients

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
