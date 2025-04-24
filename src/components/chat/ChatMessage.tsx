"use client";

import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/lib/hooks/useAuth";

interface ChatMessageProps {
  role: "user" | "assistant" | "system" | "function" | "data" | "tool";
  content: string;
  isStreaming?: boolean;
}

export default function ChatMessage({ role, content, isStreaming = false }: ChatMessageProps) {
  const isUser = role === "user";
  const contentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Effect to auto-scroll when content changes during streaming
  useEffect(() => {
    if (isStreaming && !isUser && contentRef.current) {
      const container = contentRef.current;
      // Force a re-render to make content visible
      container.style.opacity = '1';
    }
  }, [content, isStreaming, isUser]);
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-5 group`}>
      <div className={`flex max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"} items-start gap-3`}>
        <div className={`relative ${isUser ? 'mt-1' : 'mt-1'}`}>
          <Avatar className={`w-9 h-9 shadow-md transform transition-transform duration-200 group-hover:scale-110 ${!isUser ? 'ring-2 ring-yellow-400 ring-offset-2 dark:ring-offset-gray-800' : ''}`}>
            {!isUser ? (
              <div className="w-full h-full bg-white flex items-center justify-center overflow-hidden">
                <img 
                  src="/pope-francis-new.jpg" 
                  alt="Pope Francis" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : user?.photoURL ? (
              <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
            ) : null}
            {isUser && (
              <AvatarFallback className="bg-blue-600 text-white">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        
        <div 
          ref={contentRef}
          className={`px-5 py-3.5 rounded-2xl shadow-sm transition-all duration-200 ${
            isUser 
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-none border border-blue-400" 
              : "bg-white border border-gray-200 text-gray-800 rounded-tl-none dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          } ${isStreaming && !isUser ? 'message-typing' : ''} group-hover:shadow-md`}
        >
          <ReactMarkdown 
            className="prose max-w-none dark:prose-invert prose-p:my-1 prose-headings:my-2" 
            components={{
              // Customize link styling
              a: ({node, ...props}) => (
                <a 
                  {...props} 
                  className="text-blue-200 underline hover:text-white dark:text-blue-300 dark:hover:text-blue-200"
                  target="_blank" 
                  rel="noopener noreferrer"
                />
              ),
              // Customize paragraph spacing
              p: ({node, ...props}) => (
                <p {...props} className="mb-2 last:mb-0" />
              )
            }}
          >
            {content}
          </ReactMarkdown>
          {isStreaming && !isUser && (
            <span className="typing-indicator ml-1 mt-1">
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