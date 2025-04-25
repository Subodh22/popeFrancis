"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full py-4 px-6 bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 mt-auto border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <div>
          This is a simulated conversation with Pope Francis for spiritual and educational purposes.
          Not affiliated with the Vatican or the Holy See.
        </div>
        <div className="text-gray-400 dark:text-gray-500 italic">
          This conversation is private between you and Pope Francis and is not recorded outside of your device.
        </div>
      </div>
    </footer>
  );
} 