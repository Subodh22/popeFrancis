import { useState, useEffect } from 'react';
import { Message } from 'ai';

const STORAGE_KEY = 'pope-francis-conversation-history';

export function useConversationHistory() {
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load conversation history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save conversation history to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && history.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error('Error saving conversation history:', error);
      }
    }
  }, [history, isLoaded]);

  // Add a new message to the history
  const addMessage = (message: Message) => {
    setHistory((prevHistory) => [...prevHistory, message]);
  };

  // Add multiple messages to the history
  const addMessages = (messages: Message[]) => {
    setHistory((prevHistory) => [...prevHistory, ...messages]);
  };

  // Clear the conversation history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    addMessage,
    addMessages,
    clearHistory,
    isLoaded,
  };
} 