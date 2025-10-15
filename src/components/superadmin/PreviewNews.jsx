import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useHttp from "../../api/useHttp";
import { toast } from "react-toastify";

const PreviewNews = ({ open, onClose, formData }) => {
  const { sendRequest } = useHttp();

  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({});

  // Initialize editable data and image preview
  useEffect(() => {
    if (!open || !formData) return;

    let url = null;

    if (formData.images instanceof File) {
      url = URL.createObjectURL(formData.images);
      setImagePreview(url);
    } else if (Array.isArray(formData.images) && formData.images.length > 0) {
      setImagePreview(formData.images[0]);
    } else if (typeof formData.images === "string") {
      setImagePreview(formData.images);
    } else {
      setImagePreview(null);
    }

    setEditableData(formData);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [formData, open]);

  if (!open) return null;

  // Handle field changes
  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEditableData((prev) => ({ ...prev, images: file }));
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  // Update news API call
  // Updated handleSave function with proper FormData handling
const handleSave = async () => {
  try {
    const formDataPayload = new FormData();

    // Handle all fields
    Object.entries(editableData).forEach(([key, value]) => {
      if (key === "images") {
        // If it's a new File object (user uploaded new image)
        if (value instanceof File) {
          formDataPayload.append("images", value);
        }
        // If it's an existing image URL/string, skip it (don't send)
        // The backend will keep the existing image
      } else if (key === "topics") {
        // Handle topics array - send as JSON string or individual items
        if (Array.isArray(value)) {
          formDataPayload.append("topics", JSON.stringify(value));
        }
      } else if (key === "_id") {
        // Skip _id as it's in the URL
        return;
      } else {
        // All other fields as text
        formDataPayload.append(key, value || "");
      }
    });

    // If no new image was uploaded, you might want to keep the old one
    // by sending the removeImages URL or handling it differently
    if (editableData.removeImages && !(editableData.images instanceof File)) {
      formDataPayload.append("removeImages", editableData.removeImages);
    }

    const response = await sendRequest(
      `/superAdmin/news/${formData._id}`,
      "PUT",
      formDataPayload,
      true // indicate multipart/form-data
    );

    if (response.success) {
      toast.success("News updated successfully!");
      setIsEditing(false);
      // Update local preview immediately
      if (response.data) {
        setEditableData(response.data);
        // Update image preview if new image URL is returned
        if (response.data.images) {
          if (Array.isArray(response.data.images) && response.data.images.length > 0) {
            setImagePreview(response.data.images[0]);
          } else if (typeof response.data.images === "string") {
            setImagePreview(response.data.images);
          }
        }
      }
    } else {
      toast.error(response.message || "Failed to update news");
    }
  } catch (err) {
    console.error("Error updating news:", err);
    toast.error(err.message || "Error updating news");
  }
};

  return (
    <AnimatePresence>
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
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className="text-gray-400 hover:text-yellow-400 transition text-lg sm:text-xl"
              >
                ✎
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-500 transition text-lg sm:text-xl"
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[70vh] sm:max-h-[75vh]">
            {/* Image */}
            {isEditing ? (
              <div className="w-full mb-4 sm:mb-6 flex flex-col items-center">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Featured"
                    className="w-full max-w-full sm:max-w-[600px] h-auto object-contain rounded-lg border border-gray-700 mb-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-gray-300"
                />
              </div>
            ) : (
              imagePreview && (
                <div className="w-full mb-4 sm:mb-6 flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Featured"
                    className="w-full max-w-full sm:max-w-[600px] h-auto object-contain rounded-lg border border-gray-700"
                  />
                </div>
              )
            )}

            {/* Heading */}
            {isEditing ? (
              <input
                type="text"
                value={editableData.heading || ""}
                onChange={(e) => handleChange("heading", e.target.value)}
                className="w-full p-2 sm:p-3 rounded bg-[#2B2B2B] border border-gray-700 text-white text-lg sm:text-2xl font-bold"
              />
            ) : (
              editableData.heading && (
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 sm:mb-3 break-words">
                  <div dangerouslySetInnerHTML={{ __html: editableData.heading }} />
                </h1>
              )
            )}

            {/* Subheading */}
            {isEditing ? (
              <input
                type="text"
                value={editableData.subHeading || ""}
                onChange={(e) => handleChange("subHeading", e.target.value)}
                className="w-full p-2 sm:p-3 rounded bg-[#2B2B2B] border border-gray-700 text-gray-300 text-lg sm:text-2xl italic"
              />
            ) : (
              editableData.subHeading && (
                <h2 className="text-lg sm:text-2xl italic font-semibold text-gray-300 mb-4 sm:mb-6 break-words">
                  <div dangerouslySetInnerHTML={{ __html: editableData.subHeading }} />
                </h2>
              )
            )}

            {/* Small Content */}
            {isEditing ? (
              <textarea
                value={editableData.smallContent || ""}
                onChange={(e) => handleChange("smallContent", e.target.value)}
                className="w-full p-3 rounded bg-[#2B2B2B]/30 border border-gray-700 text-gray-300 text-sm sm:text-lg"
              />
            ) : (
              editableData.smallContent && (
                <p className="text-gray-300 text-sm sm:text-lg mb-3 sm:mb-4 bg-[#2B2B2B]/30 p-3 sm:p-4 rounded border border-gray-700 break-words">
                  <div dangerouslySetInnerHTML={{ __html: editableData.smallContent }} />
                </p>
              )
            )}

            {/* Large Content */}
            {isEditing ? (
              <textarea
                value={editableData.largeContent || ""}
                onChange={(e) => handleChange("largeContent", e.target.value)}
                className="w-full p-3 rounded bg-[#2B2B2B]/30 border border-gray-700 text-gray-300 text-sm sm:text-lg"
                rows={6}
              />
            ) : (
              editableData.largeContent && (
                <article className="prose prose-invert max-w-full text-gray-200 break-words">
                  <div dangerouslySetInnerHTML={{ __html: editableData.largeContent }} />
                </article>
              )
            )}

            {/* Topics & Metadata */}
            <div className="mt-4 sm:mt-6 border-t border-gray-700 pt-2 sm:pt-4 text-xs sm:text-sm text-gray-400 flex flex-wrap gap-2 sm:gap-4">
              {editableData.date && <span>📅 {editableData.date}</span>}
              {editableData.contentType && <span>🏷 {editableData.contentType}</span>}
              {editableData.contentFor && <span>🎯 {editableData.contentFor}</span>}
              {editableData.topics?.length > 0 && (
                <span className="flex flex-wrap gap-1 sm:gap-2 items-center">
                  🏷 Topics:
                  {editableData.topics.map((t, i) => (
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
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-700 bg-[#2B2B2B] text-right flex justify-end gap-2">
            {isEditing && (
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition text-sm sm:text-base"
              >
                Save
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-[#1E2D5B] hover:bg-[#253b7a] text-white font-semibold transition text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreviewNews;
