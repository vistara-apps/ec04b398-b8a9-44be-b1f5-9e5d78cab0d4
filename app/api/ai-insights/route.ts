import { NextRequest, NextResponse } from 'next/server';
import { generateMockPredictions, generateMockStreamStats } from '../../../lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const predictionId = searchParams.get('predictionId');

    if (!predictionId) {
      return NextResponse.json(
        { error: 'Prediction ID is required' },
        { status: 400 }
      );
    }

    const predictions = generateMockPredictions();
    const prediction = predictions.find(p => p.predictionId.toString() === predictionId);

    if (!prediction) {
      return NextResponse.json(
        { error: 'Prediction not found' },
        { status: 404 }
      );
    }

    // Generate AI insights based on prediction data
    const insights = generateAIInsights(prediction);

    return NextResponse.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error('AI Insights API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateAIInsights(prediction: any) {
  const streamStats = generateMockStreamStats();
  const recentStats = streamStats.slice(-24); // Last 24 hours

  // Calculate trends
  const avgViewers = recentStats.reduce((sum, stat) => sum + stat.viewers, 0) / recentStats.length;
  const avgChat = recentStats.reduce((sum, stat) => sum + stat.chatMessages, 0) / recentStats.length;

  // Analyze prediction options
  const totalPool = prediction.totalWagers;
  const optionAnalysis = prediction.options.map(option => ({
    optionId: option.id,
    probability: totalPool > 0 ? (option.totalAmount / totalPool) * 100 : (100 / prediction.options.length),
    momentum: Math.random() * 20 - 10, // Mock momentum score
  }));

  // Determine recommended option
  const recommendedOption = optionAnalysis.reduce((best, current) =>
    current.probability > best.probability ? current : best
  );

  // Generate reasoning based on data
  let reasoning = '';
  if (avgViewers > 30000) {
    reasoning += 'High viewer count suggests strong community engagement. ';
  }
  if (avgChat > 800) {
    reasoning += 'Active chat indicates high participation levels. ';
  }
  reasoning += `Market analysis shows ${recommendedOption.optionId} has the highest probability at ${recommendedOption.probability.toFixed(1)}%.`;

  return {
    predictionId: prediction.predictionId,
    confidence: Math.min(95, Math.max(60, recommendedOption.probability + Math.random() * 20)),
    reasoning,
    recommendedOption: recommendedOption.optionId,
    analysis: {
      marketSentiment: optionAnalysis,
      streamerMetrics: {
        avgViewers: Math.round(avgViewers),
        avgChatActivity: Math.round(avgChat),
        trendDirection: avgViewers > 25000 ? 'upward' : 'stable',
      },
      riskFactors: [
        'Market volatility',
        'Streamer schedule changes',
        'External events impact',
      ],
      confidenceFactors: [
        'Historical performance data',
        'Real-time metrics analysis',
        'Community sentiment tracking',
      ],
    },
    generatedAt: new Date(),
  };
}

