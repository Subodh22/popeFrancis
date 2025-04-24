"use client";

import React, { useState, useRef, useEffect } from "react";
import { SendIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const DEBOUNCE_TIME = 1000; // 1 second
  
  // Log isLoading state for debugging
  useEffect(() => {
    console.log("ChatInput isLoading:", isLoading);
  }, [isLoading]);
  
  // Automatically adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);
  
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
      {isLoading && (
        <div className="absolute -top-6 left-0 right-0 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-50 dark:bg-gray-700 px-3 py-1 rounded-full shadow-sm">
            <Spinner size="sm" />
            <span className="text-xs text-yellow-800 dark:text-yellow-200">Pope Francis is typing...</span>
          </div>
        </div>
      )}
      <div className="relative flex items-center rounded-xl border dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:focus-within:ring-blue-400 bg-white dark:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow">
        <textarea
          ref={textareaRef}
          className="flex-1 p-3 pl-4 border-none focus:outline-none bg-transparent text-gray-900 dark:text-gray-100 resize-none max-h-36"
          value={input}
          onChange={handleInputChange}
          placeholder="Message Pope Francis..."
          rows={1}
          onKeyDown={onKeyDown}
          style={{ minHeight: "50px" }}
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={isLoading || !input.trim() || (Date.now() - lastSubmitTime < DEBOUNCE_TIME)}
          className={`p-2 mr-2 rounded-full ${
            isLoading 
              ? 'bg-gray-300 dark:bg-gray-600' 
              : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
          } text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95`}
        >
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <SendIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </form>
  );
} 