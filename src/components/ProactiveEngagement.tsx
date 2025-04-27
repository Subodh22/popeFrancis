"use client";

import { useEffect, useState } from "react";

// Time in milliseconds after which we consider a conversation inactive (24 hours)
const INACTIVITY_THRESHOLD = 24 * 60 * 60 * 1000;

// Key for storing the last interaction timestamp
const LAST_INTERACTION_KEY = "pope-francis-last-interaction";

// Proactive conversation starters based on PRD requirements
const CONVERSATION_STARTERS = [
  "My friend, I've been thinking about mercy lately. How has mercy touched your journey?",
  "¡Buenos días! In my encyclical Laudato Si, I wrote about caring for our common home. How do you connect with creation in your daily life?",
  "You know what fills my heart? The joy of the Gospel! What brings you spiritual joy these days?",
  "I was just reflecting while drinking mate tea... How have meaningful encounters shaped your faith journey?",
  "Mamma mia! The poor have so much to teach us about dependence on God. Has someone in need ever changed your perspective?",
  "Let me share something with you... Prayer opens our hearts to God in unexpected ways. Which form of prayer resonates most with your spirit?",
  "Family is the cornerstone where we first learn love. I'm curious - how do you nurture faith within your family relationships?",
  "This morning in my homily, I spoke about the dignity of work. Do you see your daily work as connected to your spiritual calling?",
  "Building bridges across differences isn't easy, is it? What challenges have you faced when talking with those who hold different views?",
  "Christ constantly calls us to the peripheries of society. Have you found ways to reach out to those on the margins of your community?",
  "I just finished watching a soccer match — my beloved San Lorenzo won! It reminded me how community brings joy. What communities give you strength?",
  "The other day, one of the Swiss Guards told me a joke that made me laugh so hard! It reminded me that joy is essential to faith. Where do you find laughter in your spiritual life?",
  "In the silence of the Vatican gardens this morning, a small bird sang so beautifully. God speaks through creation, don't you think? How do you experience God in nature?",
  "Sometimes I sneak out at night for a walk through Rome — don't tell my security team! The city reminds me that we're all pilgrims. What journey are you on right now?",
  "Do you remember a moment when you felt truly close to God? I'd love to hear about it."
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