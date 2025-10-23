import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import useHttp from "../../api/useHttp";
import { useNavigate } from "react-router-dom";

const Discover = () => {
  const { sendRequest, loading } = useHttp();
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch all topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await sendRequest("/superAdmin/topics", "GET", null, {
          Authorization: `Bearer ${token}`,
        });

        if (response.success) {
          console.log("Fetched topics:", response);
          setTopics(response.topics || []);
        } else {
          toast.error(response.message || "Failed to fetch topics");
        }
      } catch (error) {
        toast.error("Error fetching topics");
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#121212] text-white px-6 sm:px-10 py-10">
      <h1 className="text-3xl font-semibold text-center mb-10 text-[#1f4edb]">
        🔍 Discover Topics
      </h1>

      {/* ✅ Topics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-5xl mx-auto">
        {loading ? (
          <p className="text-gray-400 col-span-full text-center animate-pulse">
            Loading topics...
          </p>
        ) : topics.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center">
            No topics found.
          </p>
        ) : (
          topics.map((topic) => (
            <motion.div
              key={topic._id}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(`/discover/${topic.name}`)}
              className="cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-2xl bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-200"
            >
              {/* Icon or first letter fallback */}
              {topic.image ? (
                <img
                  src={topic.image}
                  alt={topic.name}
                  className="w-12 h-12 object-contain mb-2"
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-[#2a2a2a] rounded-full mb-2 text-lg font-bold">
                  {topic.name?.[0]?.toUpperCase()}
                </div>
              )}
              <p className="text-sm text-center font-medium">{topic.name}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Discover;
