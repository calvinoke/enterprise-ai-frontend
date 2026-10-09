import {
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  register,
} from "../api/auth.api";

import {
  getApiErrorMessage,
} from "../utils/apiError";


export default function Register() {

  const navigate = useNavigate();


  const [
    firstName,
    setFirstName,
  ] = useState("");

  const [
    lastName,
    setLastName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
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


  const [
    error,
    setError,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);


  function validatePassword(
    value: string,
  ) {

    if (!value) {
      return "Password is required.";
    }

    if (value.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number.";
    }

    if (!/[^A-Za-z0-9]/.test(value)) {
      return "Password must contain at least one special character.";
    }

    return "";
  }


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();

    setError("");


    if (!firstName.trim()) {

      setError(
        "First name is required.",
      );

      return;
    }


    if (!lastName.trim()) {

      setError(
        "Last name is required.",
      );

      return;
    }


    if (!email.trim()) {

      setError(
        "Email is required.",
      );

      return;
    }


    if (!password) {

      setError(
        "Password is required.",
      );

      return;
    }


    const passwordError =
      validatePassword(password);

    if (passwordError) {

      setError(passwordError);

      return;
    }


    if (
      password !== confirmPassword
    ) {

      setError(
        "Passwords do not match.",
      );

      return;
    }


    try {

      setLoading(true);

      await register({
        first_name:
          firstName.trim(),

        last_name:
          lastName.trim(),

        email:
          email.trim(),

        password,
      });


      navigate(
        `/verify-email?email=${encodeURIComponent(
          email.trim(),
        )}`,
      );

    } catch (error: unknown) {

      setError(
        getApiErrorMessage(
          error,
          "Registration failed.",
        ),
      );

    } finally {

      setLoading(false);

    }
  }


  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* BRAND */}

        <div className="auth-brand">

          <h1 className="auth-title">
            AI/RAG Documents Processing System
          </h1>

          <p className="auth-subtitle">
            Create your account
          </p>

        </div>


        <h2 className="auth-heading">
          Register
        </h2>


        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          noValidate
        >

          {/* FIRST NAME */}

          <div className="form-group">

            <label
              htmlFor="first_name"
              className="form-label"
            >
              First Name
            </label>

            <input
              id="first_name"
              type="text"
              className="form-input"
              value={firstName}
              onChange={(event) =>
                setFirstName(
                  event.target.value,
                )
              }
              placeholder="Enter your first name"
              autoComplete="given-name"
              required
            />

          </div>


          {/* LAST NAME */}

          <div className="form-group">

            <label
              htmlFor="last_name"
              className="form-label"
            >
              Last Name
            </label>

            <input
              id="last_name"
              type="text"
              className="form-input"
              value={lastName}
              onChange={(event) =>
                setLastName(
                  event.target.value,
                )
              }
              placeholder="Enter your last name"
              autoComplete="family-name"
              required
            />

          </div>


          {/* EMAIL */}

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


          {/* PASSWORD */}

          <div className="form-group">

            <label
              htmlFor="password"
              className="form-label"
            >
              Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className="form-input password-input"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder="Create a strong password"
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


          {/* CONFIRM PASSWORD */}

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
                placeholder="Confirm your password"
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
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        {/* LOGIN */}

        <div className="auth-footer">

          Already have an account?{" "}

          <Link
            to="/login"
            className="auth-link"
          >
            Login
          </Link>

        </div>


        {/* EMAIL VERIFICATION */}

        <div className="auth-footer">

          Already registered but need to verify?{" "}

          <Link
            to="/verify-email"
            className="auth-link"
          >
            Verify your email
          </Link>

        </div>

      </div>

    </div>
  );
}