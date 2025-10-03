import { useEffect, useState } from "react";
import useHttp from "../hooks/useHttp"; // ✅ adjust path if needed

const Dashboard = () => {
  const { sendRequest, loading } = useHttp();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await sendRequest(
          "/user/setTopicsFirst/68b92a9c380a9f5db25a2872",
          "GET"
        );
        setTopics(data || []); // adjust if response is wrapped {topics: [...]}
      } catch (error) {
        console.error("Error fetching topics:", error.message);
      }
    };

    fetchTopics();
  }, [sendRequest]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

      {loading ? (
        <p>Loading topics...</p>
      ) : topics.length === 0 ? (
        <p>No topics found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topics.map((topic, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow cursor-pointer transition 
              ${
                selectedTopic === topic
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-blue-100"
              }`}
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </div>
          ))}
        </div>
      )}

      {selectedTopic && (
        <div className="mt-6 p-4 border rounded-lg bg-green-50">
          <h2 className="text-lg font-semibold">Selected Topic:</h2>
          <p className="mt-2 text-gray-700">{selectedTopic}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
