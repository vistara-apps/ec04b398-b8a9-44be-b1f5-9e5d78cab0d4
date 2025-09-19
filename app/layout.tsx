import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StreamPredict - Wager on Streamer Performance',
  description: 'Real-time prediction markets for streamers. Earn with your fans using AI-driven insights.',
  openGraph: {
    title: 'StreamPredict',
    description: 'Wager on Streamer Performance. Earn with Your Fans.',
    images: ['/og-image.png'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_BASE_URL}/api/og`,
    'fc:frame:button:1': 'View Predictions',
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{
        '--primary': 'hsl(240, 80%, 55%)',
        '--primary-50': 'hsl(240, 80%, 97%)',
        '--primary-100': 'hsl(240, 80%, 93%)',
        '--primary-200': 'hsl(240, 80%, 85%)',
        '--primary-300': 'hsl(240, 80%, 75%)',
        '--primary-400': 'hsl(240, 80%, 65%)',
        '--primary-500': 'hsl(240, 80%, 55%)',
        '--primary-600': 'hsl(240, 80%, 45%)',
        '--primary-700': 'hsl(240, 80%, 35%)',
        '--primary-800': 'hsl(240, 80%, 25%)',
        '--primary-900': 'hsl(240, 80%, 15%)',
        '--primary-950': 'hsl(240, 80%, 10%)',
        '--accent': 'hsl(172, 70%, 50%)',
        '--accent-50': 'hsl(172, 70%, 97%)',
        '--accent-100': 'hsl(172, 70%, 93%)',
        '--accent-200': 'hsl(172, 70%, 85%)',
        '--accent-300': 'hsl(172, 70%, 75%)',
        '--accent-400': 'hsl(172, 70%, 65%)',
        '--accent-500': 'hsl(172, 70%, 50%)',
        '--accent-600': 'hsl(172, 70%, 40%)',
        '--accent-700': 'hsl(172, 70%, 30%)',
        '--accent-800': 'hsl(172, 70%, 20%)',
        '--accent-900': 'hsl(172, 70%, 10%)',
        '--accent-950': 'hsl(172, 70%, 5%)',
        '--background': 'hsl(230, 40%, 10%)',
        '--foreground': 'hsl(0, 0%, 95%)',
        '--muted': 'hsl(230, 40%, 20%)',
        '--muted-foreground': 'hsl(0, 0%, 50%)',
        '--border': 'hsl(230, 40%, 25%)',
        '--input': 'hsl(230, 40%, 15%)',
        '--ring': 'hsl(240, 80%, 55%)',
        '--destructive': 'hsl(0, 84%, 60%)',
        '--destructive-foreground': 'hsl(0, 0%, 95%)',
        '--chart-1': 'hsl(240, 80%, 55%)',
        '--chart-2': 'hsl(172, 70%, 50%)',
        '--chart-3': 'hsl(142, 76%, 36%)',
        '--chart-4': 'hsl(38, 92%, 50%)',
        '--chart-5': 'hsl(0, 84%, 60%)',
        '--radius': '8px',
      } as React.CSSProperties}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
