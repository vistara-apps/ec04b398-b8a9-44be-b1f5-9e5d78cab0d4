import { StreamerDashboard } from '../components/StreamerDashboard';
import { PredictionMarkets } from '../components/PredictionMarkets';
import { StreamAnalytics } from '../components/StreamAnalytics';
import { Header } from '../components/Header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            StreamPredict
          </h1>
          <p className="text-xl text-text-secondary">
            Real-time Prediction Markets
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <StreamerDashboard />
            <PredictionMarkets />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <StreamAnalytics />
          </div>
        </div>
      </main>
    </div>
  );
}
