import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth(); // ✅ include loading from context

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // ✅ Role check (only if role is provided)
  if (role && user.role !== role) {
    return <Navigate to="/" replace />; // or to a custom Unauthorized page
  }

  // ✅ Show the protected page
  return children;
};

export default ProtectedRoute;
