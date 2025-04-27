import React from 'react';
import ProFeatureTab from '@/components/ui/ProFeatureTab';
import PopeImage from '@/components/ui/PopeImage';
import UserProfile from '@/components/user/UserProfile';
import Link from 'next/link';

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
        <ProFeatureTab />
      </div>
    </main>
  );
} 