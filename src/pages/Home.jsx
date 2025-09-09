import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dummy Data (replace with API later)
  const news = [
    {
      id: 1,
      title: "Annual Sports Day Announced 🏆",
      date: "2025-09-15",
      description:
        "Get ready for an epic showdown! Register now for the biggest sports event of the year.",
      category: "Events",
    },
    {
      id: 2,
      title: "New Library Books Available 📚",
      date: "2025-09-05",
      description:
        "Latest tech books, novels, and research materials just dropped in our digital library.",
      category: "Academic",
    },
    {
      id: 3,
      title: "Coding Bootcamp Registration Open 💻",
      date: "2025-09-01",
      description:
        "Level up your coding skills with our intensive 6-week bootcamp program.",
      category: "Tech",
    },
  ];

  const quizzes = [
    {
      id: 1,
      title: "Math Quiz - Algebra Mastery",
      questions: 10,
      difficulty: "Medium",
      emoji: "🧮",
    },
    {
      id: 2,
      title: "Science Quiz - Physics Laws",
      questions: 8,
      difficulty: "Hard",
      emoji: "⚡",
    },
    {
      id: 3,
      title: "Tech Quiz - AI & Machine Learning",
      questions: 12,
      difficulty: "Expert",
      emoji: "🤖",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 relative">
      {/* Aceternity UI Background Grid */}
      <div className="absolute inset-0 bg-grid-neutral-200/50 dark:bg-grid-neutral-800/50 [background-size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Floating elements for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100/20 dark:bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-100/20 dark:bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-emerald-100/20 dark:bg-emerald-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 space-y-20 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center text-center relative">
          <div
            className="transform transition-all duration-1000 max-w-6xl mx-auto"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          >
            <div className="relative">
              <h1 className="text-6xl md:text-8xl font-black mb-6 text-neutral-900 dark:text-neutral-100 tracking-tight">
                KNOWLEDGE
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
              </h1>
              <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 blur-3xl -z-10" />
            </div>
            
            <h2 className="text-2xl md:text-4xl font-semibold mb-8 text-neutral-600 dark:text-neutral-400">
              Where Learning Meets Innovation 🚀
            </h2>
            <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-neutral-500 dark:text-neutral-500 leading-relaxed">
              Dive into the future of education with interactive quizzes, news,
              and a community that never stops growing. ✨
            </p>

            {!user ? (
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  to="/login"
                  className="group px-8 py-4 bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700"
                >
                  <span className="flex items-center gap-2">
                    Enter the Matrix 🌌
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
                <Link
                  to="/register"
                  className="group px-8 py-4 border-2 border-neutral-300 dark:border-neutral-700 rounded-2xl font-semibold text-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="flex items-center gap-2">
                    Join the Revolution 🔥
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                to={user.role === "superadmin" ? "/admin" : "/dashboard"}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 dark:bg-emerald-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                Access Control Panel 🎮
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </section>

        {/* News Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <div className="relative inline-block">
              <h2 className="text-4xl md:text-6xl font-black mb-4 text-amber-600 dark:text-amber-500 tracking-tight">
                TRENDING NOW 📰
              </h2>
              <div className="absolute -inset-4 bg-amber-500/10 dark:bg-amber-400/10 blur-2xl rounded-full -z-10" />
            </div>
            <p className="text-xl text-neutral-500 dark:text-neutral-500">
              Stay plugged into what's happening around campus
            </p>
          </div>

          <div className="overflow-hidden">
            <div className="flex gap-6 animate-scroll hover:[animation-play-state:paused]">
              {news.concat(news).map((item, index) => (
                <div
                  key={index}
                  className="group min-w-[320px] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                      {item.category}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {item.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quiz Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <div className="relative inline-block">
              <h2 className="text-4xl md:text-6xl font-black mb-4 text-emerald-600 dark:text-emerald-500 tracking-tight">
                LEVEL UP 🎯
              </h2>
              <div className="absolute -inset-4 bg-emerald-500/10 dark:bg-emerald-400/10 blur-2xl rounded-full -z-10" />
            </div>
            <p className="text-xl text-neutral-500 dark:text-neutral-500">
              Test your knowledge and compete with peers
            </p>
          </div>

          <div className="overflow-hidden">
            <div className="flex gap-6 animate-scroll hover:[animation-play-state:paused]">
              {quizzes.concat(quizzes).map((quiz, index) => (
                <div
                  key={index}
                  className="group min-w-[300px] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {quiz.emoji}
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-neutral-900 dark:text-neutral-100">
                    {quiz.title}
                  </h3>
                  <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400 text-sm mb-6">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {quiz.questions} Questions
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ~15 mins
                    </span>
                  </div>
                  <Link
                    to={user ? "/quiz" : "/login"}
                    className="group/btn flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {user ? "Start Challenge 🚀" : "Login to Play 🎮"}
                    <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Custom styles for animations and grid */}
      <style>{`
        .bg-grid-neutral-200\/50 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(212 212 212 / 0.5)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
        .dark .bg-grid-neutral-800\/50 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(38 38 38 / 0.5)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;