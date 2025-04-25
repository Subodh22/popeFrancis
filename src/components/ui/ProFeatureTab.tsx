"use client";

import React, { useState } from 'react';
import { getStripe } from '@/lib/stripe';

const PRESET_AMOUNTS = [10, 25, 50, 100, 250];

export default function ProFeatureTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const handlePresetAmountClick = (value: number) => {
    setAmount(value);
    setIsCustom(false);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value);
      if (value) {
        setAmount(parseFloat(value));
      } else {
        setAmount(0);
      }
    }
  };

  const enableCustomAmount = () => {
    setIsCustom(true);
    setAmount(customAmount ? parseFloat(customAmount) : 0);
  };

  const handleSubscribe = async () => {
    if (amount <= 0) {
      alert("Please enter a valid donation amount");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call our API to create a Stripe checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
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
          
          <div className="space-y-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium">
              Choose a donation amount:
            </label>
            
            <div className="flex flex-wrap gap-2">
              {PRESET_AMOUNTS.map((presetAmount) => (
                <button
                  key={presetAmount}
                  type="button"
                  onClick={() => handlePresetAmountClick(presetAmount)}
                  className={`px-4 py-2 rounded-full border ${
                    amount === presetAmount && !isCustom
                      ? 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-200'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  ${presetAmount}
                </button>
              ))}
              
              <button
                type="button"
                onClick={enableCustomAmount}
                className={`px-4 py-2 rounded-full border ${
                  isCustom
                    ? 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-200'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Custom
              </button>
            </div>
            
            {isCustom && (
              <div className="flex items-center mt-3">
                <span className="text-gray-700 dark:text-gray-300 mr-2">$</span>
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter amount"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600"
                  autoFocus
                />
              </div>
            )}
            
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-yellow-600">${amount}</span>
              <span className="text-gray-500 dark:text-gray-400">one-time donation</span>
            </div>
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
            disabled={isLoading || amount <= 0}
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
              `Donate $${amount}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 