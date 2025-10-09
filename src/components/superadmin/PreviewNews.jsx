import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const PreviewNews = ({ open, onClose, formData = {} }) => {
  if (!open) return null;

  const {
    heading = "",
    subHeading = "",
    smallContent = "",
    largeContent = "",
    topics = [],
    contentType = "",
    contentFor = "",
    date = "",
    images = null,
  } = formData;

  const renderHTML = (content) =>
    content ? (
      <div dangerouslySetInnerHTML={{ __html: content }} />
    ) : (
      <p className="text-gray-500 italic">No content available</p>
    );

  const renderImage = (file) => {
    try {
      if (file instanceof File) {
        return URL.createObjectURL(file);
      }
      if (typeof file === "string") {
        return file;
      }
      return null;
    } catch {
      return null;
    }
  };

  const imageSrc = renderImage(images);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Popup Container */}
        <motion.div
          className="bg-[#1E1E1E] border border-gray-800 rounded-2xl shadow-2xl max-w-5xl w-[90%] max-h-[90vh] overflow-y-auto text-gray-100"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-[#1E1E1E]/95 backdrop-blur-sm z-10">
            <h2 className="text-2xl font-bold text-[#1f4edb]">📰 News Preview</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition text-xl"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Image */}
            {imageSrc && (
              <div className="flex justify-center">
                <img
                  src={imageSrc}
                  alt="News Preview"
                  className="rounded-lg max-h-64 object-cover border border-gray-700 shadow-md"
                />
              </div>
            )}

            {/* Heading */}
            {heading && (
              <h1
                className="text-3xl font-bold text-[#1f4edb] mb-2"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {/* Subheading */}
            {subHeading && (
              <h2
                className="text-xl font-semibold text-gray-300"
                dangerouslySetInnerHTML={{ __html: subHeading }}
              />
            )}

            {/* Small Content */}
            {smallContent && (
              <div className="text-gray-300 leading-relaxed border-l-4 border-[#1E2D5B] pl-4 italic">
                {renderHTML(smallContent)}
              </div>
            )}

            {/* Large Content */}
            {largeContent && (
              <div className="text-gray-200 leading-relaxed space-y-2">
                {renderHTML(largeContent)}
              </div>
            )}

            {/* Metadata */}
            <div className="border-t border-gray-700 pt-4 text-sm text-gray-400 flex flex-wrap justify-between gap-3">
              <div>
                <strong className="text-gray-300">Content Type:</strong>{" "}
                {contentType || "N/A"}
              </div>
              <div>
                <strong className="text-gray-300">Content For:</strong>{" "}
                {contentFor || "N/A"}
              </div>
              <div>
                <strong className="text-gray-300">Date:</strong>{" "}
                {date || "N/A"}
              </div>
            </div>

            {/* Topics */}
            {topics?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-300">
                  Topics:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic, index) => (
                    <span
                      key={index}
                      className="bg-[#1E2D5B] text-white px-3 py-1 rounded-full text-xs shadow-md"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-700 p-4 flex justify-end bg-[#1E1E1E]/90 backdrop-blur-sm">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-[#1E2D5B] hover:bg-[#253b7a] transition text-white font-medium"
            >
              Close Preview
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreviewNews;
