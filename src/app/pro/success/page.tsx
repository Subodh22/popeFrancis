"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams ? searchParams.get('session_id') : null;

  useEffect(() => {
    // You would typically verify the payment was successful here
    // by calling your backend to check the session status
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [sessionId]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <p className="text-gray-600">Confirming your donation...</p>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Thank You!</h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your donation to Pope Francis&apos;s favorite foundation has been received. 
            Your support will help make a difference in many lives.
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800 mb-6">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              &quot;True wealth is not measured by what we have, but by what we give.&quot; - Pope Francis
            </p>
          </div>
          
          <Link 
            href="/"
            className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors"
          >
            Return to Chat
          </Link>
        </div>
      )}
    </div>
  );
} 