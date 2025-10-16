import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EditTriviaPopup from "./EditTriviaPopup";

const AllTriviaPopup = ({ open, onClose, trivias, onRefresh }) => {
  const [selectedTrivia, setSelectedTrivia] = useState(null);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 text-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl"
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

              {trivias.length === 0 ? (
                <p className="text-neutral-400 text-center">No trivias found.</p>
              ) : (
                <div className="space-y-8">
                  {trivias.map((trivia, tIndex) => (
                    <div
                      key={tIndex}
                      onClick={() => setSelectedTrivia(trivia)}
                      className="cursor-pointer bg-neutral-800 rounded-xl p-5 border border-neutral-700 shadow-lg hover:shadow-blue-500/40 transition-shadow"
                    >
                      <h3 className="text-2xl font-semibold text-blue-300 mb-4">
                        {trivia.triviaName}
                      </h3>

                      {/* SubCards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {trivia.subCards.map((card, cIndex) => (
                          <div
                            key={cIndex}
                            className="bg-neutral-700 rounded-lg p-4 border border-neutral-600 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <p className="text-sm font-semibold text-neutral-200 mb-1">
                              Heading: {card.heading}
                            </p>
                            <p className="text-sm text-neutral-300 mb-1">
                              SubHeading: {card.subHeading}
                            </p>
                            <p className="text-sm text-neutral-400 mb-2">{card.content}</p>

                            {card.image && (
                              <img
                                src={card.image}
                                alt={`SubCard ${cIndex + 1}`}
                                className="w-full h-28 object-cover rounded-lg shadow-md mt-2"
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Trivia Images */}
                      {trivia.images && trivia.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {trivia.images.map((img, iIndex) => (
                            <div
                              key={iIndex}
                              className="overflow-hidden rounded-lg border border-neutral-600 shadow-md hover:scale-105 transition-transform"
                            >
                              <img
                                src={img.url || img} // API may return URL or file path
                                alt={`Trivia ${tIndex + 1} Image ${iIndex + 1}`}
                                className="w-full h-28 object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
          // Callback to refresh trivia list after edit
        />
      )}
    </>
  );
};

export default AllTriviaPopup;
