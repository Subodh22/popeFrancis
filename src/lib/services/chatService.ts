import { addDocument, getDocuments, deleteDocument, updateDocument } from "../firebase/firebaseUtils";
import { Message } from "ai";

const COLLECTION_NAME = "pope_francis_conversations";

export interface ConversationData {
  userId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Save a new conversation or update an existing one
 */
export async function saveConversation(userId: string, messages: Message[], conversationId?: string): Promise<string> {
  const now = Date.now();
  
  if (conversationId) {
    // Update existing conversation
    await updateDocument(COLLECTION_NAME, conversationId, { 
      messages, 
      updatedAt: now 
    });
    return conversationId;
  } else {
    // Create new conversation
    const data: ConversationData = {
      userId,
      messages,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDocument(COLLECTION_NAME, data);
    return docRef.id;
  }
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(userId: string): Promise<(ConversationData & { id: string })[]> {
  const allConversations = await getDocuments(COLLECTION_NAME);
  return allConversations
    .filter(conv => conv.userId === userId)
    .sort((a, b) => b.updatedAt - a.updatedAt) as (ConversationData & { id: string })[];
}

/**
 * Delete a conversation
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  await deleteDocument(COLLECTION_NAME, conversationId);
}

/**
 * Clear all conversations for a user
 */
export async function clearUserConversations(userId: string): Promise<void> {
  const conversations = await getUserConversations(userId);
  
  // Delete each conversation
  await Promise.all(
    conversations.map(conv => deleteConversation(conv.id))
  );
} 