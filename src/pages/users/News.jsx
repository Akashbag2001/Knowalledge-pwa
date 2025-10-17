// src/pages/user/News.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import useHttp from "../../api/useHttp";

const News = () => {
  const { sendRequest, loading } = useHttp();
  const [newsList, setNewsList] = useState([]);
  const [expandedNews, setExpandedNews] = useState(null);

  const getImageSrc = (images) => {
    if (!images || images.length === 0) return null;
    return typeof images[0] === "string" ? images[0] : images[0].url;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await sendRequest("/user/feed", "GET", null, {
          Authorization: `Bearer ${token}`,
        });

        if (response.success) {
          // Filter only news items (exclude trivia)
          const newsOnly = response.feed.filter(item => !item.type);
          setNewsList(newsOnly);
        } else {
          toast.error(response.message || "Failed to fetch news");
        }
      } catch (error) {
        toast.error("Error fetching news");
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#121212] text-white px-4 sm:px-10 py-10">
      <h1 className="text-3xl font-semibold text-center mb-10 text-[#1f4edb]">
        Latest News
      </h1>

      <div className="flex flex-col gap-6">
        {loading ? (
          <p className="text-center text-gray-400 py-10 animate-pulse">
            Fetching news...
          </p>
        ) : newsList.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No news available.</p>
        ) : (
          newsList.map((news) => {
            const imageSrc = getImageSrc(news.images);
            const isExpanded = expandedNews?._id === news._id;

            return (
              <motion.div
                key={news._id}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="cursor-pointer border border-gray-700 rounded-xl bg-[#2B2B2B]/60 hover:bg-[#2B2B2B] transition duration-200 overflow-hidden"
                onClick={() => setExpandedNews(isExpanded ? null : news)}
              >
                {/* News Image */}
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt="News thumbnail"
                    className="w-full h-56 object-cover border-b border-gray-700"
                  />
                )}

                <div className="p-5">
                  {/* Heading & Subheading */}
                  <h3
                    className="text-xl font-semibold text-[#1f4edb] mb-1"
                    dangerouslySetInnerHTML={{ __html: news.heading }}
                  />
                  <p className="text-gray-400 text-sm mb-2">{news.subHeading}</p>

                  {/* Small Content */}
                  <p
                    className="text-gray-400 text-sm line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: news.smallContent }}
                  />

                  {/* Topics and Metadata */}
                  <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-3">
                    <span>📅 {news.date}</span>
                    <span>🏷 {news.contentType}</span>
                    {news.topics && news.topics.length > 0 && (
                      <span>📰 {news.topics.join(", ")}</span>
                    )}
                  </div>

                  {/* Expand/Collapse Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      className="text-sm text-blue-400 hover:text-blue-300 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedNews(isExpanded ? null : news);
                      }}
                    >
                      {isExpanded ? "Hide Details ▲" : "Read More ▼"}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-4 border-t border-gray-700 pt-4 text-gray-300 text-sm leading-relaxed"
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: news.largeContent }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default News;
