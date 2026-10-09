import {
  useEffect,
  useState,
} from "react";

import {
  getApiErrorMessage,
} from "../utils/apiError";

import {
  getDocuments,
  type DocumentResponse,
} from "../api/documents.api";

import {
  searchRAG,
  type RAGSearchResponse,
} from "../api/rag.api";


export default function Search() {

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    topK,
    setTopK,
  ] = useState(5);

  const [
    threshold,
    setThreshold,
  ] = useState(0.5);

  const [
    documentId,
    setDocumentId,
  ] = useState("");


  const [
    documents,
    setDocuments,
  ] = useState<DocumentResponse[]>([]);

  const [
    results,
    setResults,
  ] = useState<RAGSearchResponse | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  // ==========================================================
  // LOAD READY DOCUMENTS
  // ==========================================================

  useEffect(() => {

    async function load() {

      try {

        const data =
          await getDocuments();

        setDocuments(
          data.filter(
            (document) =>
              document.status ===
              "ready",
          ),
        );

      } catch {
        // Search can still work across
        // the user's knowledge base.
      }
    }

    void load();

  }, []);


  // ==========================================================
  // SEARCH
  // ==========================================================

  async function handleSearch(
    event: React.FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();

    setError("");
    setResults(null);


    if (!query.trim()) {

      setError(
        "Enter a search query.",
      );

      return;
    }


    try {

      setLoading(true);

      const response =
        await searchRAG({

          query:
            query.trim(),

          top_k:
            topK,

          document_id:
            documentId || null,

          similarity_threshold:
            threshold,
        });

      setResults(
        response,
      );

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Semantic search failed.",
        ),
      );

    } finally {

      setLoading(false);

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
            Semantic Search
          </h2>

          <p>
            Search your knowledge base using
            AI-powered semantic retrieval.
          </p>

        </div>

      </section>


      {error && (
        <div className="dashboard-alert error">
          {error}
        </div>
      )}


      {/* ====================================================
          SEARCH FORM
      ===================================================== */}

      <section className="dashboard-panel">

        <div className="dashboard-panel-header">

          <div>

            <h2>
              Search Knowledge Base
            </h2>

            <p>
              Enter a natural-language question
              or phrase.
            </p>

          </div>

        </div>


        <form
          className="dashboard-form"
          onSubmit={handleSearch}
        >

          <div className="form-field">

            <label htmlFor="search-query">
              Search Query
            </label>

            <textarea
              id="search-query"
              className="form-input"
              rows={4}
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value,
                )
              }
              placeholder="For example: What are the core cybersecurity responsibilities?"
            />

          </div>


          <div className="form-grid">

            <div className="form-field">

              <label htmlFor="search-document">
                Document
              </label>

              <select
                id="search-document"
                className="form-input"
                value={documentId}
                onChange={(event) =>
                  setDocumentId(
                    event.target.value,
                  )
                }
              >

                <option value="">
                  All documents
                </option>

                {documents.map(
                  (document) => (

                    <option
                      key={
                        document.id
                      }
                      value={
                        document.id
                      }
                    >
                      {
                        document.original_filename
                      }
                    </option>

                  ),
                )}

              </select>

            </div>


            <div className="form-field">

              <label htmlFor="top-k">
                Results
              </label>

              <select
                id="top-k"
                className="form-input"
                value={topK}
                onChange={(event) =>
                  setTopK(
                    Number(
                      event.target.value,
                    ),
                  )
                }
              >

                <option value={3}>
                  3
                </option>

                <option value={5}>
                  5
                </option>

                <option value={10}>
                  10
                </option>

                <option value={20}>
                  20
                </option>

              </select>

            </div>

          </div>


          <div className="form-field">

            <label htmlFor="threshold">
              Similarity Threshold:{" "}
              {threshold.toFixed(2)}
            </label>

            <input
              id="threshold"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={threshold}
              onChange={(event) =>
                setThreshold(
                  Number(
                    event.target.value,
                  ),
                )
              }
            />

          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="dashboard-button primary"
              disabled={loading}
            >
              {loading
                ? "Searching..."
                : "Search Knowledge Base"}
            </button>

          </div>

        </form>

      </section>


      {/* ====================================================
          RESULTS
      ===================================================== */}

      {results && (

        <section className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <h2>
                Search Results
              </h2>

              <p>
                Found {results.count} matching
                knowledge chunks.
              </p>

            </div>

          </div>


          <div className="account-information">

            <div>

              <span>
                Provider
              </span>

              <strong>
                {results.provider}
              </strong>

            </div>

            <div>

              <span>
                Model
              </span>

              <strong>
                {results.model}
              </strong>

            </div>

            <div>

              <span>
                Dimension
              </span>

              <strong>
                {results.dimension}
              </strong>

            </div>

          </div>


          {results.results.length === 0 ? (

            <div className="dashboard-empty">

              No results matched the selected
              similarity threshold.

            </div>

          ) : (

            <div>

              {results.results.map(
                (result, index) => (

                  <article
                    key={
                      result.chunk_id
                    }
                    style={{
                      padding:
                        "20px 0",
                      borderBottom:
                        "1px solid var(--border)",
                    }}
                  >

                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        gap: "20px",
                        marginBottom:
                          "10px",
                      }}
                    >

                      <strong>
                        Result #{index + 1}
                      </strong>

                      <span
                        className="status-badge active"
                      >
                        Score:{" "}
                        {result.similarity.toFixed(
                          4,
                        )}
                      </span>

                    </div>


                    <p
                      style={{
                        whiteSpace:
                          "pre-wrap",
                        lineHeight:
                          "1.7",
                      }}
                    >
                      {
                        result.content
                      }
                    </p>


                    <small>
                      Chunk {result.chunk_index}
                    </small>

                  </article>

                ),
              )}

            </div>

          )}

        </section>
      )}

    </div>
  );
}