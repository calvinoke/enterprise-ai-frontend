import apiClient from "./client";


// ==========================================================
// TYPES
// ==========================================================

export interface RAGSearchRequest {
  query: string;
  top_k?: number;
  document_id?: string | null;
  similarity_threshold?: number;
}


export interface RAGSearchResult {
  chunk_id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  similarity: number;
}


export interface RAGSearchResponse {
  query: string;
  provider: string;
  model: string;
  dimension: number;
  results: RAGSearchResult[];
  count: number;
}


// ==========================================================
// SEMANTIC SEARCH
// ==========================================================

export async function searchRAG(
  request: RAGSearchRequest,
): Promise<RAGSearchResponse> {

  const response =
    await apiClient.post<RAGSearchResponse>(
      "/rag/search",
      {
        query: request.query,
        top_k: request.top_k ?? 5,
        document_id:
          request.document_id || null,
        similarity_threshold:
          request.similarity_threshold ?? 0.5,
      },
    );

  return response.data;
}