"use client";

import { useEffect, useState } from "react";

// Time in milliseconds after which we consider a conversation inactive (24 hours)
const INACTIVITY_THRESHOLD = 24 * 60 * 60 * 1000;

// Key for storing the last interaction timestamp
const LAST_INTERACTION_KEY = "pope-francis-last-interaction";

// Proactive conversation starters based on PRD requirements
const CONVERSATION_STARTERS = [
  "I've been reflecting on the importance of mercy in our lives. How has mercy touched your journey?",
  "In Laudato Si, I wrote about caring for our common home. How do you connect with creation in your daily life?",
  "The joy of the Gospel fills the hearts of those who encounter Jesus. What brings you spiritual joy?",
  "I often speak about the culture of encounter. How have meaningful encounters shaped your faith?",
  "The poor have much to teach us about dependence on God. How have the marginalized influenced your perspective?",
  "Prayer opens our hearts to God's presence. What form of prayer speaks most deeply to you?",
  "Family is a foundation of society. How do you nurture faith within your family relationships?",
  "The dignity of work is central to human flourishing. How do you view your work as a spiritual calling?",
  "Dialogue across differences builds peace. What challenges have you faced in conversations with those who disagree?",
  "Christ calls us to the peripheries. How might you reach out to those on the margins of your community?"
];

interface ProactiveEngagementProps {
  onInitiateConversation: (message: string) => void;
}

export default function ProactiveEngagement({ onInitiateConversation }: ProactiveEngagementProps) {
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Check if we should initiate a conversation
    const checkForInactivity = () => {
      try {
        const lastInteraction = localStorage.getItem(LAST_INTERACTION_KEY);
        
        if (!lastInteraction) {
          // First visit, just set the timestamp
          localStorage.setItem(LAST_INTERACTION_KEY, Date.now().toString());
          return;
        }
        
        const lastInteractionTime = parseInt(lastInteraction);
        const currentTime = Date.now();
        const timeSinceLastInteraction = currentTime - lastInteractionTime;
        
        // If inactive for more than the threshold, initiate a conversation
        if (timeSinceLastInteraction > INACTIVITY_THRESHOLD) {
          // Select a random conversation starter
          const randomIndex = Math.floor(Math.random() * CONVERSATION_STARTERS.length);
          const startMessage = CONVERSATION_STARTERS[randomIndex];
          
          // Update the timestamp and trigger the conversation
          localStorage.setItem(LAST_INTERACTION_KEY, currentTime.toString());
          onInitiateConversation(startMessage);
        }
      } catch (error) {
        console.error("Error checking for inactivity:", error);
      } finally {
        setHasChecked(true);
      }
    };
    
    // Only run once when the component mounts
    if (!hasChecked) {
      checkForInactivity();
    }
  }, [hasChecked, onInitiateConversation]);
  
  // Record user activity
  useEffect(() => {
    const recordActivity = () => {
      try {
        localStorage.setItem(LAST_INTERACTION_KEY, Date.now().toString());
      } catch (error) {
        console.error("Error recording activity:", error);
      }
    };
    
    // Update last interaction time when user interacts with the page
    window.addEventListener("click", recordActivity);
    window.addEventListener("keydown", recordActivity);
    
    return () => {
      window.removeEventListener("click", recordActivity);
      window.removeEventListener("keydown", recordActivity);
    };
  }, []);
  
  // This component has no UI, it just manages the proactive engagement
  return null;
} 