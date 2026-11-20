import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';

export const metadata: Metadata = {
  title: 'NEXO - Gaming Social Platform',
  description: 'Connect with gamers worldwide. Share clips, join game hubs, go live, and discover the gaming community.',
  keywords: ['gaming', 'social media', 'esports', 'streaming', 'gaming community'],
  openGraph: {
    title: 'NEXO Gaming',
    description: 'The ultimate gaming social platform',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background font-body text-text-primary antialiased">
        <AuthProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
