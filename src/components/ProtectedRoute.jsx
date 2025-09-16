import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth(); // use context (recommended)

  if (!user) {
    // Not logged in → go to login
    return <Navigate to="/login" replace />;
  }

  // Role check
  // if (role ||  user.role !== role) {
  //   return <Navigate to="/" replace />; // or show Unauthorized page
  // }

  // ✅ Show the protected page
  return children;
};

export default ProtectedRoute;
