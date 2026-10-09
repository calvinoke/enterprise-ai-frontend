import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/documents": "Documents",
  "/search": "Search",
  "/chat": "Chat",
};

export default function Header({
  onMenuClick,
}: HeaderProps) {
  const location = useLocation();

  const { user } = useAuth();

  const pageTitle =
    pageTitles[location.pathname] ||
    "Enterprise AI Platform";

  const displayName =
    user?.first_name ||
    user?.email ||
    "User";

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          ☰
        </button>

        <div>
          <h1 className="header-title">
            {pageTitle}
          </h1>

          <p className="header-subtitle">
            Enterprise AI Platform
          </p>
        </div>
      </div>

      <div className="header-user">
        <div className="header-user-avatar">
          {displayName
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="header-user-info">
          <span className="header-user-name">
            {displayName}
          </span>

          <span className="header-user-status">
            Online
          </span>
        </div>
      </div>
    </header>
  );
}