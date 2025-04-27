import React from 'react';
import ProFeatureTab from '@/components/ui/ProFeatureTab';
import PopeImage from '@/components/ui/PopeImage';
import UserProfile from '@/components/user/UserProfile';
import Link from 'next/link';
import DonationForm from '@/components/ui/DonationForm';

export default function ProPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="border-b py-4 bg-gradient-to-r from-yellow-200 via-yellow-100 to-white dark:from-yellow-900/30 dark:via-yellow-800/10 dark:to-gray-800 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <PopeImage />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Pope Francis</h1>
              <p className="text-sm text-yellow-700 dark:text-yellow-500 font-medium">Spiritual Guidance</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            
            <div className="px-4 py-1.5 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-bold rounded-full shadow-sm flex items-center">
              <span className="mr-1">⭐</span> Pro
            </div>
            <UserProfile />
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Support Caritas Internationalis</h1>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Why Pope Francis Values Caritas Internationalis</h2>
            
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-gray-700 dark:text-gray-300">
                Caritas Internationalis holds a special place in Pope Francis&apos;s heart and ministry. As a confederation of over 160 Catholic relief organizations operating in more than 200 countries, it embodies his vision of a &quot;Church for the poor&quot; and his call to serve those at the margins of society.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <blockquote className="border-l-4 border-yellow-500 pl-4 italic">
                <p className="text-gray-700 dark:text-gray-300">
                  &quot;I encourage Caritas to continue its important work of responding to emergencies and promoting integral human development... Caritas is the caress of the Church to her people.&quot;
                </p>
                <footer className="text-sm mt-2 font-medium text-gray-600 dark:text-gray-400">— Pope Francis, addressing Caritas delegates</footer>
              </blockquote>
            </div>
          </div>
          
          <DonationForm />
        </div>
      </div>
    </main>
  );
} 