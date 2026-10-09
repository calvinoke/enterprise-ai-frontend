import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
}

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "⌂",
  },
  {
    label: "Profile",
    path: "/profile",
    icon: "◉",
  },
  {
    label: "Documents",
    path: "/documents",
    icon: "▤",
  },
  {
    label: "Search",
    path: "/search",
    icon: "⌕",
  },
  {
    label: "Chat",
    path: "/chat",
    icon: "◌",
  },
];

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    await logout();

    onClose();

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================================
  // DISPLAY NAME
  // ==========================================================

  const displayName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.email || "User";

  // ==========================================================
  // ADMIN CHECK
  // ==========================================================

  const isAdmin = user?.role === "admin";

  return (
    <aside
      className={`app-sidebar ${
        isOpen ? "sidebar-open" : ""
      }`}
    >
      {/* =====================================================
          SIDEBAR HEADER
      ====================================================== */}

      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-logo">
            AI
          </div>

          <div className="brand-text">
            <span className="brand-title">
              Enterprise AI
            </span>

            <span className="brand-subtitle">
              Platform
            </span>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          ×
        </button>
      </div>

      {/* =====================================================
          CURRENT USER
      ====================================================== */}

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          {displayName
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="sidebar-user-info">
          <span className="sidebar-user-name">
            {displayName}
          </span>

          <span className="sidebar-user-email">
            {user?.email || ""}
          </span>
        </div>
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav className="sidebar-navigation">
        <div className="navigation-label">
          APPLICATION
        </div>

        {/* ===================================================
            STANDARD NAVIGATION
        ==================================================== */}

        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `navigation-link ${
                isActive
                  ? "navigation-link-active"
                  : ""
              }`
            }
          >
            <span className="navigation-icon">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>
          </NavLink>
        ))}

        {/* ===================================================
            ADMIN-ONLY NAVIGATION
        ==================================================== */}

        {isAdmin && (
          <>
            <div className="navigation-label navigation-label-admin">
              ADMINISTRATION
            </div>

            <NavLink
              to="/ai-services"
              onClick={onClose}
              className={({ isActive }) =>
                `navigation-link ${
                  isActive
                    ? "navigation-link-active"
                    : ""
                }`
              }
            >
              <span className="navigation-icon">
                ◈
              </span>

              <span>
                AI Services
              </span>
            </NavLink>
          </>
        )}
      </nav>

      {/* =====================================================
          SIDEBAR FOOTER
      ====================================================== */}

      <div className="sidebar-footer">
        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <span className="navigation-icon">
            ⇥
          </span>

          <span>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}