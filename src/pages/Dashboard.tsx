import { useAuth } from "../context/AuthContext";

import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";


export default function Dashboard() {

  const { user } = useAuth();


  // ProtectedRoute should normally ensure that
  // a user exists before Dashboard is rendered.

  if (!user) {
    return (
      <div className="page-container">
        <div className="dashboard-empty">
          Loading dashboard...
        </div>
      </div>
    );
  }


  // Administrator dashboard

  if (user.role === "admin") {
    return <AdminDashboard />;
  }


  // Normal user dashboard

  return <UserDashboard />;
}