import { addDocument, getDocuments, deleteDocument, updateDocument } from "../firebase/firebaseUtils";
import { Message } from "ai";

const COLLECTION_NAME = "pope_francis_conversations";
const MAX_CONVERSATIONS_PER_USER = 10; // Limit the number of conversations per user
const MAX_MESSAGES_PER_CONVERSATION = 50; // Limit the number of messages per conversation

export interface ConversationData {
  userId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Save a new conversation or update an existing one with quota management
 */
export async function saveConversation(userId: string, messages: Message[], conversationId?: string): Promise<string> {
  try {
    const now = Date.now();
    
    // Trim messages array to prevent excessive storage
    const trimmedMessages = messages.slice(-MAX_MESSAGES_PER_CONVERSATION);
    
    if (conversationId) {
      // Update existing conversation
      await updateDocument(COLLECTION_NAME, conversationId, { 
        messages: trimmedMessages, 
        updatedAt: now 
      });
      return conversationId;
    } else {
      // First check if user has too many conversations
      const existingConversations = await getUserConversations(userId);
      
      // If user has more than the maximum conversations, delete the oldest ones
      if (existingConversations.length >= MAX_CONVERSATIONS_PER_USER) {
        // Sort by updatedAt (oldest first)
        const sortedConversations = existingConversations.sort((a, b) => a.updatedAt - b.updatedAt);
        
        // Delete oldest conversations to maintain the limit
        const conversationsToDelete = sortedConversations.slice(
          0, 
          existingConversations.length - MAX_CONVERSATIONS_PER_USER + 1
        );
        
        await Promise.all(
          conversationsToDelete.map(conv => deleteConversation(conv.id))
        );
      }
      
      // Create new conversation
      const data: ConversationData = {
        userId,
        messages: trimmedMessages,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDocument(COLLECTION_NAME, data);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error in saveConversation:", error);
    // Return a fallback ID or the existing ID if there's an error
    return conversationId || "local-" + Date.now();
  }
}

/**
 * Get all conversations for a user with error handling
 */
export async function getUserConversations(userId: string): Promise<(ConversationData & { id: string })[]> {
  try {
    const allConversations = await getDocuments(COLLECTION_NAME);
    return allConversations
      .filter(conv => {
        // Cast to any/unknown first to avoid type errors
        const typedConv = conv as unknown as ConversationData & { id: string };
        return typedConv.userId === userId;
      })
      .sort((a, b) => {
        // Cast to any/unknown first to avoid type errors
        const typedA = a as unknown as ConversationData;
        const typedB = b as unknown as ConversationData;
        return typedB.updatedAt - typedA.updatedAt;
      }) as (ConversationData & { id: string })[];
  } catch (error) {
    console.error("Error getting user conversations:", error);
    return []; // Return empty array on error
  }
}

/**
 * Delete a conversation with error handling
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  try {
    await deleteDocument(COLLECTION_NAME, conversationId);
  } catch (error) {
    console.error("Error deleting conversation:", error);
  }
}

/**
 * Clear all conversations for a user with error handling
 */
export async function clearUserConversations(userId: string): Promise<void> {
  try {
    const conversations = await getUserConversations(userId);
    
    // Delete each conversation
    await Promise.all(
      conversations.map(conv => deleteConversation(conv.id))
    );
  } catch (error) {
    console.error("Error clearing user conversations:", error);
  }
} 