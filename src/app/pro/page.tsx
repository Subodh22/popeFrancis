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
        
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Why Pope Francis Values Caritas Internationalis</h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="mb-4">
              Caritas Internationalis holds a special place in Pope Francis&apos;s heart and ministry. As a confederation of over 160 Catholic relief organizations operating in more than 200 countries, it embodies his vision of a &quot;Church for the poor&quot; and his call to serve those at the margins of society.
            </p>
            
            <blockquote className="border-l-4 border-yellow-500 pl-4 italic my-6">
              &quot;I encourage Caritas to continue its important work of responding to emergencies and promoting integral human development... Caritas is the caress of the Church to her people.&quot;
              <footer className="text-sm mt-2">— Pope Francis, addressing Caritas delegates</footer>
            </blockquote>
            
            <p className="mb-4">
              Since the beginning of his pontificate in 2013, Pope Francis has consistently emphasized the work of Caritas Internationalis as a concrete expression of the Gospel&apos;s call to serve the least fortunate. He has personally visited Caritas projects around the world, from refugee camps to community kitchens, highlighting their work as essential to the Church&apos;s mission.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">Key Initiatives Supported by Pope Francis</h3>
            
            <ul className="list-disc pl-5 mb-4">
              <li><strong>Migration and Refugee Support</strong> — Providing humanitarian assistance to displaced people, a cause Pope Francis has championed throughout his papacy</li>
              <li><strong>Climate Action</strong> — Working with communities affected by environmental degradation, in line with the Pope&apos;s encyclical <em>Laudato Si&apos;</em></li>
              <li><strong>Emergency Response</strong> — Delivering aid during natural disasters and conflicts, embodying the Pope&apos;s call for immediate action in crisis situations</li>
              <li><strong>Healthcare Services</strong> — Supporting medical facilities in underserved regions, reflecting the Pope&apos;s emphasis on healthcare as a human right</li>
            </ul>
            
            <p>
              By supporting Caritas Internationalis, you&apos;re participating in Pope Francis&apos;s vision of a more compassionate and just world. 100% of profits from your contribution will fund these important humanitarian initiatives around the globe.
            </p>
          </div>
        </div>
        
        <ProFeatureTab />
      </div>
    </main>
  );
} 