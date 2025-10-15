// src/pages/superadmin/AddTopic.jsx
import React, { useEffect, useState } from "react";
import useHttp from "../../api/useHttp";
import { toast } from "react-toastify";

const AddTopic = () => {
  const { sendRequest, loading } = useHttp();
  const [topicName, setTopicName] = useState("");
  const [topicImage, setTopicImage] = useState(null);
  const [topics, setTopics] = useState([]);

  // ✅ Fetch topics
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

  // ✅ Add topic (with image)
  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!topicName.trim()) return toast.error("Topic name is required");
    if (!topicImage) return toast.error("Please upload a topic image");

    const formData = new FormData();
    formData.append("name", topicName);
    formData.append("image", topicImage);

    try {
      const res = await sendRequest("/superAdmin/topics", "POST", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.success) {
        toast.success("✅ Topic added successfully!");
        setTopicName("");
        setTopicImage(null);
        fetchTopics();
      } else {
        toast.error(res.message || "Failed to add topic");
      }
    } catch (err) {
      toast.error("❌ Something went wrong while adding topic");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* 🧩 Card Container */}
      <div className="bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Add New Topic
        </h1>

        {/* ✅ Add Topic Form */}
        <form onSubmit={handleAddTopic} className="flex flex-col gap-4">
          {/* Topic Name */}
          <input
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="Enter topic name"
            className="border border-gray-600 bg-gray-900 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />

          {/* Topic Image Upload */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-300">Upload Topic Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setTopicImage(e.target.files[0])}
              className="border border-gray-600 bg-gray-900 text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {topicImage && (
              <img
                src={URL.createObjectURL(topicImage)}
                alt="preview"
                className="w-32 h-32 object-cover rounded-lg mt-3 border border-gray-700"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            {loading ? "Adding..." : "Add Topic"}
          </button>
        </form>
      </div>

      {/* ✅ Topics List */}
      <div className="mt-10 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-400">
          All Topics
        </h2>

        {topics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col items-center hover:bg-gray-700 transition"
              >
                <img
                  src={topic.imageUrl || topic.image || "/default-topic.png"}
                  alt={topic.name}
                  className="w-24 h-24 object-cover rounded-lg mb-3 border border-gray-700"
                />
                <span className="text-lg font-semibold">{topic.name}</span>
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
