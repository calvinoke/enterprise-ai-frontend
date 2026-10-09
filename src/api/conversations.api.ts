import apiClient from "./client";


// ==========================================================
// TYPES
// ==========================================================

export interface Conversation {
  id: string;
  title: string;
  provider: string;
  model: string;
  created_at: string;
}


export interface Message {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  tokens: number;
  latency_ms: number;
  created_at: string;
}


export interface ChatResponse {
  conversation_id: string;
  question: string;
  answer: string;
  provider: string;
  model: string;
}


// ==========================================================
// CREATE CONVERSATION
// ==========================================================

export async function createConversation(
  title: string,
): Promise<Conversation> {

  const response =
    await apiClient.post<Conversation>(
      "/conversations/",
      {
        title,
      },
    );

  return response.data;
}


// ==========================================================
// LIST CONVERSATIONS
// ==========================================================

export async function getConversations():
  Promise<Conversation[]> {

  const response =
    await apiClient.get<Conversation[]>(
      "/conversations/",
    );

  return response.data;
}


// ==========================================================
// GET CONVERSATION
// ==========================================================

export async function getConversation(
  conversationId: string,
): Promise<Conversation> {

  const response =
    await apiClient.get<Conversation>(
      `/conversations/${conversationId}`,
    );

  return response.data;
}


// ==========================================================
// GET MESSAGES
// ==========================================================

export async function getMessages(
  conversationId: string,
): Promise<Message[]> {

  const response =
    await apiClient.get<Message[]>(
      `/conversations/${conversationId}/messages`,
    );

  return response.data;
}


// ==========================================================
// ADD MESSAGE
// ==========================================================

export async function addMessage(
  conversationId: string,
  content: string,
): Promise<Message> {

  const response =
    await apiClient.post<Message>(
      `/conversations/${conversationId}/messages`,
      {
        content,
      },
    );

  return response.data;
}


// ==========================================================
// CHAT WITH AI
// ==========================================================

export async function chatWithAI(
  conversationId: string,
  question: string,
  documentId?: string | null,
): Promise<ChatResponse> {

  const response =
    await apiClient.post<ChatResponse>(
      `/conversations/${conversationId}/chat`,
      {
        question,
        document_id:
          documentId || null,
      },
    );

  return response.data;
}


// ==========================================================
// DELETE CONVERSATION
// ==========================================================

export async function deleteConversation(
  conversationId: string,
): Promise<{ message: string }> {

  const response =
    await apiClient.delete<{
      message: string;
    }>(
      `/conversations/${conversationId}`,
    );

  return response.data;
}