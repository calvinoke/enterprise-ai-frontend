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
  chatWithAI,
  createConversation,
  deleteConversation,
  getConversations,
  getMessages,
  type Conversation,
  type Message,
} from "../api/conversations.api";


export default function Chat() {

  const [
    conversations,
    setConversations,
  ] = useState<Conversation[]>([]);

  const [
    selectedConversation,
    setSelectedConversation,
  ] = useState<Conversation | null>(
    null,
  );

  const [
    messages,
    setMessages,
  ] = useState<Message[]>([]);

  const [
    documents,
    setDocuments,
  ] = useState<DocumentResponse[]>([]);

  const [
    selectedDocumentId,
    setSelectedDocumentId,
  ] = useState("");


  const [
    question,
    setQuestion,
  ] = useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSending,
    setIsSending,
  ] = useState(false);

  const [
    isCreating,
    setIsCreating,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");


  // ==========================================================
  // LOAD INITIAL DATA
  // ==========================================================

  useEffect(() => {

    async function load() {

      try {

        setIsLoading(true);
        setError("");

        const [
          conversationData,
          documentData,
        ] = await Promise.all([
          getConversations(),
          getDocuments(),
        ]);

        setConversations(
          conversationData,
        );

        setDocuments(
          documentData.filter(
            (document) =>
              document.status ===
              "ready",
          ),
        );

        if (
          conversationData.length > 0
        ) {

          await selectConversation(
            conversationData[0],
          );

        }

      } catch (error: unknown) {

        setError(
          getApiErrorMessage(
            error,
            "Unable to load the chat workspace.",
          ),
        );

      } finally {

        setIsLoading(false);

      }
    }


    void load();

  }, []);


  // ==========================================================
  // SELECT CONVERSATION
  // ==========================================================

  async function selectConversation(
    conversation: Conversation,
  ) {

    try {

      setSelectedConversation(
        conversation,
      );

      setError("");

      const data =
        await getMessages(
          conversation.id,
        );

      setMessages(data);

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Unable to load conversation messages.",
        ),
      );
    }
  }


  // ==========================================================
  // NEW CONVERSATION
  // ==========================================================

  async function handleCreateConversation() {

    try {

      setIsCreating(true);
      setError("");
      setSuccess("");

      const conversation =
        await createConversation(
          "New Conversation",
        );

      setConversations(
        (current) => [
          conversation,
          ...current,
        ],
      );

      setSelectedConversation(
        conversation,
      );

      setMessages([]);

      setSuccess(
        "New conversation created.",
      );

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Unable to create conversation.",
        ),
      );

    } finally {

      setIsCreating(false);

    }
  }


  // ==========================================================
  // SEND QUESTION
  // ==========================================================

  async function handleSend() {

    if (!question.trim()) {
      return;
    }


    setError("");
    setSuccess("");


    let conversation =
      selectedConversation;


    try {

      setIsSending(true);


      // Automatically create a conversation
      // if one does not exist.

      if (!conversation) {

        conversation =
          await createConversation(
            question
              .trim()
              .slice(
                0,
                80,
              ),
          );

        setConversations(
          (current) => [
            conversation!,
            ...current,
          ],
        );

        setSelectedConversation(
          conversation,
        );

      }


      const response =
        await chatWithAI(
          conversation.id,
          question.trim(),
          selectedDocumentId ||
            null,
        );


      setQuestion("");


      // Load the persisted conversation
      // messages from the backend.

      const updatedMessages =
        await getMessages(
          conversation.id,
        );

      setMessages(
        updatedMessages,
      );


      // Refresh conversation metadata.

      const updatedConversations =
        await getConversations();

      setConversations(
        updatedConversations,
      );


      const latestConversation =
        updatedConversations.find(
          (item) =>
            item.id ===
            conversation!.id,
        );


      if (
        latestConversation
      ) {

        setSelectedConversation(
          latestConversation,
        );

      }


      setSuccess(
        `AI response generated using ${response.provider} / ${response.model}.`,
      );

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Unable to process your question.",
        ),
      );

    } finally {

      setIsSending(false);

    }
  }


  // ==========================================================
  // DELETE CONVERSATION
  // ==========================================================

  async function handleDeleteConversation(
    conversation: Conversation,
  ) {

    const confirmed =
      window.confirm(
        `Delete "${conversation.title}"?`,
      );

    if (!confirmed) {
      return;
    }


    try {

      await deleteConversation(
        conversation.id,
      );


      const remaining =
        conversations.filter(
          (item) =>
            item.id !==
            conversation.id,
        );


      setConversations(
        remaining,
      );


      if (
        selectedConversation?.id ===
        conversation.id
      ) {

        setSelectedConversation(
          remaining[0] || null,
        );

        if (remaining[0]) {

          await selectConversation(
            remaining[0],
          );

        } else {

          setMessages([]);

        }
      }


      setSuccess(
        "Conversation deleted successfully.",
      );

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Unable to delete conversation.",
        ),
      );
    }
  }


  // ==========================================================
  // ENTER TO SEND
  // ==========================================================

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      void handleSend();
    }
  }


  if (isLoading) {

    return (
      <div className="page-container">

        <div className="dashboard-empty">
          Loading AI Chat...
        </div>

      </div>
    );
  }


  return (
    <div className="page-container">

      {/* ====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="page-introduction">

        <div>

          <h2>
            AI Chat
          </h2>

          <p>
            Ask questions and receive grounded
            answers from your knowledge base.
          </p>

        </div>

      </section>


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
          CHAT WORKSPACE
      ===================================================== */}

      <section
        className="dashboard-panel"
        style={{
          padding: 0,
          overflow: "hidden",
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "280px 1fr",
            minHeight:
              "650px",
          }}
        >

          {/* ================================================
              CONVERSATION SIDEBAR
          ================================================= */}

          <aside
            style={{
              borderRight:
                "1px solid var(--border)",
              padding:
                "18px",
            }}
          >

            <button
              type="button"
              className="dashboard-button primary"
              style={{
                width: "100%",
                marginBottom:
                  "18px",
              }}
              onClick={() =>
                void handleCreateConversation()
              }
              disabled={isCreating}
            >
              {isCreating
                ? "Creating..."
                : "+ New Conversation"}
            </button>


            <div>

              {conversations.length ===
              0 ? (

                <div className="dashboard-empty">
                  No conversations yet.
                </div>

              ) : (

                conversations.map(
                  (conversation) => {

                    const isSelected =
                      selectedConversation?.id ===
                      conversation.id;

                    return (
                      <div
                        key={
                          conversation.id
                        }
                        style={{
                          display:
                            "flex",
                          gap:
                            "8px",
                          marginBottom:
                            "8px",
                        }}
                      >

                        <button
                          type="button"
                          onClick={() =>
                            void selectConversation(
                              conversation,
                            )
                          }
                          style={{
                            flex: 1,
                            textAlign:
                              "left",
                            padding:
                              "12px",
                            border:
                              "1px solid var(--border)",
                            borderRadius:
                              "10px",
                            background:
                              isSelected
                                ? "var(--bg)"
                                : "transparent",
                            cursor:
                              "pointer",
                          }}
                        >

                          <strong>
                            {
                              conversation.title
                            }
                          </strong>

                          <small
                            style={{
                              display:
                                "block",
                              marginTop:
                                "4px",
                            }}
                          >
                            {
                              conversation.model
                            }
                          </small>

                        </button>


                        <button
                          type="button"
                          className="dashboard-button small danger"
                          onClick={() =>
                            void handleDeleteConversation(
                              conversation,
                            )
                          }
                        >
                          ×
                        </button>

                      </div>
                    );
                  },
                )

              )}

            </div>

          </aside>


          {/* ================================================
              CHAT AREA
          ================================================= */}

          <div
            style={{
              display:
                "flex",
              flexDirection:
                "column",
              minWidth: 0,
            }}
          >

            {/* CHAT HEADER */}

            <div
              style={{
                padding:
                  "20px",
                borderBottom:
                  "1px solid var(--border)",
              }}
            >

              <h2
                style={{
                  margin:
                    "0 0 6px",
                }}
              >
                {
                  selectedConversation?.title ||
                  "New Conversation"
                }
              </h2>

              {selectedConversation && (
                <small>
                  {
                    selectedConversation.provider
                  }{" "}
                  /{" "}
                  {
                    selectedConversation.model
                  }
                </small>
              )}

            </div>


            {/* MESSAGES */}

            <div
              style={{
                flex:
                  1,
                padding:
                  "24px",
                overflowY:
                  "auto",
              }}
            >

              {messages.length ===
              0 ? (

                <div
                  className="dashboard-empty"
                >

                  <h3>
                    Start a conversation
                  </h3>

                  <p>
                    Ask a question about
                    your uploaded knowledge
                    documents.
                  </p>

                </div>

              ) : (

                messages.map(
                  (message) => {

                    const isUser =
                      message.role ===
                      "user";

                    return (
                      <div
                        key={
                          message.id
                        }
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            isUser
                              ? "flex-end"
                              : "flex-start",
                          marginBottom:
                            "18px",
                        }}
                      >

                        <div
                          style={{
                            maxWidth:
                              "80%",
                            padding:
                              "14px 16px",
                            border:
                              "1px solid var(--border)",
                            borderRadius:
                              "14px",
                            whiteSpace:
                              "pre-wrap",
                          }}
                        >

                          <strong>
                            {isUser
                              ? "You"
                              : "AI Assistant"}
                          </strong>

                          <p
                            style={{
                              marginTop:
                                "8px",
                              lineHeight:
                                "1.7",
                            }}
                          >
                            {
                              message.content
                            }
                          </p>


                          {!isUser && (
                            <small>
                              {message.latency_ms} ms
                              {" · "}
                              {message.tokens} tokens
                            </small>
                          )}

                        </div>

                      </div>
                    );
                  },
                )

              )}

            </div>


            {/* CHAT CONTROLS */}

            <div
              style={{
                borderTop:
                  "1px solid var(--border)",
                padding:
                  "18px",
              }}
            >

              <div className="form-field">

                <label htmlFor="chat-document">
                  Search within
                </label>

                <select
                  id="chat-document"
                  className="form-input"
                  value={
                    selectedDocumentId
                  }
                  onChange={(event) =>
                    setSelectedDocumentId(
                      event.target.value,
                    )
                  }
                >

                  <option value="">
                    Entire knowledge base
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


              <div
                style={{
                  display:
                    "flex",
                  gap:
                    "12px",
                  alignItems:
                    "flex-end",
                }}
              >

                <textarea
                  className="form-input"
                  rows={3}
                  style={{
                    flex:
                      1,
                    resize:
                      "vertical",
                  }}
                  value={question}
                  onChange={(event) =>
                    setQuestion(
                      event.target.value,
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  placeholder="Ask the AI assistant a question..."
                  disabled={isSending}
                />


                <button
                  type="button"
                  className="dashboard-button primary"
                  onClick={() =>
                    void handleSend()
                  }
                  disabled={
                    isSending ||
                    !question.trim()
                  }
                >
                  {isSending
                    ? "Thinking..."
                    : "Send"}
                </button>

              </div>

              <small
                style={{
                  display:
                    "block",
                  marginTop:
                    "8px",
                }}
              >
                Press Enter to send. Use Shift +
                Enter for a new line.
              </small>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}