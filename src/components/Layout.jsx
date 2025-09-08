// src/components/Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800 relative overflow-hidden">
      {/* Subtle floating shapes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute w-40 h-40 bg-gradient-to-r from-cyan-200/30 to-purple-200/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            left: "5%",
            top: "10%",
          }}
        />
        <div
          className="absolute w-52 h-52 bg-gradient-to-r from-pink-200/30 to-blue-200/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
            right: "5%",
            top: "20%",
          }}
        />
      </div>

      {/* Navbar */}
      <header
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl font-black text-white">K</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                  KNOWLEDGE
                </span>
                <div className="text-xs text-gray-500 -mt-1">Next-Gen Learning</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="relative px-4 py-2 text-gray-600 hover:text-cyan-600 transition-all duration-300"
              >
                Home
              </Link>

              {user ? (
                <>
                  {user.role === "user" && (
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 text-gray-600 hover:text-green-600 transition"
                    >
                      Dashboard
                    </Link>
                  )}
                  {user.role === "superadmin" && (
                    <Link
                      to="/admin"
                      className="px-4 py-2 text-gray-600 hover:text-yellow-600 transition"
                    >
                      👑 Admin Panel
                    </Link>
                  )}

                  {/* User Info + Logout */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-300">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {user.name?.charAt(0).toUpperCase() ||
                            user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">
                        {user.name || user.email}
                      </span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="px-5 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-full font-bold text-sm hover:scale-105 transition"
                    >
                      Logout 🚀
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-6 py-2 text-gray-600 hover:text-cyan-600 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full font-bold text-white hover:from-purple-400 hover:to-cyan-500 transition"
                  >
                    Join Now ✨
                  </Link>
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
      <footer className="relative z-10 bg-gradient-to-t from-gray-100 via-gray-50 to-transparent border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm">
              © 2025 <span className="font-bold text-cyan-600">Knowledge Platform</span>.  
              Built with 💜 for learners worldwide.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="hover:text-cyan-600">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-cyan-600">
                Terms
              </Link>
              <Link to="/cookies" className="hover:text-cyan-600">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
