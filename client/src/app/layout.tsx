import type { Metadata } from 'next';
import './globals.css';
import { Navbar, Footer, SolanaProvider } from '@/components';

export const metadata: Metadata = {
  title: 'RUMA',
  description: 'NFT-based Event Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <SolanaProvider>
          <Navbar />
          <main className="mt-24 flex-grow">{children}</main>
          <Footer />
        </SolanaProvider>
      </body>
    </html>
  );
}
