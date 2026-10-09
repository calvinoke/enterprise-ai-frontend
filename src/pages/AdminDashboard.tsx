import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { Link } from "react-router-dom";

import {
  activateUser,
  createUser,
  deactivateUser,
  deleteUser,
  getUsers,
  updateUser,
  updateUserRole,
  type UserRole,
} from "../api/users.api";

import type { CurrentUser } from "../types/users";

import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();

  // ==========================================================
  // USERS
  // ==========================================================

  const [users, setUsers] = useState<CurrentUser[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isCreating, setIsCreating] = useState(false);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState<CurrentUser | null>(null);

  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // ==========================================================
  // CREATE USER FORM
  // ==========================================================

  const [createFirstName, setCreateFirstName] =
    useState("");

  const [createLastName, setCreateLastName] =
    useState("");

  const [createEmail, setCreateEmail] =
    useState("");

  const [createPassword, setCreatePassword] =
    useState("");

  const [createRole, setCreateRole] =
    useState<UserRole>("user");

  // ==========================================================
  // EDIT USER FORM
  // ==========================================================

  const [editFirstName, setEditFirstName] =
    useState("");

  const [editLastName, setEditLastName] =
    useState("");

  const [editEmail, setEditEmail] =
    useState("");

  // ==========================================================
  // DYNAMIC GREETING
  // ==========================================================

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good Morning";
    }

    if (hour < 18) {
      return "Good Afternoon";
    }

    return "Good Evening";
  }

  // ==========================================================
  // LOAD USERS
  // ==========================================================

  async function loadUsers() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getUsers();

      setUsers(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to load users.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  // ==========================================================
  // CREATE USER
  // ==========================================================

  async function handleCreateUser(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setIsCreating(true);

      setError("");

      setSuccess("");

      await createUser({
        first_name: createFirstName.trim(),
        last_name: createLastName.trim(),
        email: createEmail.trim(),
        password: createPassword,
        role: createRole,
      });

      // Clear form fields.
      setCreateFirstName("");
      setCreateLastName("");
      setCreateEmail("");
      setCreatePassword("");
      setCreateRole("user");

      // Close form after successful creation.
      setShowCreateForm(false);

      setSuccess(
        "User account created successfully.",
      );

      await loadUsers();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to create user.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  // ==========================================================
  // START EDIT
  // ==========================================================

  function startEdit(targetUser: CurrentUser) {
    setEditingUser(targetUser);

    setEditFirstName(targetUser.first_name);

    setEditLastName(targetUser.last_name);

    setEditEmail(targetUser.email);

    setError("");

    setSuccess("");
  }

  // ==========================================================
  // CANCEL EDIT
  // ==========================================================

  function cancelEdit() {
    setEditingUser(null);

    setEditFirstName("");

    setEditLastName("");

    setEditEmail("");
  }

  // ==========================================================
  // UPDATE USER
  // ==========================================================

  async function handleEditUser(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!editingUser) {
      return;
    }

    try {
      setError("");

      setSuccess("");

      await updateUser(editingUser.id, {
        first_name: editFirstName.trim(),
        last_name: editLastName.trim(),
        email: editEmail.trim(),
      });

      setSuccess(
        "User profile updated successfully.",
      );

      cancelEdit();

      await loadUsers();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to update user.",
      );
    }
  }

  // ==========================================================
  // CHANGE ROLE
  // ==========================================================

  async function handleRoleChange(
    targetUser: CurrentUser,
    role: UserRole,
  ) {
    // Prevent administrators from changing
    // their own administrator role.
    if (
      currentUser &&
      targetUser.id === currentUser.id
    ) {
      setError(
        "You cannot change your own administrator role.",
      );

      return;
    }

    try {
      setError("");

      setSuccess("");

      await updateUserRole(
        targetUser.id,
        role,
      );

      setSuccess(
        `${targetUser.first_name} ${targetUser.last_name} is now ${role}.`,
      );

      await loadUsers();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to update user role.",
      );
    }
  }

  // ==========================================================
  // ACTIVATE USER
  // ==========================================================

  async function handleActivate(
    targetUser: CurrentUser,
  ) {
    try {
      setError("");

      setSuccess("");

      await activateUser(targetUser.id);

      setSuccess(
        "User account activated successfully.",
      );

      await loadUsers();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to activate user.",
      );
    }
  }

  // ==========================================================
  // DEACTIVATE USER
  // ==========================================================

  async function handleDeactivate(
    targetUser: CurrentUser,
  ) {
    // Prevent administrators from
    // deactivating their own account.
    if (
      currentUser &&
      targetUser.id === currentUser.id
    ) {
      setError(
        "You cannot deactivate your own administrator account.",
      );

      return;
    }

    try {
      setError("");

      setSuccess("");

      await deactivateUser(targetUser.id);

      setSuccess(
        "User account deactivated successfully.",
      );

      await loadUsers();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to deactivate user.",
      );
    }
  }

  // ==========================================================
  // DELETE USER
  // ==========================================================

  async function handleDelete(
    targetUser: CurrentUser,
  ) {
    // Prevent administrators from
    // deleting their own account.
    if (
      currentUser &&
      targetUser.id === currentUser.id
    ) {
      setError(
        "You cannot delete your own administrator account.",
      );

      return;
    }

    const confirmed = window.confirm(
      `Delete ${targetUser.first_name} ${targetUser.last_name}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      setSuccess("");

      await deleteUser(targetUser.id);

      setSuccess(
        "User deleted successfully.",
      );

      await loadUsers();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to delete user.",
      );
    }
  }

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalUsers = users.length;

  const adminCount = users.filter(
    (item) => item.role === "admin",
  ).length;

  const activeCount = users.filter(
    (item) => item.is_active,
  ).length;

  const verifiedCount = users.filter(
    (item) => item.is_verified,
  ).length;

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="page-container">
      {/* =====================================================
          PAGE INTRODUCTION
      ====================================================== */}

      <section className="page-introduction">
        <div>
          <h2>
            {getGreeting()},{" "}
            {currentUser?.first_name || "Admin"}
          </h2>

          <p>
            Manage users, permissions, platform access,
            documents, search, and AI services.
          </p>
        </div>
      </section>

      {/* =====================================================
          ADMIN DASHBOARD FEATURE CARDS
      ====================================================== */}

      <section className="dashboard-grid">
        {/* ===================================================
            USER MANAGEMENT
        ==================================================== */}

        <div className="dashboard-card admin-feature-card">
          <div className="dashboard-card-icon">
            ♟
          </div>

          <div>
            <h3>
              User Management
            </h3>

            <p>
              Create, update, promote, deactivate,
              and remove user accounts.
            </p>
          </div>
        </div>

        {/* ===================================================
            DOCUMENTS
        ==================================================== */}

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
              Manage the platform knowledge documents.
            </p>
          </div>
        </Link>

        {/* ===================================================
            SEMANTIC SEARCH
        ==================================================== */}

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
              Search and inspect the platform knowledge
              base.
            </p>
          </div>
        </Link>

        {/* ===================================================
            AI CHAT
        ==================================================== */}

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
              Interact with and test the AI assistant.
            </p>
          </div>
        </Link>

        {/* ===================================================
            AI SERVICES
        ==================================================== */}

        <Link
          to="/ai-services"
          className="dashboard-card dashboard-card-link"
        >
          <div className="dashboard-card-icon">
            ◈
          </div>

          <div>
            <h3>
              AI Services
            </h3>

            <p>
              Monitor embeddings, AI models,
              diagnostics, and service health.
            </p>
          </div>
        </Link>
      </section>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <section className="dashboard-grid dashboard-grid-four">
        {/* ===================================================
            TOTAL USERS
        ==================================================== */}

        <div className="dashboard-stat-card">
          <span>
            Total Users
          </span>

          <strong>
            {totalUsers}
          </strong>
        </div>

        {/* ===================================================
            ADMINISTRATORS
        ==================================================== */}

        <div className="dashboard-stat-card">
          <span>
            Administrators
          </span>

          <strong>
            {adminCount}
          </strong>
        </div>

        {/* ===================================================
            ACTIVE ACCOUNTS
        ==================================================== */}

        <div className="dashboard-stat-card">
          <span>
            Active Accounts
          </span>

          <strong>
            {activeCount}
          </strong>
        </div>

        {/* ===================================================
            VERIFIED ACCOUNTS
        ==================================================== */}

        <div className="dashboard-stat-card">
          <span>
            Verified Accounts
          </span>

          <strong>
            {verifiedCount}
          </strong>
        </div>
      </section>

      {/* =====================================================
          SUCCESS MESSAGE
      ====================================================== */}

      {success && (
        <div className="dashboard-alert success">
          {success}
        </div>
      )}

      {/* =====================================================
          ERROR MESSAGE
      ====================================================== */}

      {error && (
        <div className="dashboard-alert error">
          {error}
        </div>
      )}

      {/* =====================================================
          CREATE USER PANEL
      ====================================================== */}

      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <h2>
              User Accounts
            </h2>

            <p>
              Administrators have full user-management
              permissions.
            </p>
          </div>

          <button
            type="button"
            className="dashboard-button primary"
            onClick={() =>
              setShowCreateForm(
                !showCreateForm,
              )
            }
          >
            {showCreateForm
              ? "Close Form"
              : "Create User"}
          </button>
        </div>

        {/* =================================================
            CREATE FORM
        ================================================== */}

        {showCreateForm && (
          <form
            className="admin-create-form"
            onSubmit={handleCreateUser}
          >
            {/* FIRST NAME + LAST NAME */}

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="create_first_name">
                  First Name
                </label>

                <input
                  id="create_first_name"
                  type="text"
                  value={createFirstName}
                  onChange={(event) =>
                    setCreateFirstName(
                      event.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="create_last_name">
                  Last Name
                </label>

                <input
                  id="create_last_name"
                  type="text"
                  value={createLastName}
                  onChange={(event) =>
                    setCreateLastName(
                      event.target.value,
                    )
                  }
                  required
                />
              </div>
            </div>

            {/* EMAIL + ROLE */}

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="create_email">
                  Email Address
                </label>

                <input
                  id="create_email"
                  type="email"
                  value={createEmail}
                  onChange={(event) =>
                    setCreateEmail(
                      event.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="create_role">
                  Role
                </label>

                <select
                  id="create_role"
                  value={createRole}
                  onChange={(event) =>
                    setCreateRole(
                      event.target.value as UserRole,
                    )
                  }
                >
                  <option value="user">
                    User
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </div>
            </div>

            {/* PASSWORD */}

            <div className="form-field">
              <label htmlFor="create_password">
                Temporary Password
              </label>

              <input
                id="create_password"
                type="password"
                value={createPassword}
                onChange={(event) =>
                  setCreatePassword(
                    event.target.value,
                  )
                }
                minLength={8}
                required
              />
            </div>

            {/* FORM ACTIONS */}

            <div className="form-actions">
              <button
                type="submit"
                className="dashboard-button primary"
                disabled={isCreating}
              >
                {isCreating
                  ? "Creating..."
                  : "Create Account"}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* =====================================================
          EDIT USER PANEL
      ====================================================== */}

      {editingUser && (
        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>
                Edit User
              </h2>

              <p>
                Update{" "}
                {editingUser.first_name}{" "}
                {editingUser.last_name}'s account details.
              </p>
            </div>

            <button
              type="button"
              className="dashboard-button secondary"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>

          <form
            className="dashboard-form"
            onSubmit={handleEditUser}
          >
            {/* FIRST NAME + LAST NAME */}

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="edit_first_name">
                  First Name
                </label>

                <input
                  id="edit_first_name"
                  type="text"
                  value={editFirstName}
                  onChange={(event) =>
                    setEditFirstName(
                      event.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit_last_name">
                  Last Name
                </label>

                <input
                  id="edit_last_name"
                  type="text"
                  value={editLastName}
                  onChange={(event) =>
                    setEditLastName(
                      event.target.value,
                    )
                  }
                  required
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="form-field">
              <label htmlFor="edit_email">
                Email Address
              </label>

              <input
                id="edit_email"
                type="email"
                value={editEmail}
                onChange={(event) =>
                  setEditEmail(
                    event.target.value,
                  )
                }
                required
              />
            </div>

            {/* FORM ACTIONS */}

            <div className="form-actions">
              <button
                type="submit"
                className="dashboard-button primary"
              >
                Save User
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =====================================================
          USERS TABLE
      ====================================================== */}

      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <h2>
              User Management
            </h2>

            <p>
              View and manage every platform account.
            </p>
          </div>

          <button
            type="button"
            className="dashboard-button secondary"
            onClick={() =>
              void loadUsers()
            }
          >
            Refresh
          </button>
        </div>

        {/* =================================================
            LOADING
        ================================================== */}

        {isLoading ? (
          <div className="dashboard-empty">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="dashboard-empty">
            No users found.
          </div>
        ) : (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>
                    User
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Verification
                  </th>

                  <th>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((targetUser) => {
                  const isCurrentAdmin =
                    currentUser?.id ===
                    targetUser.id;

                  return (
                    <tr
                      key={targetUser.id}
                    >
                      {/* USER */}

                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {targetUser.first_name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {targetUser.first_name}{" "}
                              {targetUser.last_name}
                            </strong>

                            {isCurrentAdmin && (
                              <small>
                                You
                              </small>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}

                      <td>
                        {targetUser.email}
                      </td>

                      {/* ROLE */}

                      <td>
                        <select
                          className="role-select"
                          value={
                            targetUser.role
                          }
                          disabled={
                            isCurrentAdmin
                          }
                          onChange={(event) =>
                            void handleRoleChange(
                              targetUser,
                              event.target.value as UserRole,
                            )
                          }
                        >
                          <option value="user">
                            User
                          </option>

                          <option value="admin">
                            Admin
                          </option>
                        </select>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={
                            targetUser.is_active
                              ? "status-badge active"
                              : "status-badge inactive"
                          }
                        >
                          {targetUser.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* VERIFICATION */}

                      <td>
                        <span
                          className={
                            targetUser.is_verified
                              ? "status-badge verified"
                              : "status-badge unverified"
                          }
                        >
                          {targetUser.is_verified
                            ? "Verified"
                            : "Unverified"}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="action-group">
                          {/* EDIT */}

                          <button
                            type="button"
                            className="dashboard-button small"
                            onClick={() =>
                              startEdit(
                                targetUser,
                              )
                            }
                          >
                            Edit
                          </button>

                          {/* ACTIVATE / DEACTIVATE */}

                          {!targetUser.is_active ? (
                            <button
                              type="button"
                              className="dashboard-button small"
                              onClick={() =>
                                void handleActivate(
                                  targetUser,
                                )
                              }
                            >
                              Activate
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="dashboard-button small warning"
                              disabled={
                                isCurrentAdmin
                              }
                              onClick={() =>
                                void handleDeactivate(
                                  targetUser,
                                )
                              }
                            >
                              Deactivate
                            </button>
                          )}

                          {/* DELETE */}

                          <button
                            type="button"
                            className="dashboard-button small danger"
                            disabled={
                              isCurrentAdmin
                            }
                            onClick={() =>
                              void handleDelete(
                                targetUser,
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}