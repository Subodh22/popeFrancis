"use client";

import React, { useState } from 'react';
import { getStripe } from '@/lib/stripe';

export default function ProFeatureTab() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      // Call our API to create a Stripe checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      // Redirect to Stripe checkout
      const stripe = await getStripe();
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });
        
        if (error) {
          console.error('Stripe checkout error:', error);
        }
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-3xl mx-auto my-8">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="md:w-1/3">
          <div className="relative">
            <img 
              src="https://www.vaticannews.va/content/dam/vaticannews/agenzie/images/afp/2022/10/06/09/1665049251361.jpg/_jcr_content/renditions/cq5dam.thumbnail.cropped.1500.844.jpeg" 
              alt="Pope Francis" 
              className="rounded-lg shadow-md"
            />
            <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg font-bold">
              PRO
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pope Francis Pro</h2>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-yellow-600">$25</span>
            <span className="text-gray-500 dark:text-gray-400">one-time donation</span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300">
            Upgrade to Pope Francis Pro and support charitable works. 
            <span className="block mt-2 font-medium text-emerald-600 dark:text-emerald-400">
              100% of profits go to Pope Francis&apos;s favorite foundation.
            </span>
          </p>
          
          <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
            <p className="text-amber-800 dark:text-amber-200 italic text-sm">
              There are no additional features with Pro - this is simply a way to donate to charity via the Pope Francis chat experience.
            </p>
          </div>
          
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="mt-4 w-full py-3 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg shadow transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Support Pope Francis"
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 