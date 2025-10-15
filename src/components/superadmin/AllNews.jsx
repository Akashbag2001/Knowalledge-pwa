import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useHttp from "../../api/useHttp";
import { toast } from "react-toastify";

const AllNews = ({ open, onClose }) => {
  const { sendRequest } = useHttp();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await sendRequest("/superAdmin/news", "GET");
        setNewsList(data?.news || []);
      } catch {
        toast.error("❌ Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-start overflow-auto pt-20 pb-10 sm:py-20 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="bg-[#1E1E1E] rounded-2xl shadow-2xl border border-gray-700 w-full max-w-5xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700 bg-[#2B2B2B]">
              <h2 className="text-2xl font-bold text-[#1f4edb] flex items-center gap-2">
                📰 All News
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-200 text-xl transition"
                aria-label="Close All News"
              >
                ✖
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Loader */}
              {loading && (
                <p className="text-center text-gray-400 py-10 animate-pulse">
                  Fetching all news...
                </p>
              )}

              {/* Empty state */}
              {!loading && newsList.length === 0 && (
                <p className="text-center text-gray-400 py-10">
                  No news available yet.
                </p>
              )}

              {/* News List */}
              {!loading && newsList.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-6">
                  {newsList.map((news, index) => {
                    const imageSrc =
                      news.images instanceof File
                        ? URL.createObjectURL(news.images)
                        : news.images || null;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-[#2B2B2B]/60 border border-gray-700 rounded-xl p-5 hover:bg-[#2B2B2B]/80 transition duration-200 shadow-md flex flex-col"
                      >
                        <h3
                          className="text-xl font-semibold text-[#1f4edb] break-words"
                          dangerouslySetInnerHTML={{ __html: news.heading }}
                        />
                        {news.subHeading && (
                          <p
                            className="text-gray-400 mt-1 italic break-words"
                            dangerouslySetInnerHTML={{ __html: news.subHeading }}
                          />
                        )}
                        {news.smallContent && (
                          <div
                            className="text-gray-300 mt-3 break-words"
                            dangerouslySetInnerHTML={{ __html: news.smallContent }}
                          />
                        )}
                        <div className="flex flex-wrap items-center justify-between mt-3 text-sm text-gray-500 gap-2">
                          <span>📅 {news.date || "N/A"}</span>
                          <span>🏷️ {news.contentType || "General"}</span>
                        </div>
                        {imageSrc && (
                          <img
                            src={imageSrc}
                            alt="news"
                            className="w-full mt-4 rounded-lg border border-gray-700 object-contain"
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-700 bg-[#2B2B2B] text-right">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-[#1E2D5B] hover:bg-[#253b7a] text-white font-semibold transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AllNews;
