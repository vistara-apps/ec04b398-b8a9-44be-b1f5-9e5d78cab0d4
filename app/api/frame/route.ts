import { NextRequest, NextResponse } from 'next/server';
import { generateMockPredictions } from '../../../lib/utils';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const view = searchParams.get('view') || 'home';
  const predictionId = searchParams.get('predictionId');

  let html = '';

  if (view === 'predictions') {
    const predictions = generateMockPredictions();
    const activePredictions = predictions.filter(p => !p.resolved);

    html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>StreamPredict - Active Predictions</title>
          <meta property="fc:frame" content="vNext">
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?view=predictions">
          ${activePredictions.slice(0, 4).map((prediction, index) =>
            `<meta property="fc:frame:button:${index + 1}" content="${prediction.prompt.substring(0, 30)}...">`
          ).join('')}
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame">
        </head>
        <body>
          <h1>Active Predictions</h1>
          <p>Choose a prediction market to participate in.</p>
        </body>
      </html>
    `;
  } else if (view === 'prediction' && predictionId) {
    const predictions = generateMockPredictions();
    const prediction = predictions.find(p => p.predictionId.toString() === predictionId);

    if (prediction) {
      html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>StreamPredict - ${prediction.prompt}</title>
            <meta property="fc:frame" content="vNext">
            <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?view=prediction&id=${predictionId}">
            ${prediction.options.slice(0, 4).map((option, index) =>
              `<meta property="fc:frame:button:${index + 1}" content="${option} (${prediction.options[index].odds.toFixed(1)}x)">`
            ).join('')}
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame">
          </head>
          <body>
            <h1>${prediction.prompt}</h1>
            <p>Total Pool: ${prediction.totalWagers} tokens</p>
          </body>
        </html>
      `;
    } else {
      html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>StreamPredict - Prediction Not Found</title>
            <meta property="fc:frame" content="vNext">
            <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?view=error">
            <meta property="fc:frame:button:1" content="Back to Home">
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame">
          </head>
          <body>
            <h1>Prediction Not Found</h1>
            <p>The requested prediction market could not be found.</p>
          </body>
        </html>
      `;
    }
  } else {
    html = `
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
          <meta property="fc:frame:button:3" content="My Profile">
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame">
        </head>
        <body>
          <h1>StreamPredict</h1>
          <p>Wager on Streamer Performance. Earn with Your Fans.</p>
        </body>
      </html>
    `;
  }

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { buttonIndex, inputText, state } = body;

    let responseHtml = '';
    const predictions = generateMockPredictions();
    const activePredictions = predictions.filter(p => !p.resolved);

    if (state?.view === 'predictions') {
      // Handle prediction selection
      const selectedPrediction = activePredictions[buttonIndex - 1];
      if (selectedPrediction) {
        responseHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta property="fc:frame" content="vNext">
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?view=prediction&id=${selectedPrediction.predictionId}">
              ${selectedPrediction.options.slice(0, 4).map((option, index) =>
                `<meta property="fc:frame:button:${index + 1}" content="${option}">`
              ).join('')}
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame">
              <meta property="fc:frame:state" content='{"view":"prediction","predictionId":"${selectedPrediction.predictionId}"}'>
            </head>
            <body>
              <h1>${selectedPrediction.prompt}</h1>
              <p>Choose your prediction option.</p>
            </body>
          </html>
        `;
      }
    } else if (state?.view === 'prediction') {
      // Handle wager placement
      const prediction = predictions.find(p => p.predictionId.toString() === state.predictionId);
      if (prediction && buttonIndex >= 1 && buttonIndex <= prediction.options.length) {
        const selectedOption = prediction.options[buttonIndex - 1];
        responseHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta property="fc:frame" content="vNext">
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?view=wager&id=${prediction.predictionId}&option=${encodeURIComponent(selectedOption)}">
              <meta property="fc:frame:input:text" content="Enter wager amount">
              <meta property="fc:frame:button:1" content="Place Wager">
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame">
              <meta property="fc:frame:state" content='{"view":"wager","predictionId":"${prediction.predictionId}","option":"${selectedOption}"}'>
            </head>
            <body>
              <h1>Wager on: ${selectedOption}</h1>
              <p>Enter the amount of ${prediction.streamer.displayName} tokens to wager.</p>
            </body>
          </html>
        `;
      }
    } else if (state?.view === 'wager' && buttonIndex === 1) {
      // Handle wager confirmation
      const prediction = predictions.find(p => p.predictionId.toString() === state.predictionId);
      if (prediction && inputText) {
        // In a real app, this would interact with the smart contract
        responseHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta property="fc:frame" content="vNext">
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?view=confirmed">
              <meta property="fc:frame:button:1" content="View My Wagers">
              <meta property="fc:frame:button:2" content="Back to Home">
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame">
            </head>
            <body>
              <h1>Wager Placed!</h1>
              <p>You wagered ${inputText} tokens on "${state.option}" for "${prediction.prompt}"</p>
            </body>
          </html>
        `;
      }
    } else if (buttonIndex === 1) {
      // View Predictions
      responseHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta property="fc:frame" content="vNext">
            <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?view=predictions">
            ${activePredictions.slice(0, 4).map((prediction, index) =>
              `<meta property="fc:frame:button:${index + 1}" content="${prediction.prompt.substring(0, 30)}...">`
            ).join('')}
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame">
            <meta property="fc:frame:state" content='{"view":"predictions"}'>
          </head>
          <body>
            <h1>Active Predictions</h1>
            <p>Choose a prediction market to participate in.</p>
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
            <meta property="fc:frame:input:text" content="Prediction question">
            <meta property="fc:frame:button:1" content="Create Market">
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame">
            <meta property="fc:frame:state" content='{"view":"create"}'>
          </head>
          <body>
            <h1>Create Prediction Market</h1>
            <p>Enter your prediction question.</p>
          </body>
        </html>
      `;
    } else if (buttonIndex === 3) {
      // My Profile
      responseHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta property="fc:frame" content="vNext">
            <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?view=profile">
            <meta property="fc:frame:button:1" content="My Wagers">
            <meta property="fc:frame:button:2" content="My Markets">
            <meta property="fc:frame:button:3" content="Back to Home">
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame">
            <meta property="fc:frame:state" content='{"view":"profile"}'>
          </head>
          <body>
            <h1>My Profile</h1>
            <p>View your prediction activity.</p>
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
            <meta property="fc:frame:button:3" content="My Profile">
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame">
          </head>
          <body>
            <h1>StreamPredict</h1>
            <p>Wager on Streamer Performance. Earn with Your Fans.</p>
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
