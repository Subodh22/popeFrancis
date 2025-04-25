"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useState } from "react";

interface LoginPromptProps {
  compact?: boolean;
}

export default function LoginPrompt({ compact = false }: LoginPromptProps) {
  const { signInWithGoogle } = useAuth();
  const [skipAuth, setSkipAuth] = useState(false);
  
  // Allow bypassing authentication completely
  const handleSkipAuth = () => {
    // Store a flag in sessionStorage to remember the choice
    sessionStorage.setItem('pope_francis_skip_auth', 'true');
    // Force the page to reload to refresh the auth state
    window.location.reload();
  };
  
  // Check if we already chose to skip auth in this session
  if (typeof window !== 'undefined' && sessionStorage.getItem('pope_francis_skip_auth') === 'true') {
    return null;
  }
  
  if (compact) {
    return (
      <div className="w-full space-y-2">
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#ffffff"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#ffffff"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#ffffff"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#ffffff"
            />
          </svg>
          Sign in with Google
        </button>
        <button
          onClick={handleSkipAuth}
          className="w-full px-4 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Skip login (chat history won&apos;t be saved)
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in to chat with Pope Francis</h2>
        <p className="text-gray-600">
          Sign in to start a conversation and save your chat history.
        </p>
      </div>
      
      <div className="space-y-4 w-full max-w-md">
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-md bg-white border hover:bg-gray-50 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>
        
        <button
          onClick={handleSkipAuth}
          className="w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md"
        >
          Skip login (chat history won&apos;t be saved)
        </button>
      </div>
    </div>
  );
} 