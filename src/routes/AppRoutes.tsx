import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";


// ==========================================================
// PUBLIC PAGES
// ==========================================================

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";


// ==========================================================
// PROTECTED PAGES
// ==========================================================

import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import Documents from "../pages/Documents";
import Search from "../pages/Search";
import Chat from "../pages/Chat";
import ChangePassword from "../pages/ChangePassword";


// ==========================================================
// ADMIN ONLY
// ==========================================================

import AIServices from "../pages/AIServices";
import AdminRoute from "../components/common/AdminRoute";


// ==========================================================
// ROUTE GUARDS / LAYOUT
// ==========================================================

import ProtectedRoute from "../components/common/ProtectedRoute";
import Layout from "../components/common/Layout";


export default function AppRoutes() {

  return (
    <BrowserRouter>

      <Routes>

        {/* ==================================================
            PUBLIC ROUTES
        =================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />


        {/* ==================================================
            AUTHENTICATED ROUTES
        =================================================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<Layout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/change-password"
              element={<ChangePassword />}
            />

            <Route
              path="/documents"
              element={<Documents />}
            />

            <Route
              path="/search"
              element={<Search />}
            />

            <Route
              path="/chat"
              element={<Chat />}
            />


            {/* ==============================================
                ADMIN ONLY ROUTES
            =============================================== */}

            <Route element={<AdminRoute />}>

              <Route
                path="/ai-services"
                element={<AIServices />}
              />

            </Route>

          </Route>

        </Route>


        {/* ==================================================
            DEFAULT
        =================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* ==================================================
            UNKNOWN ROUTES
        =================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}