import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getApiErrorMessage,
} from "../utils/apiError";

import {
  getEmbeddingHealth,
  getEmbeddingInfo,
  generateEmbedding,
  calculateSimilarity,
  generateLLM,
  type EmbeddingHealthResponse,
  type EmbeddingInfoResponse,
  type EmbeddingResponse,
  type SimilarityResponse,
  type LLMGenerateResponse,
} from "../api/ai-services.api";


export default function AIServices() {

  // ==========================================================
  // SERVICE STATE
  // ==========================================================

  const [
    embeddingHealth,
    setEmbeddingHealth,
  ] = useState<EmbeddingHealthResponse | null>(
    null,
  );

  const [
    embeddingInfo,
    setEmbeddingInfo,
  ] = useState<EmbeddingInfoResponse | null>(
    null,
  );


  const [
    isLoadingServices,
    setIsLoadingServices,
  ] = useState(true);


  // ==========================================================
  // EMBEDDING TEST
  // ==========================================================

  const [
    embeddingText,
    setEmbeddingText,
  ] = useState(
    "What is artificial intelligence?",
  );

  const [
    embeddingResult,
    setEmbeddingResult,
  ] = useState<EmbeddingResponse | null>(
    null,
  );

  const [
    isTestingEmbedding,
    setIsTestingEmbedding,
  ] = useState(false);


  // ==========================================================
  // SIMILARITY TEST
  // ==========================================================

  const [
    similarityText1,
    setSimilarityText1,
  ] = useState(
    "How do I change my password?",
  );

  const [
    similarityText2,
    setSimilarityText2,
  ] = useState(
    "How can I update my account password?",
  );

  const [
    similarityResult,
    setSimilarityResult,
  ] = useState<SimilarityResponse | null>(
    null,
  );

  const [
    isTestingSimilarity,
    setIsTestingSimilarity,
  ] = useState(false);


  // ==========================================================
  // LLM TEST
  // ==========================================================

  const [
    llmPrompt,
    setLlmPrompt,
  ] = useState(
    "Explain retrieval-augmented generation in simple terms.",
  );

  const [
    systemPrompt,
    setSystemPrompt,
  ] = useState(
    "You are a helpful AI assistant.",
  );

  const [
    temperature,
    setTemperature,
  ] = useState(0.2);

  const [
    maxTokens,
    setMaxTokens,
  ] = useState(1024);

  const [
    llmResult,
    setLlmResult,
  ] = useState<LLMGenerateResponse | null>(
    null,
  );

  const [
    isTestingLLM,
    setIsTestingLLM,
  ] = useState(false);


  // ==========================================================
  // GENERAL UI STATE
  // ==========================================================

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");


  // ==========================================================
  // LOAD SERVICES
  // ==========================================================

  async function loadServices() {

    try {

      setIsLoadingServices(true);
      setError("");

      const [
        health,
        info,
      ] = await Promise.all([
        getEmbeddingHealth(),
        getEmbeddingInfo(),
      ]);

      setEmbeddingHealth(
        health,
      );

      setEmbeddingInfo(
        info,
      );

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Unable to retrieve AI service information.",
        ),
      );

    } finally {

      setIsLoadingServices(false);

    }
  }


  useEffect(() => {

    void loadServices();

  }, []);


  // ==========================================================
  // EMBEDDING TEST
  // ==========================================================

  async function handleEmbeddingTest(
    event: FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();

    setError("");
    setSuccess("");
    setEmbeddingResult(null);


    if (!embeddingText.trim()) {

      setError(
        "Enter text to generate an embedding.",
      );

      return;
    }


    try {

      setIsTestingEmbedding(true);

      const result =
        await generateEmbedding(
          embeddingText.trim(),
        );

      setEmbeddingResult(
        result,
      );

      setSuccess(
        "Embedding generation completed successfully.",
      );

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Embedding generation failed.",
        ),
      );

    } finally {

      setIsTestingEmbedding(false);

    }
  }


  // ==========================================================
  // SIMILARITY TEST
  // ==========================================================

  async function handleSimilarityTest(
    event: FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();

    setError("");
    setSuccess("");
    setSimilarityResult(null);


    if (
      !similarityText1.trim() ||
      !similarityText2.trim()
    ) {

      setError(
        "Both texts are required for similarity testing.",
      );

      return;
    }


    try {

      setIsTestingSimilarity(true);

      const result =
        await calculateSimilarity(
          similarityText1.trim(),
          similarityText2.trim(),
        );

      setSimilarityResult(
        result,
      );

      setSuccess(
        "Similarity calculation completed successfully.",
      );

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Similarity calculation failed.",
        ),
      );

    } finally {

      setIsTestingSimilarity(false);

    }
  }


  // ==========================================================
  // LLM TEST
  // ==========================================================

  async function handleLLMTest(
    event: FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();

    setError("");
    setSuccess("");
    setLlmResult(null);


    if (!llmPrompt.trim()) {

      setError(
        "Enter a prompt for the language model.",
      );

      return;
    }


    try {

      setIsTestingLLM(true);

      const result =
        await generateLLM({
          prompt:
            llmPrompt.trim(),

          system_prompt:
            systemPrompt.trim() ||
            null,

          temperature,

          max_tokens:
            maxTokens,
        });

      setLlmResult(
        result,
      );

      setSuccess(
        "LLM generation completed successfully.",
      );

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "LLM generation failed.",
        ),
      );

    } finally {

      setIsTestingLLM(false);

    }
  }


  // ==========================================================
  // VECTOR PREVIEW
  // ==========================================================

  function getVectorPreview(
    embedding: number[],
  ) {

    const preview =
      embedding.slice(
        0,
        12,
      );

    return preview
      .map(
        (value) =>
          value.toFixed(4),
      )
      .join(", ");
  }


  return (
    <div className="page-container">

      {/* ====================================================
          HEADER
      ===================================================== */}

      <section className="page-introduction">

        <div>

          <div className="ai-services-title-row">

            <div>

              <h2>
                AI Services
              </h2>

              <p>
                Monitor AI infrastructure health and
                run administrator diagnostics for the
                embedding and language-model services.
              </p>

            </div>

            <Link
              to="/dashboard"
              className="dashboard-button secondary"
            >
              Back to Dashboard
            </Link>

          </div>

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
          SERVICE OVERVIEW
      ===================================================== */}

      <section className="ai-services-overview-grid">

        {/* EMBEDDING HEALTH */}

        <article className="ai-service-card">

          <div className="ai-service-card-header">

            <div>

              <span className="ai-service-icon">
                E
              </span>

            </div>

            <div className="ai-service-header-content">

              <h3>
                Embedding Service
              </h3>

              <p>
                Vector generation and service health.
              </p>

            </div>

            {!isLoadingServices && (
              <span
                className={`ai-status ${
                  embeddingHealth?.status ===
                  "healthy"
                    ? "ai-status-healthy"
                    : "ai-status-unhealthy"
                }`}
              >
                {embeddingHealth?.status ===
                "healthy"
                  ? "Healthy"
                  : "Unavailable"}
              </span>
            )}

          </div>


          {isLoadingServices ? (

            <div className="ai-service-loading">
              Loading service information...
            </div>

          ) : (

            <div className="ai-service-metrics">

              <div className="ai-service-metric">
                <span>
                  Provider
                </span>

                <strong>
                  {
                    embeddingHealth?.provider ||
                    embeddingInfo?.provider ||
                    "N/A"
                  }
                </strong>
              </div>


              <div className="ai-service-metric">
                <span>
                  Model
                </span>

                <strong>
                  {
                    embeddingHealth?.model ||
                    embeddingInfo?.model ||
                    "N/A"
                  }
                </strong>
              </div>


              <div className="ai-service-metric">
                <span>
                  Dimension
                </span>

                <strong>
                  {
                    embeddingHealth?.dimension ??
                    embeddingInfo?.dimension ??
                    "N/A"
                  }
                </strong>
              </div>


              <div className="ai-service-metric">
                <span>
                  Initialized
                </span>

                <strong>
                  {
                    embeddingHealth?.initialized
                      ? "Yes"
                      : "No"
                  }
                </strong>
              </div>

            </div>

          )}

        </article>


        {/* CACHE */}

        <article className="ai-service-card">

          <div className="ai-service-card-header">

            <div>

              <span className="ai-service-icon">
                C
              </span>

            </div>

            <div className="ai-service-header-content">

              <h3>
                Embedding Cache
              </h3>

              <p>
                Runtime cache statistics.
              </p>

            </div>

          </div>


          {isLoadingServices ? (

            <div className="ai-service-loading">
              Loading cache statistics...
            </div>

          ) : (

            <div className="ai-cache-grid">

              <div>
                <span>
                  Hits
                </span>

                <strong>
                  {
                    embeddingInfo?.cache?.hits ??
                    0
                  }
                </strong>
              </div>

              <div>
                <span>
                  Misses
                </span>

                <strong>
                  {
                    embeddingInfo?.cache?.misses ??
                    0
                  }
                </strong>
              </div>

              <div>
                <span>
                  Entries
                </span>

                <strong>
                  {
                    embeddingInfo?.cache?.size ??
                    embeddingInfo?.cache?.entries ??
                    0
                  }
                </strong>
              </div>

            </div>

          )}

        </article>

      </section>


      {/* ====================================================
          REFRESH SERVICES
      ===================================================== */}

      <section className="ai-services-refresh">

        <div>

          <h3>
            Service Diagnostics
          </h3>

          <p>
            Refresh the latest embedding-service
            health and runtime information.
          </p>

        </div>


        <button
          type="button"
          className="dashboard-button secondary"
          onClick={() =>
            void loadServices()
          }
          disabled={isLoadingServices}
        >
          {isLoadingServices
            ? "Refreshing..."
            : "Refresh Services"}
        </button>

      </section>


      {/* ====================================================
          EMBEDDING TEST
      ===================================================== */}

      <section className="dashboard-panel ai-diagnostic-panel">

        <div className="dashboard-panel-header">

          <div>

            <h2>
              Embedding Diagnostic
            </h2>

            <p>
              Generate an embedding vector from test text.
            </p>

          </div>

          <span className="ai-diagnostic-label">
            POST /embeddings/generate
          </span>

        </div>


        <form
          className="dashboard-form"
          onSubmit={handleEmbeddingTest}
        >

          <div className="form-field">

            <label htmlFor="embedding-text">
              Text
            </label>

            <textarea
              id="embedding-text"
              className="form-input"
              rows={4}
              value={embeddingText}
              onChange={(event) =>
                setEmbeddingText(
                  event.target.value,
                )
              }
              placeholder="Enter text to embed..."
            />

          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="dashboard-button primary"
              disabled={isTestingEmbedding}
            >
              {isTestingEmbedding
                ? "Generating..."
                : "Generate Embedding"}
            </button>

          </div>

        </form>


        {embeddingResult && (

          <div className="ai-test-result">

            <div className="ai-result-header">

              <div>

                <span>
                  Provider
                </span>

                <strong>
                  {embeddingResult.provider}
                </strong>

              </div>


              <div>

                <span>
                  Model
                </span>

                <strong>
                  {embeddingResult.model}
                </strong>

              </div>


              <div>

                <span>
                  Dimension
                </span>

                <strong>
                  {embeddingResult.dimension}
                </strong>

              </div>

            </div>


            <div className="ai-vector-preview">

              <span>
                Vector Preview
              </span>

              <code>
                {
                  getVectorPreview(
                    embeddingResult.embedding,
                  )
                }
                ...
              </code>

            </div>

          </div>

        )}

      </section>


      {/* ====================================================
          SIMILARITY TEST
      ===================================================== */}

      <section className="dashboard-panel ai-diagnostic-panel">

        <div className="dashboard-panel-header">

          <div>

            <h2>
              Similarity Diagnostic
            </h2>

            <p>
              Compare two pieces of text using cosine similarity.
            </p>

          </div>

          <span className="ai-diagnostic-label">
            POST /embeddings/similarity
          </span>

        </div>


        <form
          className="dashboard-form"
          onSubmit={handleSimilarityTest}
        >

          <div className="form-grid">

            <div className="form-field">

              <label htmlFor="similarity-text-1">
                Text 1
              </label>

              <textarea
                id="similarity-text-1"
                className="form-input"
                rows={5}
                value={similarityText1}
                onChange={(event) =>
                  setSimilarityText1(
                    event.target.value,
                  )
                }
              />

            </div>


            <div className="form-field">

              <label htmlFor="similarity-text-2">
                Text 2
              </label>

              <textarea
                id="similarity-text-2"
                className="form-input"
                rows={5}
                value={similarityText2}
                onChange={(event) =>
                  setSimilarityText2(
                    event.target.value,
                  )
                }
              />

            </div>

          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="dashboard-button primary"
              disabled={isTestingSimilarity}
            >
              {isTestingSimilarity
                ? "Calculating..."
                : "Calculate Similarity"}
            </button>

          </div>

        </form>


        {similarityResult && (

          <div className="similarity-result">

            <span>
              Similarity Score
            </span>

            <strong>
              {
                similarityResult.similarity_score.toFixed(
                  6,
                )
              }
            </strong>

          </div>

        )}

      </section>


      {/* ====================================================
          LLM TEST
      ===================================================== */}

      <section className="dashboard-panel ai-diagnostic-panel">

        <div className="dashboard-panel-header">

          <div>

            <h2>
              Language Model Diagnostic
            </h2>

            <p>
              Send a controlled test prompt directly
              to the configured language model.
            </p>

          </div>

          <span className="ai-diagnostic-label">
            POST /llm/generate
          </span>

        </div>


        <form
          className="dashboard-form"
          onSubmit={handleLLMTest}
        >

          <div className="form-field">

            <label htmlFor="llm-prompt">
              Prompt
            </label>

            <textarea
              id="llm-prompt"
              className="form-input"
              rows={5}
              value={llmPrompt}
              onChange={(event) =>
                setLlmPrompt(
                  event.target.value,
                )
              }
              placeholder="Enter a test prompt..."
            />

          </div>


          <div className="form-field">

            <label htmlFor="system-prompt">
              System Prompt
            </label>

            <textarea
              id="system-prompt"
              className="form-input"
              rows={3}
              value={systemPrompt}
              onChange={(event) =>
                setSystemPrompt(
                  event.target.value,
                )
              }
              placeholder="Optional system instruction..."
            />

          </div>


          <div className="form-grid">

            <div className="form-field">

              <label htmlFor="temperature">
                Temperature:{" "}
                {temperature.toFixed(1)}
              </label>

              <input
                id="temperature"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(event) =>
                  setTemperature(
                    Number(
                      event.target.value,
                    ),
                  )
                }
              />

            </div>


            <div className="form-field">

              <label htmlFor="max-tokens">
                Max Tokens
              </label>

              <input
                id="max-tokens"
                type="number"
                min="1"
                max="8192"
                value={maxTokens}
                onChange={(event) =>
                  setMaxTokens(
                    Number(
                      event.target.value,
                    ),
                  )
                }
              />

            </div>

          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="dashboard-button primary"
              disabled={isTestingLLM}
            >
              {isTestingLLM
                ? "Generating..."
                : "Generate Response"}
            </button>

          </div>

        </form>


        {llmResult && (

          <div className="ai-llm-result">

            <div className="ai-result-header">

              <div>
                <span>
                  Provider
                </span>

                <strong>
                  {llmResult.provider}
                </strong>
              </div>


              <div>
                <span>
                  Model
                </span>

                <strong>
                  {llmResult.model}
                </strong>
              </div>


              <div>
                <span>
                  Temperature
                </span>

                <strong>
                  {llmResult.temperature}
                </strong>
              </div>


              <div>
                <span>
                  Max Tokens
                </span>

                <strong>
                  {llmResult.max_tokens}
                </strong>
              </div>

            </div>


            <div className="ai-response-box">

              <span>
                Model Response
              </span>

              <p>
                {llmResult.response}
              </p>

            </div>

          </div>

        )}

      </section>

    </div>
  );
}