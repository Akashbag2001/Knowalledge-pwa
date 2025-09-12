// src/components/Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/login"); // redirect to login after logout
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-200 relative">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-64 h-64 bg-blue-900/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            left: "5%",
            top: "10%",
          }}
        />
        <div
          className="absolute w-80 h-80 bg-purple-900/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
            right: "5%",
            top: "20%",
          }}
        />
        <div
          className="absolute w-52 h-52 bg-emerald-900/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * -0.01}px)`,
            left: "50%",
            bottom: "20%",
          }}
        />
      </div>

      {/* Navbar */}
      <header
        className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
            ? "bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-800 shadow-lg shadow-neutral-900/40"
            : "bg-transparent"
          }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <span className="text-xl font-black text-neutral-900">K</span>
                </div>
                <div className="absolute -inset-1 bg-blue-400/20 rounded-2xl blur-sm group-hover:bg-blue-400/30 transition-all duration-300 -z-10" />
              </div>
              <div className="hidden sm:block">
                <div className="text-2xl font-black text-neutral-100 group-hover:text-blue-400 transition-colors">
                  KNOWALLEDGE
                </div>
                <div className="text-xs text-neutral-500 -mt-1">
                  Next-Gen Learning
                </div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => navigate("/")}
                className="relative px-4 py-2 text-neutral-400 hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-neutral-800"
              >
                Home
              </button>

              {user ? (
                <>
                  {user.role === "user" && (
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="px-4 py-2 text-neutral-400 hover:text-emerald-400 transition-all duration-300 rounded-xl hover:bg-neutral-800"
                    >
                      Dashboard
                    </button>
                  )}
                  {user.role === "superadmin" && (
                    <button
                      onClick={() => navigate("/admin")}
                      className="px-4 py-2 text-neutral-400 hover:text-amber-400 transition-all duration-300 rounded-xl hover:bg-neutral-800 flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3l14 9-14 9V3z"
                        />
                      </svg>
                      Admin Panel
                    </button>
                  )}

                  {/* User Info + Logout */}
                  <div className="flex items-center space-x-3 ml-4">
                    <div className="flex items-center space-x-3 px-4 py-2 bg-neutral-800 rounded-2xl border border-neutral-700 hover:border-neutral-600 transition-all">
                      <div className="relative">
                        <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {user.name?.charAt(0).toUpperCase() ||
                              user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -inset-0.5 bg-blue-400/20 rounded-xl blur-sm -z-10" />
                      </div>
                      <span className="text-sm text-neutral-300 font-medium">
                        {user.name || user.email}
                      </span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="group px-5 py-2 bg-red-500 text-white rounded-2xl font-semibold text-sm hover:bg-red-600 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-lg flex items-center gap-2"
                    >
                      <span>Logout</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 cursor-pointer text-neutral-400 hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-neutral-800"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="group cursor-pointer px-6 py-2 bg-blue-500 rounded-2xl font-semibold text-white hover:bg-blue-600 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-lg flex items-center gap-2"
                  >
                    <span>Join Now</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-neutral-950/80 backdrop-blur-sm border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-neutral-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-white">K</span>
              </div>
              <p className="text-sm">
                © 2025{" "}
                <span className="font-semibold text-neutral-100">
                  KNOWALLEDGE Platform
                </span>
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span>Built with</span>
              <svg
                className="w-4 h-4 text-red-500 animate-pulse"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>for learners worldwide</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
