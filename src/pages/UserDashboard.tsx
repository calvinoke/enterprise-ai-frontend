import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  updateCurrentUser,
} from "../api/users.api";

import {
  useAuth,
} from "../context/AuthContext";


export default function UserDashboard() {

  const {
    user,
    loadCurrentUser,
  } = useAuth();

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
    isSaving,
    setIsSaving,
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
  // SYNCHRONIZE FORM WITH CURRENT USER
  // ==========================================================

  useEffect(() => {

    if (!user) {
      return;
    }

    setFirstName(user.first_name || "");
    setLastName(user.last_name || "");
    setEmail(user.email || "");

  }, [user]);


  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (!user) {

    return (
      <div className="page-container">

        <div className="dashboard-empty">
          Loading your account...
        </div>

      </div>
    );
  }


  // ==========================================================
  // DYNAMIC GREETING
  // ==========================================================

  const getGreeting = () => {

    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good Morning";
    }

    if (hour < 18) {
      return "Good Afternoon";
    }

    return "Good Evening";
  };


  const greeting = getGreeting();


  // ==========================================================
  // UPDATE OWN PROFILE
  // ==========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();

    try {

      setIsSaving(true);
      setError("");
      setSuccess("");

      await updateCurrentUser({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
      });

      await loadCurrentUser();

      setSuccess(
        "Your profile has been updated successfully.",
      );

    } catch (err: any) {

      setError(
        err?.response?.data?.detail ||
        "Unable to update your profile.",
      );

    } finally {

      setIsSaving(false);

    }
  }


  return (
    <div className="page-container">

      {/* =====================================================
          PAGE INTRODUCTION
      ====================================================== */}

      <section className="page-introduction">

        <div>

          <h2>
            {greeting},{" "}
            {user.first_name || "User"}
          </h2>

          <p>
            Manage your documents, search your knowledge
            base, and interact with your AI assistant.
          </p>

        </div>

      </section>


      {/* =====================================================
          DASHBOARD CARDS
      ====================================================== */}

      <section className="dashboard-grid">

        {/* DOCUMENTS */}

        <Link
          to="/documents"
          className="dashboard-card dashboard-card-link"
        >

          <div className="dashboard-card-icon">
            ▤
          </div>

          <div>

            <h3>
              Documents
            </h3>

            <p>
              Upload and manage your knowledge documents.
            </p>

          </div>

        </Link>


        {/* SEMANTIC SEARCH */}

        <Link
          to="/search"
          className="dashboard-card dashboard-card-link"
        >

          <div className="dashboard-card-icon">
            ⌕
          </div>

          <div>

            <h3>
              Semantic Search
            </h3>

            <p>
              Search your knowledge base using
              AI-powered retrieval.
            </p>

          </div>

        </Link>


        {/* AI CHAT */}

        <Link
          to="/chat"
          className="dashboard-card dashboard-card-link"
        >

          <div className="dashboard-card-icon">
            ◌
          </div>

          <div>

            <h3>
              AI Chat
            </h3>

            <p>
              Ask questions and interact with your
              AI assistant.
            </p>

          </div>

        </Link>


        {/* PROFILE */}

        <Link
          to="/profile"
          className="dashboard-card dashboard-card-link"
        >

          <div className="dashboard-card-icon">
            ◉
          </div>

          <div>

            <h3>
              My Profile
            </h3>

            <p>
              View your account information and security
              settings.
            </p>

          </div>

        </Link>

      </section>


      {/* =====================================================
          ACCOUNT SUMMARY
      ====================================================== */}

      <section className="dashboard-grid dashboard-grid-four">

        <div className="dashboard-stat-card">

          <span>
            Account Role
          </span>

          <strong>
            {user.role === "admin"
              ? "Admin"
              : "User"}
          </strong>

        </div>


        <div className="dashboard-stat-card">

          <span>
            Account Status
          </span>

          <strong>
            {user.is_active
              ? "Active"
              : "Inactive"}
          </strong>

        </div>


        <div className="dashboard-stat-card">

          <span>
            Email Verification
          </span>

          <strong>
            {user.is_verified
              ? "Verified"
              : "Pending"}
          </strong>

        </div>


        <div className="dashboard-stat-card">

          <span>
            Member Since
          </span>

          <strong>
            {user.created_at
              ? new Date(
                  user.created_at,
                ).toLocaleDateString()
              : "N/A"}
          </strong>

        </div>

      </section>


      {/* =====================================================
          MY PROFILE
      ====================================================== */}

      <section className="dashboard-panel">

        <div className="dashboard-panel-header">

          <div>

            <h2>
              My Profile
            </h2>

            <p>
              Update your personal account information.
              Your role and account status are managed
              by the platform.
            </p>

          </div>

          <Link
            to="/change-password"
            className="dashboard-button secondary"
          >
            Change Password
          </Link>

        </div>


        {/* SUCCESS */}

        {success && (
          <div className="dashboard-alert success">
            {success}
          </div>
        )}


        {/* ERROR */}

        {error && (
          <div className="dashboard-alert error">
            {error}
          </div>
        )}


        <form
          className="dashboard-form"
          onSubmit={handleSubmit}
        >

          <div className="form-grid">

            <div className="form-field">

              <label htmlFor="first_name">
                First Name
              </label>

              <input
                id="first_name"
                value={firstName}
                onChange={(event) =>
                  setFirstName(
                    event.target.value,
                  )
                }
                required
              />

            </div>


            <div className="form-field">

              <label htmlFor="last_name">
                Last Name
              </label>

              <input
                id="last_name"
                value={lastName}
                onChange={(event) =>
                  setLastName(
                    event.target.value,
                  )
                }
                required
              />

            </div>

          </div>


          <div className="form-field">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
              required
            />

          </div>


          {/* =================================================
              ACCOUNT INFORMATION
          ================================================== */}

          <div className="account-information">

            <div>

              <span>
                User ID
              </span>

              <strong>
                {user.id}
              </strong>

            </div>


            <div>

              <span>
                Current Role
              </span>

              <strong>
                {user.role}
              </strong>

            </div>


            <div>

              <span>
                Account Status
              </span>

              <strong>
                {user.is_active
                  ? "Active"
                  : "Inactive"}
              </strong>

            </div>


            <div>

              <span>
                Email Status
              </span>

              <strong>
                {user.is_verified
                  ? "Verified"
                  : "Not Verified"}
              </strong>

            </div>

          </div>


          {/* =================================================
              FORM ACTIONS
          ================================================== */}

          <div className="form-actions">

            <button
              type="submit"
              className="dashboard-button primary"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </section>

    </div>
  );
}