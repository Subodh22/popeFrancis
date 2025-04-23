"use client";

import React, { useState, useRef, useEffect } from "react";
import { SendIcon } from "lucide-react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function ChatInput({ 
  input, 
  handleInputChange, 
  handleSubmit, 
  isLoading 
}: ChatInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const DEBOUNCE_TIME = 1000; // 1 second
  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Don't submit if:
    // 1. Input is empty
    // 2. Loading is in progress
    // 3. It's been less than DEBOUNCE_TIME since last submission
    if (
      input.trim() === '' || 
      isLoading || 
      (Date.now() - lastSubmitTime < DEBOUNCE_TIME)
    ) return;
    
    // Set last submit time
    setLastSubmitTime(Date.now());
    
    // Submit the form
    handleSubmit(e);
  };
  
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      
      // Don't submit if:
      // 1. Input is empty
      // 2. Loading is in progress
      // 3. It's been less than DEBOUNCE_TIME since last submission
      if (
        input.trim() === '' || 
        isLoading || 
        (Date.now() - lastSubmitTime < DEBOUNCE_TIME)
      ) return;
      
      // Set last submit time
      setLastSubmitTime(Date.now());
      
      // Submit the form
      formRef.current?.requestSubmit();
    }
  };
  
  return (
    <form ref={formRef} onSubmit={onSubmit} className="relative">
      <textarea
        className="w-full p-3 pr-12 border dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none max-h-32 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        value={input}
        onChange={handleInputChange}
        placeholder="Type your message here..."
        rows={1}
        onKeyDown={onKeyDown}
        style={{ minHeight: "50px" }}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim() || (Date.now() - lastSubmitTime < DEBOUNCE_TIME)}
        className="absolute right-3 bottom-3 p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-indigo-600 dark:hover:bg-indigo-700"
      >
        <SendIcon className="h-4 w-4" />
      </button>
    </form>
  );
} 