// pages/_app.tsx
import '../styles/global.css'; // Global styles
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-fixed">
        <Navbar />
        {/* <div className="flex items-center place-content-center justify-items-center flex-1"> */}
        <Component {...pageProps} />
        {/* </div> */}
        <Footer />
      </div>
    </>
  );
}
