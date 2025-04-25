import React from 'react';
import ContactForm from '@/components/contact/ContactForm';

export const metadata = {
  title: 'Contact Pope Francis',
  description: 'Send a message to Pope Francis',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
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
  );
} 