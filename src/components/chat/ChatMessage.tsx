"use client";

import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant" | "system" | "function" | "data" | "tool";
  content: string;
  isStreaming?: boolean;
}

export default function ChatMessage({ role, content, isStreaming = false }: ChatMessageProps) {
  const isUser = role === "user";
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Effect to auto-scroll when content changes during streaming
  useEffect(() => {
    if (isStreaming && !isUser && contentRef.current) {
      const container = contentRef.current;
      // Force a re-render to make content visible
      container.style.opacity = '1';
    }
  }, [content, isStreaming, isUser]);
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"} items-start gap-2`}>
        <Avatar className="w-8 h-8 mt-0.5 shadow-md">
          {!isUser ? (
            <AvatarImage src="/pope-francis.jpg" alt="Pope Francis" />
          ) : null}
          <AvatarFallback>{isUser ? "You" : "PF"}</AvatarFallback>
        </Avatar>
        
        <div 
          ref={contentRef}
          className={`px-4 py-3 rounded-lg shadow-sm ${
            isUser 
              ? "bg-blue-600 text-white rounded-tr-none" 
              : "bg-white border border-gray-200 text-gray-800 rounded-tl-none dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          } ${isStreaming && !isUser ? 'message-typing' : ''}`}
        >
          <ReactMarkdown 
            className="prose max-w-none dark:prose-invert prose-p:my-1 prose-headings:my-2" 
            components={{
              // Customize link styling
              a: ({node, ...props}) => (
                <a 
                  {...props} 
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
                  target="_blank" 
                  rel="noopener noreferrer"
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
          {isStreaming && !isUser && (
            <span className="typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 