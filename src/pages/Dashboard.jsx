import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import useHttp from "../api/useHttp"; // your custom hook for API calls

const Dashboard = () => {
  const navigate = useNavigate();
  const { sendRequest, loading } = useHttp();
  const user = JSON.parse(localStorage.getItem("user"));

  const [availableTopics, setAvailableTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);

  // ✅ If user not logged in
  if (!user) {
    toast.error("❌ User not found, please login.");
    return <Navigate to="/login" replace />;
  }

  // ✅ Redirect only if topics exist & not empty
  if (user?.topics && user.topics.length > 0) {
    return <Navigate to="/news" replace />;
  }

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await sendRequest("/superAdmin/topics", "GET");
        const topicsList = data?.topics || data || [];
        setAvailableTopics(topicsList);
      } catch (error) {
        console.error("Error fetching topics:", error.message);
        toast.error("❌ Failed to fetch topics");
      }
    };

    fetchTopics();
  }, []);

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const saveTopics = async () => {
    if (selectedTopics.length < 1) {
      toast.warn("⚠️ Please select at least one topic");
      return;
    }

    try {
      await sendRequest(`/user/setTopicsFirst/${user._id}`, "POST", {
        topics: selectedTopics,
      });

      const updatedUser = { ...user, topics: selectedTopics };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("✅ Topics saved successfully!");
      navigate("/news");
    } catch (error) {
      console.error("Error saving topics:", error.message);
      toast.error("❌ Failed to save topics");
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <p className="text-gray-400">Loading topics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-white text-center sm:text-left">
        📚 Select Your Topics
      </h1>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {availableTopics.map((topic, idx) => {
          const topicName = topic.name || topic.title || topic;
          const isSelected = selectedTopics.includes(topicName);

          return (
            <div
              key={idx}
              onClick={() => toggleTopic(topicName)}
              className={`p-4 text-center rounded-lg cursor-pointer font-medium transition-all
                ${
                  isSelected
                    ? "bg-blue-600 text-white scale-105 shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-blue-700 hover:text-white hover:scale-105"
                }`}
            >
              {topicName}
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      {selectedTopics.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={saveTopics}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            💾 Save Topics
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
