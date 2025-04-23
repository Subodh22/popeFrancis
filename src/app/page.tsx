import ChatInterface from "@/components/chat/ChatInterface";
import PopeImage from "@/components/ui/PopeImage";
import UserProfile from "@/components/user/UserProfile";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <header className="border-b py-4 bg-gradient-to-r from-yellow-200 to-white dark:from-yellow-900/30 dark:to-gray-800 dark:border-gray-700">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PopeImage />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Pope Francis</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Conversational AI Experience</p>
            </div>
          </div>
          <UserProfile />
        </div>
      </header>
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
          <ChatInterface />
        </div>
      </div>
      
      <footer className="bg-gray-100 dark:bg-gray-800 py-3 text-center text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700">
        <p>This is a simulated conversation with Pope Francis for spiritual and educational purposes.</p>
        <p>Not affiliated with the Vatican or the Holy See.</p>
      </footer>
    </main>
  );
}
