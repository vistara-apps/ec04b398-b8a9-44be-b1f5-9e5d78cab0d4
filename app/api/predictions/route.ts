import { NextRequest, NextResponse } from 'next/server';
import { generateMockPredictions } from '../../../lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const streamerId = searchParams.get('streamerId');
    const status = searchParams.get('status'); // 'active', 'resolved', 'all'

    let predictions = generateMockPredictions();

    // Filter by streamer
    if (streamerId) {
      predictions = predictions.filter(p => p.streamerId === streamerId);
    }

    // Filter by status
    if (status) {
      if (status === 'active') {
        predictions = predictions.filter(p => !p.resolved && new Date() < p.endTime);
      } else if (status === 'resolved') {
        predictions = predictions.filter(p => p.resolved);
      }
    }

    return NextResponse.json({
      success: true,
      data: predictions,
    });
  } catch (error) {
    console.error('Predictions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, options, duration, streamerId } = body;

    // Validate input
    if (!prompt || !options || !duration || !streamerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (options.length < 2 || options.length > 10) {
      return NextResponse.json(
        { error: 'Must have 2-10 options' },
        { status: 400 }
      );
    }

    if (duration < 60 || duration > 604800) { // 1 minute to 1 week
      return NextResponse.json(
        { error: 'Duration must be between 1 minute and 1 week' },
        { status: 400 }
      );
    }

    // In a real app, this would create the prediction on-chain
    const newPrediction = {
      predictionId: Date.now(), // Mock ID
      streamerId,
      prompt,
      options: options.map((option: string, index: number) => ({
        id: `option-${index}`,
        text: option,
        odds: 2.0, // Default odds
        totalAmount: 0,
        wagerCount: 0,
      })),
      startTime: new Date(),
      endTime: new Date(Date.now() + duration * 1000),
      resolved: false,
      createdAt: new Date(),
      totalWagers: 0,
    };

    return NextResponse.json({
      success: true,
      data: newPrediction,
    });
  } catch (error) {
    console.error('Create prediction API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

