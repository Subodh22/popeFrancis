import ChatInterface from "@/components/chat/ChatInterface";
import Footer from "@/components/ui/Footer";
import PopeImage from "@/components/ui/PopeImage";
import UserProfile from "@/components/user/UserProfile";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="border-b py-4 bg-gradient-to-r from-yellow-200 via-yellow-100 to-white dark:from-yellow-900/30 dark:via-yellow-800/10 dark:to-gray-800 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <PopeImage />
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
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
          <ChatInterface />
        </div>
      </div>
      
      <footer className="bg-gradient-to-r from-yellow-100 to-white dark:from-gray-800 dark:to-gray-900 py-3 text-center text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700">
        <p className="font-medium">This is a simulated conversation with Pope Francis for spiritual and educational purposes.</p>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-500">Not affiliated with the Vatican or the Holy See.</p>
        
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-500"> This conversation is private between you and Pope Francis and is not recorded outside of your device.
        </p>
       
      </footer>
    </main>
  );
}
