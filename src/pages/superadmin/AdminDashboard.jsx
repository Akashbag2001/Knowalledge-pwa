import { motion } from "framer-motion";
import {
  Users,
  Newspaper,
  PenSquare,
  Calendar,
  BarChart2,
  School,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const options = [
  {
    title: "View Users",
    icon: <Users className="w-8 h-8" />,
    color: "from-blue-500 to-blue-700",
    path: "/admin/view-users",
  },
  {
    title: "Add News",
    icon: <Newspaper className="w-8 h-8" />,
    color: "from-green-500 to-green-700",
    path: "/admin/add-news", // optional placeholder route
  },
  {
    title: "Add Trivia Post",
    icon: <PenSquare className="w-8 h-8" />,
    color: "from-purple-500 to-purple-700",
    path: "/add-trivia", // optional placeholder route
  },
  {
    title: "Add Event/Quiz",
    icon: <Calendar className="w-8 h-8" />,
    color: "from-pink-500 to-pink-700",
    path: "/add-event", // optional placeholder route
  },
  {
    title: "View Quiz Result",
    icon: <BarChart2 className="w-8 h-8" />,
    color: "from-orange-500 to-orange-700",
    path: "/view-quiz-result", // optional placeholder route
  },
  {
    title: "Add School Options",
    icon: <School className="w-8 h-8" />,
    color: "from-indigo-500 to-indigo-700",
    path: "/admin/add-school",
  },
  {
    title: "Add Topics", // ✅ New card
    icon: <BookOpen className="w-8 h-8" />,
    color: "from-teal-500 to-teal-700",
    path: "/admin/add-topics",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-16 px-6">
      {/* Page Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-12"
      >
        Admin Dashboard
      </motion.h1>

      {/* Dashboard Options Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {options.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleClick(item.path)}
            className={`cursor-pointer rounded-2xl shadow-lg p-6 bg-gradient-to-br ${item.color} flex flex-col items-center justify-center text-center transition-transform`}
          >
            <div className="mb-4">{item.icon}</div>
            <h2 className="text-lg font-bold">{item.title}</h2>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
