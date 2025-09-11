import { Navigate } from "react-router-dom";

const ProtectedRoute = ({role}) => {
  // ✅ Get user from localStorage (or AuthContext if you prefer)
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Not logged in → go to login page
    return <Navigate to="/login" replace />;
  }

  // ✅ Role-based navigation
  if (role === "superadmin") {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

export default ProtectedRoute;
