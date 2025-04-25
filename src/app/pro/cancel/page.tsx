"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';

export default function CancelPage() {
  const router = useRouter();

  const handleTryAgain = () => {
    router.push('/pro');
  };

  const handleReturnToChat = () => {
    router.push('/');
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto flex-1 px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Donation Cancelled</h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your donation has been cancelled. No worries! You can always come back
            and support Pope Francis&apos;s charitable work another time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleTryAgain}
              className="py-3 px-6 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg shadow transition-colors"
            >
              Try Again
            </button>
            
            <button 
              onClick={handleReturnToChat}
              className="py-3 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg shadow transition-colors"
            >
              Return to Chat
            </button>
          </div>
        </div>
      </div>
      
      <footer className="bg-gradient-to-r from-yellow-100 to-white dark:from-gray-800 dark:to-gray-900 py-3 text-center text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700">
        <p className="font-medium">This is a simulated experience for spiritual and educational purposes.</p>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-500">Not affiliated with the Vatican or the Holy See.</p>
      </footer>
    </main>
  );
} 