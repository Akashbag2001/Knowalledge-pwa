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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-200 text-gray-800 relative overflow-hidden">
      <div className="relative z-10 space-y-20 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center text-center relative">
          <div
            className="transform transition-all duration-1000"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              KNOWLEDGE
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold mb-8 text-gray-600">
              Where Learning Meets Innovation 🚀
            </h2>
            <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-gray-500">
              Dive into the future of education with interactive quizzes, news,
              and a community that never stops growing. ✨
            </p>

            {!user ? (
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  to="/login"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-bold text-lg text-white shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Enter the Matrix 🌌
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-4 border-2 border-cyan-600 rounded-full font-bold text-lg text-cyan-600 hover:bg-cyan-600 hover:text-white transition-all duration-300"
                >
                  Join the Revolution 🔥
                </Link>
              </div>
            ) : (
              <Link
                to={user.role === "superadmin" ? "/admin" : "/dashboard"}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-full font-bold text-lg text-white shadow-lg hover:scale-105 transition-all duration-300"
              >
                Access Control Panel 🎮
              </Link>
            )}
          </div>
        </section>

        {/* News Section */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-yellow-600">
              TRENDING NOW 📰
            </h2>
            <p className="text-xl text-gray-500">
              Stay plugged into what's happening around campus
            </p>
          </div>

          <div className="overflow-hidden">
            <div className="flex gap-6 animate-scroll hover:[animation-play-state:paused]">
              {news.concat(news).map((item, index) => (
                <div
                  key={index}
                  className="min-w-[300px] bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="mb-2 text-sm font-semibold text-cyan-600">
                    {item.category}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {item.description}
                  </p>
                  <span className="text-xs text-gray-500">📅 {item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quiz Section */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-green-600">
              LEVEL UP 🎯
            </h2>
            <p className="text-xl text-gray-500">
              Test your knowledge and compete with peers
            </p>
          </div>

          <div className="overflow-hidden">
            <div className="flex gap-6 animate-scroll hover:[animation-play-state:paused]">
              {quizzes.concat(quizzes).map((quiz, index) => (
                <div
                  key={index}
                  className="min-w-[280px] bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-4xl mb-3">{quiz.emoji}</div>
                  <h3 className="text-lg font-bold mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    🎯 {quiz.questions} Questions | ⏱️ ~15 mins
                  </p>
                  <Link
                    to={user ? "/quiz" : "/login"}
                    className="block w-full text-center py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300"
                  >
                    {user ? "Start Challenge 🚀" : "Login to Play 🎮"}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Scroll animation keyframes */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
