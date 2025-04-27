"use client";

import React, { useState, useMemo } from 'react';
import { getStripe } from '@/lib/stripe';

const PRESET_AMOUNTS = {
  'one-time': [10, 20, 30, 60],
  'monthly': [5, 10, 20, 30]
};

export default function ProFeatureTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(20);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [donationType, setDonationType] = useState('one-time'); // 'one-time' or 'monthly'

  const currentAmounts = useMemo(() => {
    return PRESET_AMOUNTS[donationType as keyof typeof PRESET_AMOUNTS];
  }, [donationType]);

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
        body: JSON.stringify({ 
          amount,
          donationType 
        }),
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto my-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="prose dark:prose-invert">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800 mt-4">
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                100% of profits from your contribution will be donated to charitable works.
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Donate now</h2>
          
          <div className="flex space-x-6 items-center">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-yellow-600"
                checked={donationType === 'one-time'}
                onChange={() => setDonationType('one-time')}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">ONE TIME</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-yellow-600"
                checked={donationType === 'monthly'}
                onChange={() => setDonationType('monthly')}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">MONTHLY</span>
            </label>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentAmounts.map((presetAmount) => (
              <button
                key={presetAmount}
                type="button"
                onClick={() => handlePresetAmountClick(presetAmount)}
                className={`py-3 px-4 rounded-md border ${
                  amount === presetAmount && !isCustom
                    ? 'bg-blue-500 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                ${presetAmount}{donationType === 'monthly' && '/mo'}
              </button>
            ))}
            
            <div className={`col-span-2 md:col-span-4 flex items-center ${
              isCustom ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700' : ''
            } rounded-md p-2`}>
              <span className="text-gray-700 dark:text-gray-300 ml-2 mr-2">$</span>
              <input
                type="text"
                value={isCustom ? customAmount : ''}
                onChange={handleCustomAmountChange}
                onClick={enableCustomAmount}
                placeholder="Other amount"
                className="px-3 py-2 border-0 bg-transparent w-full text-gray-900 dark:text-gray-100 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4 border border-yellow-100 dark:border-yellow-800">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">About Caritas Internationalis</h3>
            <p className="text-yellow-700 dark:text-yellow-300 mt-1">
              Caritas Internationalis is a confederation of over 160 Catholic relief, 
              development, and social service organizations operating in over 200 countries 
              and territories worldwide. Founded in 1951, it is one of Pope Francis&apos;s most 
              cherished humanitarian organizations, focusing on emergency relief, healthcare, 
              and sustainable development.
            </p>
            <p className="text-yellow-700 dark:text-yellow-300 font-medium mt-2">
              100% of our profits from your donation will directly support these charitable works.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Payment Method</h3>
            
            <button
              className="w-full flex items-center justify-center py-3 px-4 bg-blue-500 text-white font-bold rounded-md shadow hover:bg-blue-600 transition-colors"
              onClick={handleSubscribe}
              disabled={isLoading || amount <= 0}
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
                <>
                  Donate with Credit/Debit Card
                  <div className="flex space-x-1 ml-2">
                    <span className="w-8 h-6 bg-white rounded-sm flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="h-4 w-4">
                        <path fill="#007bff" d="M470.1 231.3s7.6 37.2 9.3 45H446c3.3-8.9 16-43.5 16-43.5-.2.3 3.3-9.1 5.3-14.9l2.8 13.4zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM152.5 331.2L215.7 176h-42.5l-39.3 106-4.3-21.5-14-71.4c-2.3-9.9-9.4-12.7-18.2-13.1H32.7l-.7 3.1c15.9 4 29.5 9.8 42.3 17.1l35.7 135h42.8zm94.4.2L272.1 176h-40.2l-25.1 155.4h40.1zm139.9-50.8c.2-17.7-10.6-31.2-33.7-42.3-14.1-7.1-22.7-11.9-22.7-19.2.2-6.6 7.3-13.4 23.1-13.4 13.1-.3 22.7 2.8 29.9 5.9l3.6 1.7 5.5-33.6c-7.9-3.1-20.5-6.6-36-6.6-39.7 0-67.6 21.2-67.8 51.4-.3 22.3 20 34.7 35.2 42.2 15.5 7.6 20.8 12.6 20.8 19.3-.2 10.4-12.6 15.2-24.1 15.2-16 0-24.6-2.5-37.7-8.3l-5.3-2.5-5.6 34.9c9.4 4.3 26.8 8.1 44.8 8.3 42.2.1 69.7-20.8 70-53zM528 331.4L495.6 176h-31.1c-9.6 0-16.9 2.8-21 12.9l-59.7 142.5H426s6.9-19.2 8.4-23.3H486c1.2 5.5 4.8 23.3 4.8 23.3H528z" />
                      </svg>
                    </span>
                    <span className="w-8 h-6 bg-white rounded-sm flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="h-4 w-4">
                        <path fill="#FF5F00" d="M525.6 234.6L501.7 172l-24 62.6h48zm-50 47.4L499.9 146l24.3 136h-48.6zm-124.3 0L375.6 146l24.3 136h-48.6zm-1.7-185.7L324.7 172l-24-62.6h48zm-26.7 138.3L347.2 146l24.3 136h-48.6zm-124.3 0L223.2 146l24.3 136h-48.6zm-1.7-185.7L122.7 172l-24-62.6h48zm-26.7 138.3L145.2 146l24.3 136h-48.6zM48 234.6L24.1 172 0 234.6h48zm424.3 47.4l24.3-136 24.3 136h-48.6zm-300.6 0l24.3-136 24.3 136h-48.6zm-148.6 0l24.3-136 24.3 136h-48.6z"/>
                      </svg>
                    </span>
                  </div>
                </>
              )}
            </button>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Your payment details will be processed securely by Stripe, a payment processor, 
            and a record of your donation will be stored securely.
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Contributions will be used to fund charitable causes through Caritas Internationalis.
            100% of profits from donations are directed to charitable work.
            Donations are tax-deductible to the fullest extent permitted by law.
          </p>
        </div>
      </div>
    </div>
  );
} 