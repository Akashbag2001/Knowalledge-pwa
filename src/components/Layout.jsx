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
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 relative">
      {/* Aceternity UI Background Grid */}
      <div className="fixed inset-0 [background-size:50px_50px] pointer-events-none" />
      
      {/* Subtle floating elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-64 h-64 bg-blue-100/20 dark:bg-blue-900/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            left: "5%",
            top: "10%",
          }}
        />
        <div
          className="absolute w-80 h-80 bg-purple-100/20 dark:bg-purple-900/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
            right: "5%",
            top: "20%",
          }}
        />
        <div
          className="absolute w-52 h-52 bg-emerald-100/20 dark:bg-emerald-900/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * -0.01}px)`,
            left: "50%",
            bottom: "20%",
          }}
        />
      </div>

      {/* Navbar */}
      <header
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 shadow-lg shadow-neutral-200/20 dark:shadow-neutral-900/20"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-neutral-900 dark:bg-neutral-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <span className="text-xl font-black text-white dark:text-neutral-900">K</span>
                </div>
                <div className="absolute -inset-1 bg-blue-500/20 dark:bg-blue-400/20 rounded-2xl blur-sm group-hover:bg-blue-500/30 dark:group-hover:bg-blue-400/30 transition-all duration-300 -z-10" />
              </div>
              <div className="hidden sm:block">
                <div className="text-2xl font-black text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  KNOWALLEDGE
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-500 -mt-1">Next-Gen Learning</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/"
                className="relative px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Home
                <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/5 rounded-xl opacity-0 hover:opacity-100 transition-opacity -z-10" />
              </Link>

              {user ? (
                <>
                  {user.role === "user" && (
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Dashboard
                    </Link>
                  )}
                  {user.role === "superadmin" && (
                    <Link
                      to="/admin"
                      className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-300 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                      </svg>
                      Admin Panel
                    </Link>
                  )}

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                  </button>

                  {/* User Info + Logout */}
                  <div className="flex items-center space-x-3 ml-4">
                    <div className="flex items-center space-x-3 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all">
                      <div className="relative">
                        <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {user.name?.charAt(0).toUpperCase() ||
                              user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -inset-0.5 bg-blue-500/20 dark:bg-blue-400/20 rounded-xl blur-sm -z-10" />
                      </div>
                      <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                        {user.name || user.email}
                      </span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="group px-5 py-2 bg-red-600 dark:bg-red-500 text-white rounded-2xl font-semibold text-sm hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-lg flex items-center gap-2"
                    >
                      <span>Logout</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-6 py-2 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="group px-6 py-2 bg-blue-600 dark:bg-blue-500 rounded-2xl font-semibold text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-lg flex items-center gap-2"
                  >
                    <span>Join Now</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 shadow-lg">
              <div className="px-4 py-6 space-y-4">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                  Home
                </Link>
                
                {user && user.role === "user" && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                  >
                    Dashboard
                  </Link>
                )}
                
                {user && user.role === "superadmin" && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                  >
                    👑 Admin Panel
                  </Link>
                )}

                {!user && (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-all text-center"
                    >
                      Join Now ✨
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-white">K</span>
              </div>
              <p className="text-sm">
                © 2025 <span className="font-semibold text-neutral-900 dark:text-neutral-100">KNOWALLEDGE Platform</span>
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span>Built with</span>
              <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>for learners worldwide</span>
            </div>
            {/* Uncomment and style if needed
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Terms
              </Link>
              <Link to="/cookies" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Cookies
              </Link>
            </div>
            */}
          </div>
        </div>
      </footer>

      {/* Custom Styles for Grid Background */}
      <style>{`
        .bg-grid-neutral-200\/30 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(212 212 212 / 0.3)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
        .dark .bg-grid-neutral-800\/30 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(38 38 38 / 0.3)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
};

export default Layout;