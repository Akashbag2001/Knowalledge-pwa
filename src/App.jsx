import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence, motion } from "framer-motion";
// import "react-quill/dist/quill.snow.css";

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
import AddTopic from "./pages/superadmin/AddTopic";
import AddNews from "./pages/superadmin/AddNews"; // ✅ Import AddNews
import ErrorBoundary from "./ErrorBoundary";
import Profile from "./pages/users/Profile";
import News from "./pages/users/News";

import SuperAdminNewsPage from "./pages/superadmin/SuperAdminNewsPage";
import AddNewTriviaPage from "./pages/superadmin/AddNewTriviaPage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
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
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="news"
              element={
                <ProtectedRoute>
                  <News />
                </ProtectedRoute>
              }
            />

            {/* 🧑‍💼 Super Admin Routes */}
            <Route
              path="admin"
              element={
                <ProtectedRoute role="superadmin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
             <Route
              path="admin/add-trivia"
              element={
                <ProtectedRoute role="superadmin">
                  <ErrorBoundary>
                    <AddNewTriviaPage />
                  </ErrorBoundary>
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
              path="admin/all-news"
              element={
                <ProtectedRoute role="superadmin">
                  <SuperAdminNewsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="admin/add-topics"
              element={
                <ProtectedRoute role="superadmin">
                  <AddTopic />
                </ProtectedRoute>
              }
            />

            {/* ✅ Add News Route */}
            <Route
              path="admin/add-news"
              element={
                <ProtectedRoute role="superadmin">
                  <ErrorBoundary>
                    <AddNews />
                  </ErrorBoundary>
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
