import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SolanaProvider } from '@/components/SolanaProvider';

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
