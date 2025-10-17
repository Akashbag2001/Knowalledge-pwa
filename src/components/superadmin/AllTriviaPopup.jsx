import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditTriviaPopup from "./EditTriviaPopup";
import useHttp from "../../api/useHttp";

const AllTriviaPopup = ({ open, onClose, trivias, onRefresh }) => {
  const { sendRequest } = useHttp();
  const [selectedTrivia, setSelectedTrivia] = useState(null);
  const [expandedCards, setExpandedCards] = useState({}); // Track which subCards are expanded

  useEffect(() => {
    onRefresh();
  }, []);

  const handleDeleteTrivia = async (triviaId) => {
    if (!window.confirm("Are you sure you want to delete this trivia?")) return;
    try {
      const response = await sendRequest(`/superAdmin/trivia/${triviaId}`, "DELETE");
      if (response.success) {
        toast.success("Trivia deleted successfully!");
        onRefresh();
      } else {
        toast.error(response.message || "Failed to delete trivia");
      }
    } catch (err) {
      toast.error("Error deleting trivia");
    }
  };

  const toggleExpand = (triviaIndex, cardIndex) => {
    const key = `${triviaIndex}-${cardIndex}`;
    setExpandedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (trivias.length === 0) return null;

  // Helper to get image URL
  const getImageUrl = (img) => {
    if (img?.url) return img.url;
    if (typeof img === "string" && (img.startsWith("http") || img.startsWith("https"))) return img;
    return "/placeholder-image.png"; // fallback
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 mt-16 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 text-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-red-500 hover:text-red-600 text-2xl font-bold"
                title="Close"
              >
                ✕
              </button>

              <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
                All Trivias
              </h2>

              {/* Trivia List */}
              <div className="flex flex-col gap-6">
                {trivias.map((trivia, tIndex) => (
                  <div
                    key={tIndex}
                    className="bg-neutral-800 rounded-xl p-5 border border-neutral-700 shadow-lg"
                  >
                    {/* Trivia Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                      <h3 className="text-2xl font-semibold text-blue-300">{trivia.triviaName}</h3>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedTrivia(trivia)}
                          className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded transition"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteTrivia(trivia._id || trivia.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {/* SubCards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {trivia.subCards.map((card, idx) => {
                        const key = `${tIndex}-${idx}`;
                        const isExpanded = expandedCards[key];
                        const maxChars = 80;
                        const truncatedContent =
                          card.content.length > maxChars && !isExpanded
                            ? card.content.slice(0, maxChars) + "..."
                            : card.content;

                        return (
                          <div
                            key={idx}
                            className="bg-neutral-700 rounded-lg p-4 border border-neutral-600 shadow-md flex flex-col"
                          >
                            <p className="text-sm font-semibold text-neutral-200 mb-1">{card.heading}</p>
                            <p className="text-sm text-neutral-300 mb-1">{card.subHeading}</p>
                            {card.image && (
                              <img
                                src={card.image}
                                alt={`SubCard ${idx + 1}`}
                                className="w-full h-auto object-cover rounded-lg mt-2"
                              />
                            )}
                            <p className="text-sm text-neutral-400 mt-2">
                              {truncatedContent}
                              {card.content.length > maxChars && (
                                <button
                                  onClick={() => toggleExpand(tIndex, idx)}
                                  className="ml-1 text-blue-400 font-semibold"
                                >
                                  {isExpanded ? "Show Less" : "Show More"}
                                </button>
                              )}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Trivia Images */}
                    {trivia.images && trivia.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                        {trivia.images.map((img, iIndex) => (
                          <div
                            key={iIndex}
                            className="overflow-hidden rounded-lg border border-neutral-600 shadow-md hover:scale-105 transition-transform"
                          >
                            <img
                              src={getImageUrl(img)}
                              alt={`Trivia Image ${iIndex + 1}`}
                              className="w-full h-28 object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Trivia Popup */}
      {selectedTrivia && (
        <EditTriviaPopup
          open={!!selectedTrivia}
          onClose={() => setSelectedTrivia(null)}
          triviaData={selectedTrivia}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
};

export default AllTriviaPopup;
