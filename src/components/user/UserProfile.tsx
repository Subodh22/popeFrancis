"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useState } from "react";
import Image from "next/image";

export default function UserProfile() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  if (loading) {
    return (
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
        </svg>
        Sign in
      </button>
    );
  }
  
  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2"
      >
        {user.photoURL ? (
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
            <Image 
              src={user.photoURL}
              alt={user.displayName || "User"}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
            {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
          </div>
        )}
        <span className="text-sm font-medium hidden md:block">
          {user.displayName || user.email?.split('@')[0]}
        </span>
      </button>
      
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            Signed in as<br />
            <span className="font-medium">{user.email}</span>
          </div>
          <button
            onClick={() => {
              signOut();
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
} 