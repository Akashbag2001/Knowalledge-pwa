import React, { useEffect, useState } from "react";
import useHttp from "../../api/useHttp";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import PreviewNews from "./PreviewNews";

const AllNewsPreview = ({ open, onClose }) => {
  const { sendRequest, loading } = useHttp();
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  // ✅ Helper to get image src safely
  const getImageSrc = (img) => {
    if (!img) return null;
    if (img instanceof File) return URL.createObjectURL(img);
    if (Array.isArray(img)) return img[0];
    return img; // assume string URL
  };

  // ✅ Fetch all news when modal opens
  useEffect(() => {
    if (!open) return;

    const fetchAllNews = async () => {
      try {
        const response = await sendRequest("/superAdmin/news", "GET");
        if (response?.success) {
          setNewsList(response.data || []);
        } else {
          toast.error("❌ Failed to fetch news");
        }
      } catch (error) {
        toast.error("❌ Error fetching news");
      }
    };

    fetchAllNews();
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Background modal */}
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm pt-20 flex items-center justify-center z-40 p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          className="w-full max-w-6xl bg-[#1E1E1E] text-gray-100 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700 bg-[#2B2B2B]">
            <h2 className="text-2xl font-extrabold text-[#1f4edb]">
              📰 All News
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 text-xl transition"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              <p className="text-center text-gray-400 py-10 animate-pulse">
                Fetching news...
              </p>
            ) : newsList.length === 0 ? (
              <p className="text-center text-gray-400 py-10">
                No news available.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsList.map((news) => {
                  const imageSrc = getImageSrc(news.images);

                  return (
                    <motion.div
                      key={news._id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedNews(news)}
                      className="cursor-pointer border border-gray-700 rounded-xl bg-[#2B2B2B]/60 hover:bg-[#2B2B2B] transition duration-200 overflow-hidden flex flex-col"
                    >
                      {imageSrc && (
                        <img
                          src={imageSrc}
                          alt="News thumbnail"
                          className="w-full h-40 object-cover border-b border-gray-700"
                        />
                      )}
                      <div className="p-4 flex flex-col flex-grow">
                        <h3
                          className="text-lg font-semibold text-[#1f4edb] mb-2 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: news.heading }}
                        />
                        <p
                          className="text-gray-400 text-sm flex-grow line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: news.smallContent }}
                        />
                        <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-2">
                          <span>📅 {news.date}</span>
                          <span>🏷 {news.contentType}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Detailed preview modal */}
      {selectedNews && (
        <PreviewNews
          open={!!selectedNews}
          onClose={() => setSelectedNews(null)}
          formData={selectedNews}
        />
      )}
    </>
  );
};

export default AllNewsPreview;
