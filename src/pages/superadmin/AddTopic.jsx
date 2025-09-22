// src/pages/superadmin/AddTopic.jsx
import React, { useEffect, useState } from "react";
import useHttp from "../../api/useHttp";
import { toast } from "react-toastify";

const AddTopic = () => {
  const { sendRequest, loading } = useHttp();
  const [topicName, setTopicName] = useState("");
  const [topics, setTopics] = useState([]);

  // Fetch topics
  const fetchTopics = async () => {
    try {
      const res = await sendRequest("/superAdmin/topics", "GET");
      if (res.success) {
        setTopics(res.topics || []);
      }
    } catch (err) {
      toast.error("Failed to load topics");
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Add topic
  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!topicName.trim()) return toast.error("Topic name is required");

    try {
      const res = await sendRequest("/superAdmin/topics", "POST", {
        name: topicName,
      });

      if (res.success) {
        toast.success("Topic added successfully!");
        setTopicName("");
        fetchTopics(); // refresh topics list
      } else {
        toast.error(res.message || "Failed to add topic");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Card container */}
      <div className="bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Add New Topic
        </h1>

        {/* Add Topic Form */}
        <form onSubmit={handleAddTopic} className="flex gap-3 mb-8">
          <input
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="Enter topic name"
            className="flex-1 border border-gray-600 bg-gray-900 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold px-5 rounded-lg shadow-md transition"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      </div>

      {/* Topics List */}
      <div className="mt-10 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          All Topics
        </h2>

        {topics.length > 0 ? (
          <div className="bg-gray-800 rounded-xl shadow-lg divide-y divide-gray-700">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-700 transition flex justify-between items-center"
              >
                <span className="text-lg">{topic}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No topics available yet.</p>
        )}
      </div>
    </div>
  );
};

export default AddTopic;
