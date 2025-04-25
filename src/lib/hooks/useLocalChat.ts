"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Message } from 'ai';

export function useLocalChat(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const initialLoadDone = useRef(false);
  
  // Load messages from sessionStorage on initial render
  useEffect(() => {
    if (typeof window === 'undefined' || initialLoadDone.current) return;
    
    try {
      // Generate a session ID if none exists
      let sessionId = sessionStorage.getItem('currentChatSessionId');
      if (!sessionId) {
        sessionId = `session_${Date.now()}`;
        sessionStorage.setItem('currentChatSessionId', sessionId);
      }
      setConversationId(sessionId);
      
      // Try to load existing messages
      const savedMessages = sessionStorage.getItem(`chat_${sessionId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else if (initialMessages.length > 0) {
        // If no saved messages but we have initial messages, use those
        setMessages(initialMessages);
        sessionStorage.setItem(`chat_${sessionId}`, JSON.stringify(initialMessages));
      }
      
      initialLoadDone.current = true;
    } catch (error) {
      console.error('Error loading chat from session storage:', error);
    }
  }, [initialMessages]);
  
  // We've removed the save effect to avoid circular updates
  // The parent component will handle saving to storage
  
  // Clear current conversation
  const clearConversation = useCallback(() => {
    if (typeof window === 'undefined' || !conversationId) return;
    
    try {
      sessionStorage.removeItem(`chat_${conversationId}`);
      setMessages(initialMessages);
      
      // Create a new session ID
      const newSessionId = `session_${Date.now()}`;
      sessionStorage.setItem('currentChatSessionId', newSessionId);
      setConversationId(newSessionId);
      
      // Save initial messages to the new session
      if (initialMessages.length > 0) {
        sessionStorage.setItem(`chat_${newSessionId}`, JSON.stringify(initialMessages));
      }
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  }, [conversationId, initialMessages]);
  
  return {
    messages,
    setMessages,
    conversationId,
    clearConversation
  };
} 