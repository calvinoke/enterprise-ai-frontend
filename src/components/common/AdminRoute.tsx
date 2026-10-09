import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";


export default function AdminRoute() {

  const {
    user,
  } = useAuth();


  // ==========================================================
  // USER NOT AVAILABLE
  // ==========================================================

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // ==========================================================
  // ADMIN CHECK
  // ==========================================================

  if (user.role !== "admin") {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  // ==========================================================
  // ADMIN AUTHORIZED
  // ==========================================================

  return <Outlet />;
}