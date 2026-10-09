import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card empty-profile">
          <div className="profile-avatar">?</div>

          <h2>No user information available</h2>

          <p>
            We could not load your profile information.
            Please log in again.
          </p>

          <Link
            to="/login"
            className="dashboard-button primary"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const fullName =
    `${user.first_name} ${user.last_name}`.trim();

  const initials =
    `${user.first_name?.charAt(0) || ""}${user.last_name?.charAt(0) || ""}`
      .toUpperCase();

  const formattedCreatedAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )
    : "N/A";

  const formattedUpdatedAt = user.updated_at
    ? new Date(user.updated_at).toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )
    : "N/A";

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="profile-page-header">
          <div>
            <h1 className="profile-page-title">
              My Profile
            </h1>

            <p className="profile-page-subtitle">
              View and manage your account information.
            </p>
          </div>

          <div className="profile-header-actions">
            <Link
              to="/dashboard"
              className="dashboard-button secondary"
            >
              Dashboard
            </Link>

            <Link
              to="/change-password"
              className="dashboard-button primary"
            >
              Change Password
            </Link>
          </div>
        </div>

        {/* =====================================================
            PROFILE CARD
        ====================================================== */}

        <div className="profile-card">

          {/* ===================================================
              PROFILE HEADER
          ==================================================== */}

          <div className="profile-header">

            <div className="profile-avatar">
              {initials || "U"}
            </div>

            <div className="profile-header-info">
              <h2 className="profile-name">
                {fullName || "User"}
              </h2>

              <p className="profile-email">
                {user.email}
              </p>

              <div className="profile-badges">

                <span className="profile-badge role-badge">
                  {user.role === "admin"
                    ? "Administrator"
                    : "User"}
                </span>

                <span
                  className={`profile-badge ${
                    user.is_active
                      ? "status-active"
                      : "status-inactive"
                  }`}
                >
                  {user.is_active
                    ? "Active"
                    : "Inactive"}
                </span>

                <span
                  className={`profile-badge ${
                    user.is_verified
                      ? "status-verified"
                      : "status-unverified"
                  }`}
                >
                  {user.is_verified
                    ? "Verified"
                    : "Not Verified"}
                </span>

              </div>
            </div>

          </div>

          {/* ===================================================
              ACCOUNT INFORMATION
          ==================================================== */}

          <div className="profile-section">

            <h3 className="profile-section-title">
              Account Information
            </h3>

            <div className="profile-grid">

              <div className="profile-field">
                <span className="profile-field-label">
                  First Name
                </span>

                <span className="profile-field-value">
                  {user.first_name || "N/A"}
                </span>
              </div>

              <div className="profile-field">
                <span className="profile-field-label">
                  Last Name
                </span>

                <span className="profile-field-value">
                  {user.last_name || "N/A"}
                </span>
              </div>

              <div className="profile-field">
                <span className="profile-field-label">
                  Email Address
                </span>

                <span className="profile-field-value">
                  {user.email}
                </span>
              </div>

              <div className="profile-field">
                <span className="profile-field-label">
                  User ID
                </span>

                <span className="profile-field-value profile-id">
                  {user.id}
                </span>
              </div>

              <div className="profile-field">
                <span className="profile-field-label">
                  Role
                </span>

                <span className="profile-field-value">
                  {user.role === "admin"
                    ? "Administrator"
                    : "User"}
                </span>
              </div>

              <div className="profile-field">
                <span className="profile-field-label">
                  Account Status
                </span>

                <span className="profile-field-value">
                  {user.is_active
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>

              <div className="profile-field">
                <span className="profile-field-label">
                  Email Verification
                </span>

                <span className="profile-field-value">
                  {user.is_verified
                    ? "Verified"
                    : "Not Verified"}
                </span>
              </div>

              <div className="profile-field">
                <span className="profile-field-label">
                  Account Created
                </span>

                <span className="profile-field-value">
                  {formattedCreatedAt}
                </span>
              </div>

              <div className="profile-field">
                <span className="profile-field-label">
                  Last Updated
                </span>

                <span className="profile-field-value">
                  {formattedUpdatedAt}
                </span>
              </div>

            </div>
          </div>

          {/* ===================================================
              ACCOUNT ACTIONS
          ==================================================== */}

          <div className="profile-section">

            <h3 className="profile-section-title">
              Account Actions
            </h3>

            <div className="profile-actions">

              <Link
                to="/dashboard"
                className="dashboard-button secondary"
              >
                Edit Profile
              </Link>

              <Link
                to="/change-password"
                className="dashboard-button primary"
              >
                Change Password
              </Link>

              <button
                type="button"
                className="profile-logout-button"
                onClick={logout}
              >
                Logout
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}