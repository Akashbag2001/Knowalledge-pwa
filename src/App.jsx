import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence, motion } from "framer-motion";

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
import AddSchool from "./pages/superadmin/AddSchool";
import AddTopic from "./pages/superadmin/AddTopic"; // ✅ Import AddTopic

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname} // triggers animation on route change
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
      >
        <Routes location={location} key={location.pathname}>
          {/* ✅ Routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forget-password" element={<ForgetPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
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

            <Route
              path="admin/add-school"
              element={
                <ProtectedRoute role="superadmin">
                  <AddSchool />
                </ProtectedRoute>
              }
            />

            <Route
              path="admin/add-topics" // ✅ New route
              element={
                <ProtectedRoute role="superadmin">
                  <AddTopic />
                </ProtectedRoute>
              }
            />

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
      </motion.div>
    </AnimatePresence>
  );
}

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
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
