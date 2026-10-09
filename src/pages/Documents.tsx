import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getApiErrorMessage,
} from "../utils/apiError";

import {
  deleteDocument,
  getDocument,
  getDocuments,
  processDocument,
  uploadDocument,
  type DocumentResponse,
} from "../api/documents.api";


export default function Documents() {

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);


  const [
    documents,
    setDocuments,
  ] = useState<DocumentResponse[]>([]);

  const [
    selectedDocument,
    setSelectedDocument,
  ] = useState<DocumentResponse | null>(
    null,
  );

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isUploading,
    setIsUploading,
  ] = useState(false);

  const [
    processingId,
    setProcessingId,
  ] = useState<string | null>(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");


  // ==========================================================
  // LOAD DOCUMENTS
  // ==========================================================

  async function loadDocuments() {

    try {

      setIsLoading(true);
      setError("");

      const data =
        await getDocuments();

      setDocuments(data);

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Unable to load documents.",
        ),
      );

    } finally {

      setIsLoading(false);

    }
  }


  useEffect(() => {

    void loadDocuments();

  }, []);


  // ==========================================================
  // FILE SELECTION
  // ==========================================================

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {

    const file =
      event.target.files?.[0] || null;

    setSelectedFile(file);
    setError("");
    setSuccess("");
  }


  // ==========================================================
  // UPLOAD
  // ==========================================================

  async function handleUpload() {

    if (!selectedFile) {

      setError(
        "Please select a document first.",
      );

      return;
    }


    try {

      setIsUploading(true);
      setError("");
      setSuccess("");

      await uploadDocument(
        selectedFile,
      );

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess(
        "Document uploaded successfully. Process it to prepare it for AI search.",
      );

      await loadDocuments();

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Unable to upload document.",
        ),
      );

    } finally {

      setIsUploading(false);

    }
  }


  // ==========================================================
  // VIEW DOCUMENT
  // ==========================================================

  async function handleView(
    documentId: string,
  ) {

    try {

      setError("");

      const document =
        await getDocument(
          documentId,
        );

      setSelectedDocument(
        document,
      );

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Unable to load the document.",
        ),
      );
    }
  }


  // ==========================================================
  // PROCESS DOCUMENT
  // ==========================================================

  async function handleProcess(
    documentId: string,
  ) {

    try {

      setProcessingId(
        documentId,
      );

      setError("");
      setSuccess("");

      await processDocument(
        documentId,
      );

      setSuccess(
        "Document processing completed successfully.",
      );

      await loadDocuments();

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Unable to process document.",
        ),
      );

    } finally {

      setProcessingId(null);

    }
  }


  // ==========================================================
  // DELETE DOCUMENT
  // ==========================================================

  async function handleDelete(
    document: DocumentResponse,
  ) {

    const confirmed =
      window.confirm(
        `Delete "${document.original_filename}"? This action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }


    try {

      setError("");
      setSuccess("");

      await deleteDocument(
        document.id,
      );

      setSuccess(
        "Document deleted successfully.",
      );

      if (
        selectedDocument?.id ===
        document.id
      ) {
        setSelectedDocument(null);
      }

      await loadDocuments();

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Unable to delete document.",
        ),
      );
    }
  }


  return (
    <div className="page-container">

      {/* ====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="page-introduction">

        <div>

          <h2>
            Documents
          </h2>

          <p>
            Upload, process, inspect, and manage
            the documents used by the AI knowledge base.
          </p>

        </div>

      </section>


      {/* ====================================================
          ALERTS
      ===================================================== */}

      {success && (
        <div className="dashboard-alert success">
          {success}
        </div>
      )}

      {error && (
        <div className="dashboard-alert error">
          {error}
        </div>
      )}


      {/* ====================================================
          UPLOAD
      ===================================================== */}

      <section className="dashboard-panel">

        <div className="dashboard-panel-header">

          <div>

            <h2>
              Upload Document
            </h2>

            <p>
              Supported formats: PDF, DOCX, TXT,
              and Markdown.
            </p>

          </div>

        </div>


        <div className="dashboard-form">

          <div className="form-field">

            <label htmlFor="document-file">
              Select Document
            </label>

            <input
              ref={fileInputRef}
              id="document-file"
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={handleFileChange}
            />

          </div>


          {selectedFile && (
            <div className="account-information">

              <div>

                <span>
                  Selected File
                </span>

                <strong>
                  {selectedFile.name}
                </strong>

              </div>

              <div>

                <span>
                  Size
                </span>

                <strong>
                  {(
                    selectedFile.size /
                    1024
                  ).toFixed(1)} KB
                </strong>

              </div>

            </div>
          )}


          <div className="form-actions">

            <button
              type="button"
              className="dashboard-button primary"
              onClick={() =>
                void handleUpload()
              }
              disabled={
                isUploading ||
                !selectedFile
              }
            >
              {isUploading
                ? "Uploading..."
                : "Upload Document"}
            </button>

          </div>

        </div>

      </section>


      {/* ====================================================
          DOCUMENT LIST
      ===================================================== */}

      <section className="dashboard-panel">

        <div className="dashboard-panel-header">

          <div>

            <h2>
              Knowledge Documents
            </h2>

            <p>
              Documents become available to search
              and AI chat after successful processing.
            </p>

          </div>

          <button
            type="button"
            className="dashboard-button secondary"
            onClick={() =>
              void loadDocuments()
            }
          >
            Refresh
          </button>

        </div>


        {isLoading ? (

          <div className="dashboard-empty">
            Loading documents...
          </div>

        ) : documents.length === 0 ? (

          <div className="dashboard-empty">
            No documents have been uploaded yet.
          </div>

        ) : (

          <div className="dashboard-table-wrapper">

            <table className="dashboard-table">

              <thead>

                <tr>

                  <th>
                    Document
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Created
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {documents.map(
                  (document) => {

                    const isProcessing =
                      processingId ===
                      document.id;

                    return (
                      <tr
                        key={
                          document.id
                        }
                      >

                        <td>

                          <strong>
                            {
                              document.original_filename
                            }
                          </strong>

                        </td>


                        <td>
                          {
                            document.document_type
                          }
                        </td>


                        <td>

                          <span
                            className={`status-badge ${
                              document.status ===
                              "ready"
                                ? "active"
                                : document.status ===
                                  "failed"
                                ? "inactive"
                                : ""
                            }`}
                          >
                            {
                              document.status
                            }
                          </span>

                        </td>


                        <td>
                          {
                            new Date(
                              document.created_at,
                            ).toLocaleDateString()
                          }
                        </td>


                        <td>

                          <div className="action-group">

                            <button
                              type="button"
                              className="dashboard-button small"
                              onClick={() =>
                                void handleView(
                                  document.id,
                                )
                              }
                            >
                              View
                            </button>


                            {(document.status ===
                              "pending" ||
                              document.status ===
                                "failed") && (

                              <button
                                type="button"
                                className="dashboard-button small"
                                disabled={
                                  isProcessing
                                }
                                onClick={() =>
                                  void handleProcess(
                                    document.id,
                                  )
                                }
                              >
                                {isProcessing
                                  ? "Processing..."
                                  : "Process"}
                              </button>
                            )}


                            <button
                              type="button"
                              className="dashboard-button small danger"
                              onClick={() =>
                                void handleDelete(
                                  document,
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  },
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* ====================================================
          DOCUMENT PREVIEW
      ===================================================== */}

      {selectedDocument && (

        <section className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <h2>
                Document Preview
              </h2>

              <p>
                {selectedDocument.original_filename}
              </p>

            </div>

            <button
              type="button"
              className="dashboard-button secondary"
              onClick={() =>
                setSelectedDocument(null)
              }
            >
              Close
            </button>

          </div>


          <div className="account-information">

            <div>

              <span>
                Document ID
              </span>

              <strong>
                {selectedDocument.id}
              </strong>

            </div>

            <div>

              <span>
                Type
              </span>

              <strong>
                {
                  selectedDocument.document_type
                }
              </strong>

            </div>

            <div>

              <span>
                Status
              </span>

              <strong>
                {
                  selectedDocument.status
                }
              </strong>

            </div>

          </div>


          <div
            style={{
              marginTop: "20px",
            }}
          >

            <h3>
              Extracted Content
            </h3>

            <pre
              style={{
                whiteSpace:
                  "pre-wrap",
                wordBreak:
                  "break-word",
                marginTop:
                  "12px",
                padding:
                  "20px",
                border:
                  "1px solid var(--border)",
                borderRadius:
                  "12px",
                maxHeight:
                  "500px",
                overflowY:
                  "auto",
              }}
            >
              {
                selectedDocument.content ||
                "No extracted content is available."
              }
            </pre>

          </div>

        </section>
      )}

    </div>
  );
}