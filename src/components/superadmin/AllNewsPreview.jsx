import React, { useEffect, useState } from "react";
import useHttp from "../../api/useHttp";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import PreviewNews from "./PreviewNews";

const AllNewsPreview = () => {
  const { sendRequest, loading } = useHttp();
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  // Helper to get image src safely
  const getImageSrc = (img) => {
    if (!img) return null;
    if (img instanceof File) return URL.createObjectURL(img);
    if (Array.isArray(img)) return img[0];
    return img; // assume string URL
  };

  // Fetch all news on component mount
  useEffect(() => {
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
  }, []);

  return (
    <div className="w-full">
      {/* Grid of all news */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-center text-gray-400 py-10 animate-pulse">
            Fetching news...
          </p>
        ) : newsList.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            No news available.
          </p>
        ) : (
          newsList.map((news) => {
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
          })
        )}
      </div>

      {/* Detailed preview modal */}
      {selectedNews && (
        <PreviewNews
          open={!!selectedNews}
          onClose={() => setSelectedNews(null)}
          formData={selectedNews}
        />
      )}
    </div>
  );
};

export default AllNewsPreview;
