import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminLogin from "./pages/SuperAdminLogin"; // ✅
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";

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
      // style={{
      //   width: "auto",
      //   maxWidth: "350px",
      //   backgroundColor: "#1E2D5B", // dark blue background
      //   color: "#F3F4F6", // light text
      //   fontWeight: "600",
      //   fontSize: "14px",
      //   borderRadius: "12px",
      //   boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      //   padding: "12px 20px",
      //   border: "1px solid #3B4A8F",
      //   textAlign: "center",
      // }}
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
                <ProtectedRoute role="user">
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
          </Route>

          {/* ✅ Superadmin login OUTSIDE Layout */}
          <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
