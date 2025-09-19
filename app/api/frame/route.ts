import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>StreamPredict</title>
        <meta property="fc:frame" content="vNext">
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og">
        <meta property="fc:frame:button:1" content="View Predictions">
        <meta property="fc:frame:button:2" content="Create Market">
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame">
      </head>
      <body>
        <h1>StreamPredict - Wager on Streamer Performance</h1>
        <p>Real-time prediction markets for your favorite streamers.</p>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { buttonIndex } = body;

    let responseHtml = '';

    if (buttonIndex === 1) {
      // View Predictions
      responseHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta property="fc:frame" content="vNext">
            <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?view=predictions">
            <meta property="fc:frame:button:1" content="Place Wager">
            <meta property="fc:frame:button:2" content="View Analytics">
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame">
          </head>
          <body>
            <h1>Active Predictions</h1>
          </body>
        </html>
      `;
    } else if (buttonIndex === 2) {
      // Create Market
      responseHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta property="fc:frame" content="vNext">
            <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?view=create">
            <meta property="fc:frame:button:1" content="Back to Home">
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame">
          </head>
          <body>
            <h1>Create Prediction Market</h1>
          </body>
        </html>
      `;
    } else {
      // Default response
      responseHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta property="fc:frame" content="vNext">
            <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og">
            <meta property="fc:frame:button:1" content="View Predictions">
            <meta property="fc:frame:button:2" content="Create Market">
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame">
          </head>
          <body>
            <h1>StreamPredict</h1>
          </body>
        </html>
      `;
    }

    return new NextResponse(responseHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
