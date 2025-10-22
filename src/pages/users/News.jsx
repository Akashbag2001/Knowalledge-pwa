// src/pages/user/News.jsx
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import useHttp from "../../api/useHttp";
import TriviaSection from "./TriviaSection";

const News = () => {
  const { sendRequest, loading } = useHttp();
  const [newsList, setNewsList] = useState([]);
  const [triviaList, setTriviaList] = useState([]);
  const [expandedNews, setExpandedNews] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getImageSrc = (images) => {
    if (!images || images.length === 0) return null;
    return typeof images[0] === "string" ? images[0] : images[0].url;
  };

  const fetchFeed = useCallback(async (cursorParam = null) => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = cursorParam ? { cursor: cursorParam } : {};
      const response = await sendRequest(
        "/user/feed",
        "GET",
        null,
        { Authorization: `Bearer ${token}` },
        queryParams
      );

      if (response.success) {
        const feed = response.feed || [];

        const newsOnly = feed.filter((item) => !item.type);
        const triviaOnly = feed.filter((item) => item.type === "trivia");

        if (cursorParam) {
          setNewsList((prev) => {
            const ids = new Set(prev.map((n) => n._id));
            const filtered = newsOnly.filter((n) => !ids.has(n._id));
            return [...prev, ...filtered];
          });
          setTriviaList((prev) => {
            const ids = new Set(prev.map((t) => t.data?._id));
            const filtered = triviaOnly.filter(
              (t) => !ids.has(t.data?._id)
            );
            return [...prev, ...filtered];
          });
        } else {
          setNewsList(newsOnly);
          setTriviaList(triviaOnly);
        }

        setCursor(response.nextCursor || null);
        setHasMore(!!response.nextCursor);
      } else {
        toast.error(response.message || "Failed to fetch feed");
      }
    } catch (err) {
      toast.error("Error fetching news");
    } finally {
      setLoadingMore(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
          document.documentElement.scrollHeight &&
        !loadingMore &&
        hasMore
      ) {
        setLoadingMore(true);
        fetchFeed(cursor);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [cursor, loadingMore, hasMore, fetchFeed]);

  // Trivia Section Component
  // const TriviaSection = ({ trivia }) => (
  //   <div className="overflow-x-auto flex gap-4 pb-2 mt-4">
  //     {trivia.map((t) => (
  //       <motion.div
  //         key={t.data?._id}
  //         whileHover={{ scale: 1.03 }}
  //         className="min-w-[260px] sm:min-w-[320px] bg-[#1e1e1e] border border-gray-700 rounded-xl p-5 hover:bg-[#2a2a2a] transition"
  //       >
  //         <h4 className="text-lg font-semibold text-[#1f4edb] mb-2">
  //           {t.data?.triviaName}
  //         </h4>
  //         <p className="text-gray-400 text-sm mb-1">
  //           🧩 {t.data?.subCards?.length || 0} questions
  //         </p>
  //         <p className="text-gray-500 text-xs">
  //           📅 {new Date(t.data?.createdAt).toLocaleDateString()}
  //         </p>
  //       </motion.div>
  //     ))}
  //   </div>
  // );

  return (
    <div className="w-full min-h-screen bg-[#121212] text-white px-4 sm:px-10 py-10">
      <h1 className="text-3xl font-semibold text-center mb-10 text-[#1f4edb]">
        Latest News
      </h1>

      <div className="flex flex-col gap-6">
        {loading && newsList.length === 0 ? (
          <p className="text-center text-gray-400 py-10 animate-pulse">
            Fetching news...
          </p>
        ) : newsList.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No news available.</p>
        ) : (
          newsList.map((news, index) => {
            const imageSrc = getImageSrc(news.images);
            const isExpanded = expandedNews?._id === news._id;

            return (
              <React.Fragment key={news._id}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="cursor-pointer border border-gray-700 rounded-xl bg-[#2B2B2B]/60 hover:bg-[#2B2B2B] transition duration-200 overflow-hidden"
                  onClick={() => setExpandedNews(isExpanded ? null : news)}
                >
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt="News thumbnail"
                      className="w-full h-56 object-cover border-b border-gray-700"
                    />
                  )}

                  <div className="p-5">
                    <h3
                      className="text-xl font-semibold text-[#1f4edb] mb-1"
                      dangerouslySetInnerHTML={{ __html: news.heading }}
                    />
                    <p
                      className="text-gray-400 text-sm mb-2"
                      dangerouslySetInnerHTML={{ __html: news.subHeading }}
                    />
                    <p
                      className="text-gray-400 text-sm"
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
                        className="text-sm text-blue-400 hover:text-blue-300 transition"
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
                          className="mt-4 border-t border-gray-700 pt-4 text-gray-300 text-sm leading-relaxed"
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

                {/* 🧠 Insert Trivia Section after every 2 news */}
                {(index + 1) % 2 === 0 && triviaList.length > 0 && (
                  <TriviaSection triviaList={triviaList.slice(0, 1)} />
                )}
              </React.Fragment>
            );
          })
        )}

        {loadingMore && (
          <p className="text-center text-gray-400 py-5 animate-pulse">
            Loading more news...
          </p>
        )}
      </div>
    </div>
  );
};

export default News;
