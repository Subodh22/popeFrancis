"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/ui/Header';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<string | null>(null);
  const sessionId = searchParams ? searchParams.get('session_id') : null;

  useEffect(() => {
    // Fetch session details to get the amount
    const fetchSessionDetails = async () => {
      if (sessionId) {
        try {
          const response = await fetch(`/api/stripe/session?id=${sessionId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.amount) {
              setAmount(data.amount);
            }
          }
        } catch (error) {
          console.error('Error fetching session details:', error);
        }
      }
      
      // Show success page even if fetch fails
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    };

    fetchSessionDetails();
  }, [sessionId]);

  return (
    <div className="container mx-auto flex-1 px-4 py-16 text-center">
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
          
          {amount && (
            <div className="text-lg font-medium text-yellow-600 mb-4">
              Your contribution of {amount} has been received.
            </div>
          )}
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            100% of profits from your contribution will go to Caritas Internationalis. 
            Your generosity will help support humanitarian efforts around the world.
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

// Loading fallback component
function SuccessLoading() {
  return (
    <div className="container mx-auto flex-1 px-4 py-16 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-gray-600">Loading payment details...</p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      <Suspense fallback={<SuccessLoading />}>
        <SuccessContent />
      </Suspense>
      <footer className="bg-gradient-to-r from-yellow-100 to-white dark:from-gray-800 dark:to-gray-900 py-3 text-center text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700">
        <p className="font-medium">This is a simulated experience for spiritual and educational purposes.</p>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-500">Not affiliated with the Vatican or the Holy See.</p>
      </footer>
    </main>
  );
} 