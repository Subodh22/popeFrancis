import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  // Handle and suppress Firebase-related errors on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Override console error for specific error messages
      const originalConsoleError = console.error;
      console.error = (...args) => {
        // Check if the error is related to Firebase, quota or blocked requests
        const errorStr = args.join(' ');
        if (
          errorStr.includes('quota exceeded') || 
          errorStr.includes('Firestore') || 
          errorStr.includes('Firebase') || 
          errorStr.includes('firestore') || 
          errorStr.includes('firebase') || 
          errorStr.includes('ERR_BLOCKED_BY_CLIENT') ||
          errorStr.includes('net::ERR_BLOCKED')
        ) {
          // Suppress these errors from the console
          return;
        }
        
        // Pass other errors to the original console.error
        originalConsoleError(...args);
      };

      // Also override window.onerror to catch Firebase script errors
      const originalOnError = window.onerror;
      window.onerror = function(message, source, lineno, colno, error) {
        if (
          source && 
          (source.includes('firebase') || 
           source.includes('firestore') || 
           source.includes('googleapis'))
        ) {
          // Suppress Firebase-related script errors
          return true; // Prevents the error from propagating
        }
        
        // Let other errors propagate as normal
        if (originalOnError) {
          return originalOnError.apply(this, arguments as any);
        }
        return false;
      };

      return () => {
        // Restore original handlers on cleanup
        console.error = originalConsoleError;
        window.onerror = originalOnError;
      };
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Pope Francis - Spiritual Guidance</title>
        <meta name="description" content="Have a conversation with Pope Francis AI for spiritual guidance and wisdom." />
      </Head>
      <Component {...pageProps} />
    </>
  );
} 