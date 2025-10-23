// src/pages/user/TopicDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import useHttp from "../../api/useHttp";
import TriviaSection from "./TriviaSection";

const TopicDetails = () => {
  const { topicName } = useParams();
  const { sendRequest, loading } = useHttp();
  const [newsList, setNewsList] = useState([]);
  const [triviaList, setTriviaList] = useState([]);
  const [expandedNews, setExpandedNews] = useState(null);

  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await sendRequest(
          `/user/topic/${topicName}`,
          "GET",
          null,
          { Authorization: `Bearer ${token}` }
        );

        if (response.success) {
          setNewsList(response.news || []);
          setTriviaList(response.trivia || []);
        } else {
          toast.error(response.message || "Failed to fetch topic data");
        }
      } catch (err) {
        toast.error("Error fetching topic details");
      }
    };

    fetchTopicData();
  }, []);

  const getImageSrc = (images) => {
    if (!images || images.length === 0) return null;
    return typeof images[0] === "string" ? images[0] : images[0].url;
  };

  return (
    <div className="w-full min-h-screen bg-[#121212] text-white px-4 sm:px-10 py-10">
      <h1 className="text-3xl font-semibold text-center mb-10 text-[#1f4edb] capitalize">
        {topicName} News
      </h1>

      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {loading ? (
          <p className="text-center text-gray-400 py-10 animate-pulse">
            Fetching {topicName} news...
          </p>
        ) : newsList.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            No news available for this topic.
          </p>
        ) : (
          newsList.map((news, index) => {
            const imageSrc = getImageSrc(news.images);
            const isExpanded = expandedNews?._id === news._id;

            return (
              <React.Fragment key={news._id}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="cursor-pointer border border-gray-200 rounded-xl bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition duration-200 overflow-hidden text-black"
                  onClick={() => setExpandedNews(isExpanded ? null : news)}
                >
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt="News thumbnail"
                      className="w-full h-56 object-cover border-b border-gray-200"
                    />
                  )}

                  <div className="p-5">
                    <h3
                      className="text-xl font-semibold text-[#1f4edb] mb-1"
                      dangerouslySetInnerHTML={{ __html: news.heading }}
                    />
                    <p
                      className="text-gray-700 text-sm mb-2"
                      dangerouslySetInnerHTML={{ __html: news.subHeading }}
                    />
                    <p
                      className="text-gray-600 text-sm"
                      dangerouslySetInnerHTML={{ __html: news.smallContent }}
                    />

                    <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-3">
                      {news.date && <span>📅 {news.date}</span>}
                      {news.contentType && <span>🏷 {news.contentType}</span>}
                      {news.topics && news.topics.length > 0 && (
                        <span>📰 {news.topics.join(", ")}</span>
                      )}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        className="text-sm text-[#1f4edb] hover:text-[#163ac3] transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedNews(isExpanded ? null : news);
                        }}
                      >
                        {isExpanded ? "Hide Details ▲" : "Read More ▼"}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          className="mt-4 border-t border-gray-300 pt-4 text-gray-700 text-sm leading-relaxed"
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: news.largeContent,
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* 🧠 Trivia Section after every 2 news */}
                {(index + 1) % 2 === 0 && triviaList.length > 0 && (
                  <TriviaSection triviaList={triviaList.slice(0, 1)} />
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TopicDetails;
