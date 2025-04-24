"use client";

import React, { createContext, useEffect, useState } from "react";

// Local mock user interface that mimics Firebase User structure
interface LocalUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: LocalUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

const LOCAL_STORAGE_KEY = 'pope_francis_user';

// Random names for mock users
const RANDOM_NAMES = [
  'John Doe', 'Jane Smith', 'Alex Johnson', 'Sam Wilson', 
  'Maria Garcia', 'Tao Chen', 'Fatima Ali', 'David Kim'
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
    
    setLoading(false);
  }, []);

  // Mock Google sign-in function
  const signInWithGoogle = async () => {
    try {
      // Generate a mock user with random data
      const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
      const randomId = Math.random().toString(36).substring(2, 15);
      
      const mockUser: LocalUser = {
        uid: `user_${randomId}`,
        displayName: randomName,
        email: `${randomName.toLowerCase().replace(' ', '.')}@example.com`,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(randomName)}&background=random`,
      };
      
      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  const signOutUser = async () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
