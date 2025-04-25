import React from 'react';
import Link from 'next/link';
import PopeImage from './PopeImage';
import UserProfile from '@/components/user/UserProfile';

export default function Header() {
  return (
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
          <Link 
            href="/contact"
            className="px-4 py-1.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm border border-gray-200 dark:border-gray-600"
          >
            Contact
          </Link>
          <Link 
            href="/pro"
            className="px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-full hover:from-yellow-600 hover:to-yellow-700 transition-colors shadow-sm flex items-center"
          >
            <span className="mr-1">⭐</span> Pro
          </Link>
          <UserProfile />
        </div>
      </div>
    </header>
  );
} 