import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import useHttp from "../../api/useHttp";
import TriviaSection from "./TriviaSection";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

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
            const filtered = triviaOnly.filter((t) => !ids.has(t.data?._id));
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

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

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

  // Like Handler
  // Like Toggle Handler
  const handleLike = (e, newsId) => {
    e.stopPropagation();
    setNewsList((prev) =>
      prev.map((item) =>
        item._id === newsId ? { ...item, liked: !item.liked } : item
      )
    );
  };


  // Share Handler
  const handleShare = (e, news) => {
    e.stopPropagation();
    const shareData = {
      title: news.heading.replace(/<[^>]*>/g, ""),
      text: news.subHeading?.replace(/<[^>]*>/g, "") || "Check out this news!",
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => toast.info("Sharing canceled"));
    } else {
      navigator.clipboard
        .writeText(`${shareData.title} - ${shareData.url}`)
        .then(() => toast.success("🔗 Link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-300 text-white px-4 sm:px-10 py-10">
      <h1 className="text-3xl font-semibold text-center mb-10 text-[#1f4edb]">
        Latest News
      </h1>

      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
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

                    {/* Like + Share Section */}
                    <div className="flex items-center justify-between mt-4 border-t pt-3 border-gray-200">
                      <button
                        className="flex items-center gap-1 transition"
                        onClick={(e) => handleLike(e, news._id)}
                      >
                        {news.liked ? (
                          <FaHeart className="text-red-500 transition-transform duration-200 scale-110" />
                        ) : (
                          <CiHeart className="text-gray-600 transition-transform duration-200" />
                        )}
                      </button>



                      <button
                        className="flex items-center gap-1 text-gray-600 hover:text-[#1f4edb] transition"
                        onClick={(e) => handleShare(e, news)}
                      >
                        📤 Share
                      </button>
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
