"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Message, ChatRequestOptions } from "ai";
import ProactiveEngagement from "../ProactiveEngagement";
import { useAuth } from "@/lib/hooks/useAuth";
import { saveConversation, getUserConversations, clearUserConversations } from "@/lib/services/chatService";
import LoginPrompt from "../user/LoginPrompt";
import { useTheme } from "next-themes";
import { v4 as uuidv4 } from "uuid";
import { Spinner } from "@/components/ui/spinner";

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions) => void;
  isLoading: boolean;
}

export default function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevMessageLengthRef = useRef<number>(0);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const { theme, setTheme } = useTheme();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  
  // Initialize chat with welcome message
  const initialMessages: Message[] = [
    {
      id: "welcome",
      role: "assistant",
      content: "Greetings, my dear friend! Pope Francis here, reaching out from the Vatican with a heart full of joy. I'm delighted to connect with you today in this digital piazza. How is your spirit? I've been contemplating the beauty of creation while tending to my small garden - even Popes need moments of tranquility! Perhaps you have questions about faith, social justice, or maybe you'd like to discuss the simple joys of life? I'm here to listen and share in our journey of faith together."
    }
  ];

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: "/api/openai/chat",
    onFinish: () => {
      setIsTyping(false);
      smoothScrollToBottom();
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setIsTyping(false);
    },
    id: conversationId || undefined,
    body: {
      userId: user?.uid
    },
    onResponse: (response) => {
      // Set typing indicator when we get a response
      setIsTyping(true);
    }
  });

  const [isTyping, setIsTyping] = useState(false);

  // Track message changes for scrolling
  useEffect(() => {
    const currentMessagesLength = messages.length;
    
    // If new message added
    if (currentMessagesLength > prevMessageLengthRef.current) {
      smoothScrollToBottom();
    } 
    // If content of the last message changed (streaming)
    else if (
      currentMessagesLength > 0 && 
      prevMessageLengthRef.current > 0 &&
      currentMessagesLength === prevMessageLengthRef.current
    ) {
      const lastMessageContent = messages[currentMessagesLength - 1].content || "";
      smoothScrollToBottom();
    }
    
    prevMessageLengthRef.current = currentMessagesLength;
  }, [messages]);

  // Track loading state for typing indicator
  useEffect(() => {
    setIsTyping(isLoading);
  }, [isLoading]);

  const smoothScrollToBottom = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end' 
        });
      }
    }, 100);
  }, []);

  // Save messages to Firebase
  const saveMessageToFirebase = async (messagesToSave: Message[]) => {
    if (!user) return;
    
    try {
      // Ensure messages have all required fields
      const validMessages = messagesToSave.map(msg => ({
        id: msg.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        role: msg.role,
        content: msg.content || ""
      }));
      
      const savedId = await saveConversation(
        user.uid,
        validMessages,
        conversationId
      );
      
      if (!conversationId) {
        setConversationId(savedId);
      }
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  };

  // Load most recent conversation from Firebase
  useEffect(() => {
    const loadConversation = async () => {
      if (!user || authLoading) return;
      
      try {
        setLoading(true);
        // Always start with a new conversation
        setMessages(initialMessages);
        setConversationId(undefined);
        prevMessageLengthRef.current = initialMessages.length;
        
        // Save initial message to Firebase
        await saveMessageToFirebase(initialMessages);
      } catch (error) {
        console.error("Error setting up new conversation:", error);
        setMessages(initialMessages);
        prevMessageLengthRef.current = initialMessages.length;
      } finally {
        setLoading(false);
      }
    };
    
    loadConversation();
  }, [user, authLoading, setMessages]);

  // Handle proactive conversation initiation
  const handleProactiveMessage = (content: string) => {
    const newMessage: Message = {
      id: `proactive-${Date.now()}`,
      role: "assistant",
      content
    };
    
    // Add the message to the chat
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    // Save to Firebase if user is logged in
    if (user) {
      saveMessageToFirebase(updatedMessages);
    }
  };

  // Handle clearing conversation history
  const handleClearHistory = async () => {
    if (user) {
      try {
        await clearUserConversations(user.uid);
      } catch (error) {
        console.error("Error clearing conversations:", error);
      }
    }
    
    // Reset UI state
    setMessages(initialMessages);
    setConversationId(undefined);
    prevMessageLengthRef.current = initialMessages.length;
    
    // Save initial message to Firebase if user is logged in
    if (user) {
      saveMessageToFirebase(initialMessages);
    }
  };

  const submitMessage = useCallback(
    (e: React.FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions) => {
      e.preventDefault();
      
      if (!input.trim()) return;
      
      // We'll let the useChat hook handle adding the message to the messages array
      // This prevents duplicate messages
      handleSubmit(e, chatRequestOptions);
    },
    [input, handleSubmit]
  );

  // Save messages to Firebase whenever they change
  useEffect(() => {
    // Skip initial messages or when loading
    if (messages.length === 0 || loading || authLoading || !user) return;
    
    // Skip if only welcome message
    if (messages.length === 1 && messages[0].id === "welcome") return;
    
    // Save to Firebase
    saveMessageToFirebase(messages);
  }, [messages, loading, authLoading, user]);

  // If still loading authentication, show loading spinner
  if (authLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // If not logged in, show login prompt
  if (!user) {
    return <LoginPrompt />;
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      {/* Include the ProactiveEngagement component */}
      <ProactiveEngagement onInitiateConversation={handleProactiveMessage} />
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 chat-container chat-height"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div className="max-w-md py-8 px-4">
              <h2 className="text-2xl font-bold mb-4">
                Welcome to Chat with Pope Francis
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Ask me anything! From deep theological questions to my Vatican Wi-Fi password (which I won&apos;t give you, but nice try). I&apos;m here to provide divine wisdom with a side of papal humor.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pt-8 pb-24">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id || `msg-${index}`}
                role={message.role}
                content={message.content}
                isStreaming={isTyping && index === messages.length - 1 && message.role === 'assistant'}
              />
            ))}
            <div ref={messagesEndRef} className="chat-scroll-anchor" />
          </div>
        )}
      </div>
      
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <div>
            <button
              onClick={() => {
                setMessages(initialMessages);
                setConversationId(undefined);
                prevMessageLengthRef.current = initialMessages.length;
                if (user) {
                  saveMessageToFirebase(initialMessages);
                }
              }}
              className="text-xs text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              New Chat
            </button>
          </div>
          <button
            onClick={handleClearHistory}
            className="text-xs text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          >
            Clear conversation
          </button>
        </div>
        <ChatInput 
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={submitMessage}
          isLoading={isLoading || isTyping}
        />
      </div>
    </div>
  );
} 