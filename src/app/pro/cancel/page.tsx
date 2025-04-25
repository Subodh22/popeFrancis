"use client";

import React from 'react';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
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
          <Link 
            href="/pro"
            className="py-3 px-6 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg shadow transition-colors"
          >
            Try Again
          </Link>
          
          <Link 
            href="/"
            className="py-3 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg shadow transition-colors"
          >
            Return to Chat
          </Link>
        </div>
      </div>
    </div>
  );
} 