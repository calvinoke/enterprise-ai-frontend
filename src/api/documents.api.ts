import apiClient from "./client";


// ==========================================================
// TYPES
// ==========================================================

export type DocumentStatus =
  | "pending"
  | "processing"
  | "ready"
  | "failed";


export type DocumentType =
  | "pdf"
  | "docx"
  | "txt"
  | "md";


export interface DocumentResponse {
  id: string;
  filename: string;
  original_filename: string;
  document_type: DocumentType;
  status: DocumentStatus;
  content: string | null;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}


export interface DocumentUploadResponse {
  id: string;
  filename: string;
  original_filename: string;
  document_type: DocumentType;
  status: DocumentStatus;
  created_at: string;
}


// ==========================================================
// UPLOAD
// ==========================================================

export async function uploadDocument(
  file: File,
): Promise<DocumentUploadResponse> {

  const formData = new FormData();

  formData.append(
    "file",
    file,
  );

  const response =
    await apiClient.post<DocumentUploadResponse>(
      "/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

  return response.data;
}


// ==========================================================
// LIST
// ==========================================================

export async function getDocuments():
  Promise<DocumentResponse[]> {

  const response =
    await apiClient.get<DocumentResponse[]>(
      "/documents/",
    );

  return response.data;
}


// ==========================================================
// GET ONE DOCUMENT
// ==========================================================

export async function getDocument(
  documentId: string,
): Promise<DocumentResponse> {

  const response =
    await apiClient.get<DocumentResponse>(
      `/documents/${documentId}`,
    );

  return response.data;
}


// ==========================================================
// PROCESS
// ==========================================================

export async function processDocument(
  documentId: string,
): Promise<DocumentResponse> {

  const response =
    await apiClient.post<DocumentResponse>(
      `/documents/${documentId}/process`,
    );

  return response.data;
}


// ==========================================================
// DELETE
// ==========================================================

export async function deleteDocument(
  documentId: string,
): Promise<{ message: string }> {

  const response =
    await apiClient.delete<{
      message: string;
    }>(
      `/documents/${documentId}`,
    );

  return response.data;
}