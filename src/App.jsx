import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminDashboard from "./pages/superadmin/AdminDashboard";
import ViewUsers from "./pages/superadmin/ViewUsers";
 // ✅ new page

function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <BrowserRouter>
        <Routes>
          {/* ✅ Routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />

            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="admin"
              element={
                <ProtectedRoute role="superadmin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* ✅ New Route for View Users */}
            <Route
              path="admin/view-users"
              element={
                <ProtectedRoute role="superadmin">
                  <ViewUsers />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ✅ Superadmin login OUTSIDE Layout */}
          <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
