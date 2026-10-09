import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  resendVerification,
  verifyEmail,
} from "../api/auth.api";

import {
  getApiErrorMessage,
} from "../utils/apiError";


export default function VerifyEmail() {

  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get("token") || "";

  const emailFromUrl =
    searchParams.get("email") || "";


  const [
    email,
    setEmail,
  ] = useState(emailFromUrl);

  const [
    isVerifying,
    setIsVerifying,
  ] = useState(Boolean(token));

  const [
    isResending,
    setIsResending,
  ] = useState(false);

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");


  // ==========================================================
  // AUTO VERIFY TOKEN
  // ==========================================================

  useEffect(() => {

    if (!token) {
      setIsVerifying(false);
      return;
    }


    async function verify() {

      try {

        setError("");
        setSuccess("");
        setIsVerifying(true);

        const response =
          await verifyEmail({
            token,
          });

        setSuccess(
          response.message ||
          "Your email has been verified successfully.",
        );

      } catch (error: unknown) {

        setError(
          getApiErrorMessage(
            error,
            "Unable to verify your email.",
          ),
        );

      } finally {

        setIsVerifying(false);

      }
    }


    void verify();

  }, [token]);


  // ==========================================================
  // RESEND VERIFICATION
  // ==========================================================

  async function handleResend(
    event: FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (!email.trim()) {

      setError(
        "Email is required.",
      );

      return;
    }


    try {

      setIsResending(true);

      const response =
        await resendVerification({
          email: email.trim(),
        });

      setSuccess(
        response.message ||
        "Verification instructions have been sent.",
      );

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Unable to resend the verification email.",
        ),
      );

    } finally {

      setIsResending(false);

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
            Verify your email address
          </p>

        </div>


        <h2 className="auth-heading">
          Email Verification
        </h2>


        {isVerifying && (
          <div className="info-message">
            Verifying your email address...
          </div>
        )}


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


        {!token && (
          <form
            onSubmit={handleResend}
            noValidate
          >

            <div className="form-group">

              <label
                htmlFor="email"
                className="form-label"
              >
                Email Address
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
              disabled={isResending}
            >
              {isResending
                ? "Sending..."
                : "Resend Verification Email"}
            </button>

          </form>
        )}


        <div className="auth-footer">

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