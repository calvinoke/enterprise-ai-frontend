import apiClient from "./client";


// ==========================================================
// EMBEDDING HEALTH
// ==========================================================

export interface EmbeddingHealthResponse {
  status: string;
  provider: string;
  model: string;
  dimension: number;
  initialized: boolean;
}


export async function getEmbeddingHealth():
  Promise<EmbeddingHealthResponse> {

  const response =
    await apiClient.get<EmbeddingHealthResponse>(
      "/embeddings/health",
    );

  return response.data;
}


// ==========================================================
// EMBEDDING SERVICE INFO
// ==========================================================

export interface EmbeddingInfoResponse {
  service: string;
  provider: string;
  model: string;
  dimension: number;
  initialized: boolean;
  cache: Record<string, number>;
}


export async function getEmbeddingInfo():
  Promise<EmbeddingInfoResponse> {

  const response =
    await apiClient.get<EmbeddingInfoResponse>(
      "/embeddings/info",
    );

  return response.data;
}


// ==========================================================
// GENERATE EMBEDDING
// ==========================================================

export interface EmbeddingResponse {
  provider: string;
  model: string;
  dimension: number;
  embedding: number[];
}


export async function generateEmbedding(
  text: string,
): Promise<EmbeddingResponse> {

  const response =
    await apiClient.post<EmbeddingResponse>(
      "/embeddings/generate",
      {
        text,
      },
    );

  return response.data;
}


// ==========================================================
// SIMILARITY
// ==========================================================

export interface SimilarityResponse {
  text1: string;
  text2: string;
  similarity_score: number;
  provider: string;
  model: string;
}


export async function calculateSimilarity(
  text1: string,
  text2: string,
): Promise<SimilarityResponse> {

  const response =
    await apiClient.post<SimilarityResponse>(
      "/embeddings/similarity",
      {
        text1,
        text2,
      },
    );

  return response.data;
}


// ==========================================================
// LLM GENERATION
// ==========================================================

export interface LLMGenerateRequest {
  prompt: string;
  system_prompt?: string | null;
  temperature?: number;
  max_tokens?: number;
}


export interface LLMGenerateResponse {
  prompt: string;
  response: string;
  provider: string;
  model: string;
  temperature: number;
  max_tokens: number;
}


export async function generateLLM(
  request: LLMGenerateRequest,
): Promise<LLMGenerateResponse> {

  const response =
    await apiClient.post<LLMGenerateResponse>(
      "/llm/generate",
      {
        prompt:
          request.prompt,

        system_prompt:
          request.system_prompt ?? null,

        temperature:
          request.temperature ?? 0.2,

        max_tokens:
          request.max_tokens ?? 1024,
      },
    );

  return response.data;
}