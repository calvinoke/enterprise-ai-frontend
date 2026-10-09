import {
  useState,
  type FormEvent,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  forgotPassword,
} from "../api/auth.api";

import {
  getApiErrorMessage,
} from "../utils/apiError";


export default function ForgotPassword() {

  const [email, setEmail] = useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    try {

      setLoading(true);

      const response =
        await forgotPassword({
          email: email.trim(),
        });

      setSuccess(
        response.message ||
        "If an account exists with that email, password reset instructions have been sent.",
      );

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Unable to process the password reset request.",
        ),
      );

    } finally {

      setLoading(false);

    }
  }


  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-brand">

          <h1 className="auth-title">
            AI/RAG Documents Processing System
          </h1>

          <p className="auth-subtitle">
            Recover access to your account
          </p>

        </div>


        <h2 className="auth-heading">
          Forgot Password
        </h2>


        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {success && (
          <div className="success-message">
            {success}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          noValidate
        >

          <div className="form-group">

            <label
              htmlFor="email"
              className="form-label"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

          </div>


          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send Reset Instructions"}
          </button>

        </form>


        <div className="auth-footer">

          Remember your password?{" "}

          <Link
            to="/login"
            className="auth-link"
          >
            Back to Login
          </Link>

        </div>


        <div className="auth-footer">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="auth-link"
          >
            Create an account
          </Link>

        </div>

      </div>

    </div>
  );
}