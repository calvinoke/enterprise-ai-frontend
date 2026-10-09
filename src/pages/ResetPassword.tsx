import {
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import {
  resetPassword,
} from "../api/auth.api";

import {
  getApiErrorMessage,
} from "../utils/apiError";


export default function ResetPassword() {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get("token") || "";

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  function validatePassword(
    password: string,
  ) {

    if (!password) {
      return "Password is required.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Password must contain at least one special character.";
    }

    return "";
  }


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (!token) {

      setError(
        "This password reset link is invalid or incomplete.",
      );

      return;
    }


    const passwordError =
      validatePassword(newPassword);

    if (passwordError) {
      setError(passwordError);
      return;
    }


    if (
      newPassword !== confirmPassword
    ) {

      setError(
        "Passwords do not match.",
      );

      return;
    }


    try {

      setLoading(true);

      const response =
        await resetPassword({
          token,
          new_password: newPassword,
        });

      setSuccess(
        response.message ||
        "Your password has been reset successfully.",
      );

      setNewPassword("");
      setConfirmPassword("");


      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Unable to reset your password.",
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
            Create a new password
          </p>

        </div>


        <h2 className="auth-heading">
          Reset Password
        </h2>


        {!token && (
          <div className="error-message">
            This password reset link is missing
            its token.
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


        <form
          onSubmit={handleSubmit}
          noValidate
        >

          <div className="form-group">

            <label
              htmlFor="new_password"
              className="form-label"
            >
              New Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="new_password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className="form-input password-input"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value,
                  )
                }
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>


          <div className="form-group">

            <label
              htmlFor="confirm_password"
              className="form-label"
            >
              Confirm Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="confirm_password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                className="form-input password-input"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value,
                  )
                }
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current,
                  )
                }
              >
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>


          <button
            type="submit"
            className="primary-button"
            disabled={loading || !token}
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>


        <div className="auth-footer">

          <Link
            to="/login"
            className="auth-link"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}