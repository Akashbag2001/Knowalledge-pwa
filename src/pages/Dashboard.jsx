import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useHttp from "../api/useHttp"; // ✅ adjust path

const Dashboard = () => {
  const { sendRequest, loading } = useHttp();
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);

  // ✅ Get userId from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await sendRequest("/superAdmin/topics", "GET");
        setTopics(data?.topics || data || []);
      } catch (error) {
        console.error("Error fetching topics:", error.message);
        toast.error("❌ Failed to fetch topics");
      }
    };

    fetchTopics();

    // ✅ Load selected topics from localStorage (if available)
    const savedTopics = JSON.parse(localStorage.getItem("selectedTopics")) || [];
    setSelectedTopics(savedTopics);
  }, []);

  // ✅ Save selected topics to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("selectedTopics", JSON.stringify(selectedTopics));
  }, [selectedTopics]);

  // Toggle topic selection
  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  // Save selected topics
  const saveTopics = async () => {
    if (!userId) {
      toast.error("❌ No user ID found");
      return;
    }

    if (selectedTopics.length < 5) {
      toast.warn("⚠️ Please select at least 5 topics before saving.");
      return;
    }

    try {
      await sendRequest(`/user/setTopicsFirst/${userId}`, "POST", {
        topics: selectedTopics,
      });
      toast.success("✅ Topics saved successfully!");
    } catch (error) {
      console.error("Error saving topics:", error.message);
      toast.error("❌ Failed to save topics");
    }
  };

  // Delete a topic
  const deleteTopic = async (topic) => {
    if (!userId) {
      toast.error("❌ No user ID found");
      return;
    }
    try {
      await sendRequest(`/user/deleteTopics/${userId}`, "DELETE", {
        topics: [topic],
      });
      setSelectedTopics((prev) => prev.filter((t) => t !== topic));
      toast.success(`🗑️ "${topic}" deleted successfully!`);
    } catch (error) {
      console.error("Error deleting topic:", error.message);
      toast.error("❌ Failed to delete topic");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-white">📊 Dashboard</h1>

      {loading ? (
        <p className="text-gray-400">Loading topics...</p>
      ) : topics.length === 0 ? (
        <p className="text-gray-400">No topics found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {topics.map((topic, index) => {
            const topicName = topic.name || topic.title || topic;
            const isSelected = selectedTopics.includes(topicName);

            return (
              <div
                key={topic._id || index}
                onClick={() => toggleTopic(topicName)}
                className={`p-6 rounded-2xl shadow-md cursor-pointer text-center font-medium transition transform duration-200
                  ${isSelected
                    ? "bg-blue-600 text-white scale-105 shadow-xl"
                    : "bg-gray-800 text-gray-300 hover:bg-blue-700 hover:text-white hover:scale-105"
                  }`}
              >
                {topicName}
              </div>
            );
          })}
        </div>
      )}

      {selectedTopics.length > 0 && (
        <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-white">
            ✅ Selected Topics ({selectedTopics.length})
          </h2>
          <ul className="mt-4 space-y-3">
            {selectedTopics.map((t, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
              >
                <span>{t}</span>
                <button
                  onClick={() => deleteTopic(t)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={saveTopics}
            className="mt-6 w-full px-5 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            💾 Save Topics
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
