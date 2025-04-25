"use client";

import React from 'react';
import ContactForm from '@/components/contact/ContactForm';
import Header from '@/components/ui/Header';

export const metadata = {
  title: 'Contact Pope Francis',
  description: 'Send a message to Pope Francis',
};

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Contact Pope Francis
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Send a message directly to Pope Francis. 
              He would be delighted to hear from you.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
            <ContactForm />
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              This is a simulated experience for spiritual and educational purposes only. 
              Not affiliated with the Vatican or the Holy See.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="bg-gradient-to-r from-yellow-100 to-white dark:from-gray-800 dark:to-gray-900 py-3 text-center text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700">
        <p className="font-medium">This is a simulated conversation with Pope Francis for spiritual and educational purposes.</p>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-500">Not affiliated with the Vatican or the Holy See.</p>
      </footer>
    </main>
  );
} 