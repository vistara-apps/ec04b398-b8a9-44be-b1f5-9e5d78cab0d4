import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const view = searchParams.get('view') || 'home';

  // In a real app, you would generate an actual image using a library like @vercel/og
  // For now, we'll return a simple SVG
  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:hsl(230, 40%, 10%);stop-opacity:1" />
          <stop offset="100%" style="stop-color:hsl(230, 40%, 15%);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <text x="600" y="200" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="white">
        StreamPredict
      </text>
      <text x="600" y="280" font-family="Arial, sans-serif" font-size="36" text-anchor="middle" fill="hsl(0, 0%, 70%)">
        Wager on Streamer Performance
      </text>
      <text x="600" y="340" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="hsl(172, 70%, 50%)">
        Real-time Prediction Markets
      </text>
      ${view === 'predictions' ? `
        <rect x="100" y="400" width="1000" height="150" rx="12" fill="hsl(230, 40%, 15%)" stroke="hsl(0, 0%, 30%)" stroke-width="2"/>
        <text x="600" y="450" font-family="Arial, sans-serif" font-size="28" text-anchor="middle" fill="white">
          Active Predictions Available
        </text>
        <text x="600" y="490" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="hsl(0, 0%, 70%)">
          Place your wagers and earn with AI insights
        </text>
      ` : view === 'create' ? `
        <rect x="100" y="400" width="1000" height="150" rx="12" fill="hsl(230, 40%, 15%)" stroke="hsl(0, 0%, 30%)" stroke-width="2"/>
        <text x="600" y="450" font-family="Arial, sans-serif" font-size="28" text-anchor="middle" fill="white">
          Create Your Prediction Market
        </text>
        <text x="600" y="490" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="hsl(0, 0%, 70%)">
          Set up custom predictions for your audience
        </text>
      ` : ''}
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
