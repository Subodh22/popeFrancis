"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Message, ChatRequestOptions } from "ai";
import ProactiveEngagement from "../ProactiveEngagement";
import { useAuth } from "@/lib/hooks/useAuth";
import LoginPrompt from "../user/LoginPrompt";
import { useTheme } from "next-themes";
import { v4 as uuidv4 } from "uuid";
import { Spinner } from "@/components/ui/spinner";
import { useLocalChat } from "@/lib/hooks/useLocalChat";

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
  const { user, loading: authLoading, authError } = useAuth();
  const [loading, setLoading] = useState(true);
  const [skippedAuth, setSkippedAuth] = useState(false);
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

  // Use local chat storage hook
  const localChat = useLocalChat(initialMessages);

  // Chat rate limiting for extreme usage
  const [messageCount, setMessageCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const RATE_LIMIT_THRESHOLD = 50; // Number of messages before rate limiting
  const RATE_LIMIT_RESET_TIME = 1000 * 60 * 10; // 10 minutes in milliseconds

  // Define smoothScrollToBottom function first
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

  // Check for rate limiting
  const checkRateLimit = useCallback(() => {
    if (messageCount > RATE_LIMIT_THRESHOLD && !isRateLimited) {
      setIsRateLimited(true);
      
      // Reset rate limit after timeout
      setTimeout(() => {
        setIsRateLimited(false);
        setMessageCount(0);
      }, RATE_LIMIT_RESET_TIME);
      
      return true;
    }
    return false;
  }, [messageCount, isRateLimited, RATE_LIMIT_RESET_TIME]);

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
      console.log("Chat response finished");
      setIsTyping(false);
      smoothScrollToBottom();
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setIsTyping(false);
    },
    id: localChat.conversationId,
    body: {
      userId: user?.uid
    },
    onResponse: (response) => {
      // Set typing indicator when we get a response
      console.log("Chat response received:", response.status);
      if (response.status === 200) {
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
    },
    initialMessages: localChat.messages
  });

  const [isTyping, setIsTyping] = useState(false);

  // Log isTyping and isLoading changes for debugging
  useEffect(() => {
    console.log("isTyping changed:", isTyping);
  }, [isTyping]);

  useEffect(() => {
    console.log("isLoading changed:", isLoading);
  }, [isLoading]);

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
    
    // Update local storage with latest messages
    if (messages.length > 0) {
      localChat.setMessages(messages);
    }
  }, [messages, localChat, smoothScrollToBottom]);

  // Track loading state for typing indicator
  useEffect(() => {
    if (isLoading !== undefined) {
      console.log("Setting isTyping based on isLoading:", isLoading);
      setIsTyping(isLoading);
    }
  }, [isLoading]);

  // Initial load effect
  useEffect(() => {
    // After a short delay, set loading to false
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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
  };

  // Handle clearing conversation history
  const handleClearHistory = async () => {
    // Reset UI state
    setMessages(initialMessages);
    localChat.clearConversation();
    prevMessageLengthRef.current = initialMessages.length;
    // Reset message count for rate limiting
    setMessageCount(0);
  };

  const submitMessage = useCallback(
    (e: React.FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions) => {
      e.preventDefault();
      
      if (!input.trim()) return;

      // Check for rate limiting
      if (checkRateLimit()) {
        // Add a system message informing the user they're rate limited
        const rateLimitMessage: Message = {
          id: `ratelimit-${Date.now()}`,
          role: "system",
          content: "You've sent too many messages in a short period. Please wait a few minutes before sending more messages."
        };
        setMessages([...messages, rateLimitMessage]);
        return;
      }
      
      // Increment message count for rate limiting
      setMessageCount(prev => prev + 1);
      
      // We'll let the useChat hook handle adding the message to the messages array
      // This prevents duplicate messages
      handleSubmit(e, chatRequestOptions);
    },
    [input, handleSubmit, messages, checkRateLimit, setMessages]
  );

  // If still loading authentication, show loading spinner but only briefly
  useEffect(() => {
    if (authLoading) {
      // Set a maximum wait time for auth loading
      const authTimeout = setTimeout(() => {
        // Force loading to false after 3 seconds, even if auth is still loading
        setLoading(false);
      }, 3000);
      
      return () => clearTimeout(authTimeout);
    } else {
      // If auth is not loading, set loading to false immediately
      setLoading(false);
    }
  }, [authLoading]);

  // Check if authentication has been skipped
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSkippedAuth = sessionStorage.getItem('pope_francis_skip_auth') === 'true';
      setSkippedAuth(hasSkippedAuth);
    }
  }, []);

  // Modified loading check - only show spinner during initial load and respect skipped auth
  if (loading && !skippedAuth) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Skip login prompt if authentication is skipped
  const shouldShowChat = skippedAuth || user;
  
  // If not authenticated and not skipped, show login prompt outside of message area
  if (!shouldShowChat && !authLoading) {
    return (
      <div className="flex flex-col h-full max-w-3xl mx-auto">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="h-full flex items-center justify-center">
            <div className="max-w-md p-6 bg-white rounded-lg shadow-sm border">
              <h2 className="text-2xl font-bold mb-4 text-center">Welcome to Pope Francis Chat</h2>
              <p className="mb-6 text-gray-600 text-center">
                Sign in to start a conversation with Pope Francis and save your chat history.
              </p>
              {authError && (
                <div className="mb-4 p-3 bg-amber-50 text-amber-600 rounded-md text-sm">
                  {authError}
                </div>
              )}
              <LoginPrompt />
            </div>
          </div>
        </div>
      </div>
    );
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
              {!user && authLoading && (
                <div className="mt-4 flex justify-center">
                  <span className="text-sm text-gray-500">Authentication in progress...</span>
                </div>
              )}
              {!user && !authLoading && (
                <div className="mt-4">
                  {authError && (
                    <div className="mb-3 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                      {authError}
                    </div>
                  )}
                  <LoginPrompt compact={true} />
                </div>
              )}
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
                localChat.clearConversation();
                prevMessageLengthRef.current = initialMessages.length;
                setMessageCount(0);
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