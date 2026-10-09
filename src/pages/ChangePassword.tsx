import {
  useState,
  type FormEvent,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  changePassword,
} from "../api/auth.api";

import {
  getApiErrorMessage,
} from "../utils/apiError";


export default function ChangePassword() {

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showCurrent,
    setShowCurrent,
  ] = useState(false);

  const [
    showNew,
    setShowNew,
  ] = useState(false);

  const [
    showConfirm,
    setShowConfirm,
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
      return "New password is required.";
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


    if (!currentPassword) {

      setError(
        "Current password is required.",
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
        "New passwords do not match.",
      );

      return;
    }


    if (
      currentPassword === newPassword
    ) {

      setError(
        "New password must be different from your current password.",
      );

      return;
    }


    try {

      setLoading(true);

      const response =
        await changePassword({
          current_password:
            currentPassword,

          new_password:
            newPassword,
        });

      setSuccess(
        response.message ||
        "Your password has been changed successfully.",
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Unable to change your password.",
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
            Protect your account with a strong password
          </p>

        </div>


        <h2 className="auth-heading">
          Change Password
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

          {/* CURRENT PASSWORD */}

          <div className="form-group">

            <label
              htmlFor="current_password"
              className="form-label"
            >
              Current Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="current_password"
                type={
                  showCurrent
                    ? "text"
                    : "password"
                }
                className="form-input password-input"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value,
                  )
                }
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowCurrent(
                    (current) => !current,
                  )
                }
              >
                {showCurrent
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>


          {/* NEW PASSWORD */}

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
                  showNew
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
                  setShowNew(
                    (current) => !current,
                  )
                }
              >
                {showNew
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label
              htmlFor="confirm_password"
              className="form-label"
            >
              Confirm New Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="confirm_password"
                type={
                  showConfirm
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
                  setShowConfirm(
                    (current) => !current,
                  )
                }
              >
                {showConfirm
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>


          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Changing Password..."
              : "Change Password"}
          </button>

        </form>


        <div className="auth-footer">

          <Link
            to="/profile"
            className="auth-link"
          >
            Back to Profile
          </Link>

        </div>


        <div className="auth-footer">

          <Link
            to="/dashboard"
            className="auth-link"
          >
            Back to Dashboard
          </Link>

        </div>

      </div>

    </div>
  );
}