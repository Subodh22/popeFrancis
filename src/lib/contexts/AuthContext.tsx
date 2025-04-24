"use client";

import React, { createContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { signInWithGoogle as firebaseSignInWithGoogle, logoutUser } from "@/lib/firebase/firebaseUtils";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  authError: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Set up auth state listener
  useEffect(() => {
    let unsubscribed = false;
    
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (unsubscribed) return;
      
      if (authUser) {
        // User is signed in
        setUser(authUser);
        setAuthError(null);
      } else {
        // User is signed out
        setUser(null);
      }
      
      // Set loading to false after a maximum of 3 seconds
      setTimeout(() => {
        if (!unsubscribed) {
          setLoading(false);
        }
      }, 3000);
    }, (error) => {
      console.error("Auth state error:", error);
      setAuthError("Authentication error. Chat will continue without saving history.");
      setLoading(false);
    });

    // Set a timeout to ensure loading state doesn't hang indefinitely
    const loadingTimeout = setTimeout(() => {
      if (!unsubscribed) {
        setLoading(false);
      }
    }, 5000);

    // Cleanup subscription on unmount
    return () => {
      unsubscribed = true;
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, []);

  // Firebase Google sign-in function
  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      const user = await firebaseSignInWithGoogle();
      if (!user) {
        // User cancelled or auth failed silently
        setAuthError("Sign-in was cancelled or failed. You can still use the chat without an account.");
      }
    } catch (error) {
      console.error("Error signing in with Google", error);
      setAuthError("Failed to sign in. Please try again later.");
    }
  };

  const signOutUser = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Error signing out", error);
      setAuthError("Failed to sign out. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut: signOutUser, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
