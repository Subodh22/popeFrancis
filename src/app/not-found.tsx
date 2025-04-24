import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-colors shadow-md"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
} 