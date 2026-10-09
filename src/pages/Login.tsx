import {
  useState,
  type SyntheticEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getApiErrorMessage,
} from "../utils/apiError";

import {
  useAuth,
} from "../context/AuthContext";


export default function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();


  // =========================================
  // FORM VALUES
  // =========================================

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");


  // =========================================
  // PASSWORD VISIBILITY
  // =========================================

  const [showPassword, setShowPassword] =
    useState(false);


  // =========================================
  // VALIDATION ERRORS
  // =========================================

  const [emailError, setEmailError] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");


  // =========================================
  // TOUCHED STATES
  // =========================================

  const [emailTouched, setEmailTouched] =
    useState(false);

  const [passwordTouched, setPasswordTouched] =
    useState(false);


  // =========================================
  // API ERROR AND LOADING
  // =========================================

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  // =========================================
  // EMAIL VALIDATION
  // =========================================

  const validateEmail = (
    value: string,
  ) => {

    if (!value.trim()) {
      return "Email is required.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        value,
      )
    ) {
      return "Please enter a valid email address.";
    }

    return "";
  };


  // =========================================
  // PASSWORD VALIDATION
  // =========================================

  const validatePassword = (
    value: string,
  ) => {

    if (!value.trim()) {
      return "Password is required.";
    }

    return "";
  };


  // =========================================
  // FORM VALIDATION
  // =========================================

  const validateForm = () => {

    const emailValidation =
      validateEmail(email);

    const passwordValidation =
      validatePassword(password);

    setEmailError(
      emailValidation,
    );

    setPasswordError(
      passwordValidation,
    );

    setEmailTouched(true);

    setPasswordTouched(true);

    return (
      !emailValidation &&
      !passwordValidation
    );
  };


  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async (
    event: SyntheticEvent<
      HTMLFormElement
    >,
  ) => {

    event.preventDefault();

    setError("");


    // Stop submission if validation fails
    if (!validateForm()) {
      return;
    }


    setLoading(true);


    try {

      await login({
        email: email.trim(),
        password,
      });


      // Both USER and ADMIN use the
      // same dashboard route.
      //
      // Dashboard.tsx decides which
      // dashboard to display based
      // on user.role.

      navigate("/dashboard");

    } catch (error: unknown) {

      const message =
        getApiErrorMessage(
          error,
          "Login failed",
        );

      setError(message);

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="auth-page">

      <div className="auth-card auth-card-login">


        {/* =====================================
            APPLICATION BRANDING
        ====================================== */}

        <div className="auth-brand">

          <h1 className="auth-title">
            AI/RAG Documents Processing System
          </h1>

          <p className="auth-subtitle">
            Sign in to continue to your workspace
          </p>

        </div>


        {/* =====================================
            LOGIN HEADING
        ====================================== */}

        <h2 className="auth-heading">
          Login
        </h2>


        {/* =====================================
            API ERROR
        ====================================== */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          noValidate
        >


          {/* ===================================
              EMAIL
          ==================================== */}

          <div className="form-group">

            <label
              htmlFor="email"
              className="form-label"
            >
              Email
            </label>


            <input
              id="email"
              className={`form-input ${
                emailError &&
                emailTouched
                  ? "input-error"
                  : ""
              }`}
              type="email"
              value={email}
              onChange={(event) => {

                const value =
                  event.target.value;

                setEmail(value);

                if (emailTouched) {

                  setEmailError(
                    validateEmail(
                      value,
                    ),
                  );
                }
              }}
              onBlur={() => {

                setEmailTouched(true);

                setEmailError(
                  validateEmail(
                    email,
                  ),
                );
              }}
              placeholder="Enter your email"
              autoComplete="email"
            />


            {emailError &&
              emailTouched && (

                <p className="field-error">
                  {emailError}
                </p>

            )}

          </div>


          {/* ===================================
              PASSWORD
          ==================================== */}

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
                className={`form-input password-input ${
                  passwordError &&
                  passwordTouched
                    ? "input-error"
                    : ""
                }`}
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) => {

                  const value =
                    event.target.value;

                  setPassword(value);

                  if (
                    passwordTouched
                  ) {

                    setPasswordError(
                      validatePassword(
                        value,
                      ),
                    );
                  }
                }}
                onBlur={() => {

                  setPasswordTouched(
                    true,
                  );

                  setPasswordError(
                    validatePassword(
                      password,
                    ),
                  );
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
              />


              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current,
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>


            {passwordError &&
              passwordTouched && (

                <p className="field-error">
                  {passwordError}
                </p>

            )}

          </div>


          {/* ===================================
              FORGOT PASSWORD
          ==================================== */}

          <div
            style={{
              textAlign: "right",
              marginBottom: "20px",
            }}
          >

            <Link
              to="/forgot-password"
              className="auth-link"
            >
              Forgot password?
            </Link>

          </div>


          {/* ===================================
              LOGIN BUTTON
          ==================================== */}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* =====================================
            VERIFICATION
        ====================================== */}

        <div className="auth-footer">

          <Link
            to="/verify-email"
            className="auth-link"
          >
            Need to verify your email?
          </Link>

        </div>


        {/* =====================================
            REGISTRATION
        ====================================== */}

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