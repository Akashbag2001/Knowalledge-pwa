import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const PreviewNews = ({ open, onClose, formData }) => {
  if (!open || !formData) return null;

  const imagePreview =
    formData.images instanceof File
      ? URL.createObjectURL(formData.images)
      : typeof formData.images === "string"
      ? formData.images
      : null;

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm pt-20 flex items-center justify-center z-50 p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="w-full max-w-3xl sm:max-w-5xl bg-[#1E1E1E] text-gray-100 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700 bg-[#2B2B2B]">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1f4edb] truncate">
                📰 News Preview
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-500 transition text-lg sm:text-xl"
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[70vh] sm:max-h-[75vh]">
              {/* Featured Image */}
              {imagePreview && (
                <div className="w-full mb-4 sm:mb-6 flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Featured"
                    className="w-full max-w-full sm:max-w-[600px] h-auto object-contain rounded-lg border border-gray-700"
                  />
                </div>
              )}

              {/* Heading */}
              {formData.heading && (
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 sm:mb-3 break-words">
                  <div dangerouslySetInnerHTML={{ __html: formData.heading }} />
                </h1>
              )}

              {/* Subheading */}
              {formData.subHeading && (
                <h2 className="text-lg sm:text-2xl italic font-semibold text-gray-300 mb-4 sm:mb-6 break-words">
                  <div dangerouslySetInnerHTML={{ __html: formData.subHeading }} />
                </h2>
              )}

              {/* Short Content */}
              {formData.smallContent && (
                <p className="text-gray-300 text-sm sm:text-lg mb-3 sm:mb-4 bg-[#2B2B2B]/30 p-3 sm:p-4 rounded border border-gray-700 break-words">
                  <div dangerouslySetInnerHTML={{ __html: formData.smallContent }} />
                </p>
              )}

              {/* Large Content */}
              {formData.largeContent && (
                <article className="prose prose-invert max-w-full text-gray-200 break-words">
                  <div dangerouslySetInnerHTML={{ __html: formData.largeContent }} />
                </article>
              )}

              {/* Topics & Metadata */}
              <div className="mt-4 sm:mt-6 border-t border-gray-700 pt-2 sm:pt-4 text-xs sm:text-sm text-gray-400 flex flex-wrap gap-2 sm:gap-4">
                {formData.date && <span>📅 {formData.date}</span>}
                {formData.contentType && <span>🏷 {formData.contentType}</span>}
                {formData.contentFor && <span>🎯 {formData.contentFor}</span>}
                {formData.topics?.length > 0 && (
                  <span className="flex flex-wrap gap-1 sm:gap-2 items-center">
                    🏷 Topics:
                    {formData.topics.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full bg-[#1E2D5B] text-white text-xs sm:text-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-700 bg-[#2B2B2B] text-right">
              <button
                onClick={onClose}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-[#1E2D5B] hover:bg-[#253b7a] text-white font-semibold transition text-sm sm:text-base"
              >
                Close Preview
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreviewNews;
