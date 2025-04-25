"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

// Loading component shown while fetching session data
function SuccessLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
      <h1 className="text-2xl font-bold mb-4">Processing your donation...</h1>
      <p className="text-gray-600 text-center">Please wait while we confirm your payment.</p>
    </div>
  );
}

// Component that displays success content after fetching session data
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const customerEmail = searchParams?.get('email');
  const customerName = searchParams?.get('name');
  
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('Invalid session ID');
      setLoading(false);
      return;
    }

    // Send confirmation email if we have an email address
    const sendConfirmationEmail = async () => {
      if (customerEmail) {
        try {
          const amount = '$25.00'; // Fixed amount for our product
          const name = customerName || 'Valued Supporter';
          
          // Call our test webhook endpoint with the customer's email
          const emailResponse = await fetch(
            `/api/stripe/test-webhook?email=${encodeURIComponent(customerEmail)}&name=${encodeURIComponent(name)}&amount=${encodeURIComponent(amount)}`
          );
          
          if (emailResponse.ok) {
            setEmailSent(true);
          } else {
            console.error('Failed to send confirmation email');
          }
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
        }
      }
      
      setLoading(false);
    };

    sendConfirmationEmail();
  }, [sessionId, customerEmail, customerName]);

  if (loading) {
    return <SuccessLoading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-gray-600 text-center mb-6">{error}</p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Donation!</h1>
      <p className="text-gray-600 text-center mb-2">Your payment has been processed successfully.</p>
      <p className="text-gray-600 text-center mb-6">100% of profits go to Pope Francis&apos;s favorite foundation.</p>
      
      {emailSent && customerEmail && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6 max-w-md text-center">
          We&apos;ve sent a confirmation email to {customerEmail}. Please check your inbox!
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 mt-2">
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center">
          Return to Chat
        </Link>
        <Link href="/pro" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center">
          Learn More About Pro
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="container mx-auto py-12">
      <Suspense fallback={<SuccessLoading />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
} 