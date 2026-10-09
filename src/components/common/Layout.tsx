import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function openSidebar() {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="app-layout">
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close navigation"
        />
      )}

      {/* =====================================================
          MAIN APPLICATION AREA
      ====================================================== */}

      <div className="app-main">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <Header onMenuClick={openSidebar} />

        {/* ===================================================
            PAGE CONTENT
        ==================================================== */}

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}