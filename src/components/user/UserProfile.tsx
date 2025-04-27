"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useState } from "react";
import Image from "next/image";

export default function UserProfile() {
  const { user, loading, signInWithGoogle } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
        </svg>
      </button>
    );
  }
  
  return (
    <div className="flex items-center justify-center">
      {user.photoURL ? (
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow">
          <Image 
            src={user.photoURL}
            alt=""
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow">
          {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
        </div>
      )}
    </div>
  );
} 