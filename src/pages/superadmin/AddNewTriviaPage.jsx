import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import useHttp from "../../api/useHttp";
import { useNavigate } from "react-router-dom";
import AllTriviaPopup from "../../components/superadmin/AllTriviaPopup";

const AddNewTriviaPage = () => {
  const { sendRequest, loading } = useHttp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    triviaName: "",
    subCards: [
      {
        heading: "",
        subHeading: "",
        content: "",
      },
    ],
    images: [],
  });

  const [allTrivias, setAllTrivias] = useState([]);
  const [showAllTrivias, setShowAllTrivias] = useState(false);

  // Fetch all trivias
  useEffect(() => {
    const fetchTrivias = async () => {
      try {
        const response = await sendRequest("/superAdmin/trivia", "GET");
        if (response.success) {

            console.log("Fetched Trivias --->", response)
          setAllTrivias(response.data || []);
        } else {
          toast.error(response.message || "Failed to load trivias");
        }
      } catch (error) {
        toast.error("Error fetching trivias");
      }
    };
    fetchTrivias();
  }, []);
  const refreshTrivias = useCallback(async () => {
  try {
    const response = await sendRequest("/superAdmin/trivia", "GET");
    if (response.success) setAllTrivias(response.data || []);
  } catch (err) {
    toast.error("Error refreshing trivias");
  }
}, [sendRequest])

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle subCard field changes
  const handleSubCardChange = (index, field, value) => {
    const updatedSubCards = [...formData.subCards];
    updatedSubCards[index][field] = value;
    setFormData((prev) => ({ ...prev, subCards: updatedSubCards }));
  };

  // Add new subCard
  const addSubCard = () => {
    setFormData((prev) => ({
      ...prev,
      subCards: [
        ...prev.subCards,
        { heading: "", subHeading: "", content: "" },
      ],
    }));
  };

  // Remove subCard
  const removeSubCard = (index) => {
    if (formData.subCards.length === 1) {
      toast.warning("At least one subcard is required");
      return;
    }
    const updatedSubCards = formData.subCards.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, subCards: updatedSubCards }));
  };

  // Handle image uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const currentImageCount = formData.images.length;
    const maxAllowed = formData.subCards.length;

    // Prevent more uploads than subCards
    if (currentImageCount + files.length > maxAllowed) {
      toast.warning(
        `You can upload only ${maxAllowed} image${
          maxAllowed > 1 ? "s" : ""
        } for ${maxAllowed} card${maxAllowed > 1 ? "s" : ""}`
      );
      return;
    }

    // Validate file types
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
  };

  // Remove image
  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.triviaName.trim()) {
      toast.error("Trivia name is required");
      return;
    }

    if (
      formData.subCards.some(
        (card) => !card.heading.trim() || !card.subHeading.trim() || !card.content.trim()
      )
    ) {
      toast.error("All subcard fields must be filled");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("triviaName", formData.triviaName.trim());
      formDataPayload.append("subCards", JSON.stringify(formData.subCards));
      formData.images.forEach((image) => formDataPayload.append("images", image));

      console.log("Submitting trivia data...");

      const response = await sendRequest("/superAdmin/trivia", "POST", formDataPayload);

      if (response.success) {
        toast.success("Trivia created successfully! 🎉");
        setFormData({
          triviaName: "",
          subCards: [{ heading: "", subHeading: "", content: "" }],
          images: [],
        });
      } else {
        toast.error(response.message || "Failed to create trivia");
      }
    } catch (error) {
      console.error("Error creating trivia:", error);
      toast.error(error.message || "Error creating trivia");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Create New Trivia
          </h1>
          <button
            type="button"
            onClick={() => setShowAllTrivias(true)}
            className="mt-3 sm:mt-0 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-semibold border border-neutral-700 transition"
          >
            👀 View All Trivias
          </button>
        </div>
        <p className="text-neutral-400 mb-6 sm:mb-8">
          Add engaging trivia content with multiple cards and images
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trivia Name */}
          <div className="bg-neutral-900 rounded-xl p-4 sm:p-6 border border-neutral-800">
            <label className="block text-sm font-semibold text-neutral-300 mb-2">
              Trivia Name *
            </label>
            <input
              type="text"
              name="triviaName"
              value={formData.triviaName}
              onChange={handleChange}
              placeholder="Backend Request"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* SubCards */}
          <div className="bg-neutral-900 rounded-xl p-4 sm:p-6 border border-neutral-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">SubCards *</h2>
              <button
                type="button"
                onClick={addSubCard}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center gap-2"
              >
                <span>+</span> Add Card
              </button>
            </div>

            <div className="space-y-4">
              {formData.subCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 space-y-3"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-blue-400">
                      Card #{index + 1}
                    </span>
                    {formData.subCards.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubCard(index)}
                        className="text-red-400 hover:text-red-500 transition text-xl leading-none"
                        title="Remove card"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">
                      Heading
                    </label>
                    <input
                      type="text"
                      value={card.heading}
                      onChange={(e) =>
                        handleSubCardChange(index, "heading", e.target.value)
                      }
                      placeholder="POST"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">
                      SubHeading
                    </label>
                    <input
                      type="text"
                      value={card.subHeading}
                      onChange={(e) =>
                        handleSubCardChange(index, "subHeading", e.target.value)
                      }
                      placeholder="Largest land animal"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">
                      Content
                    </label>
                    <textarea
                      value={card.content}
                      onChange={(e) =>
                        handleSubCardChange(index, "content", e.target.value)
                      }
                      placeholder="Elephants can weigh up to 6000 kg"
                      rows={3}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition resize-none"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-neutral-900 rounded-xl p-4 sm:p-6 border border-neutral-800">
            <h2 className="text-xl font-bold text-white mb-4">
              Images * ({formData.images.length} selected)
            </h2>

            <div className="space-y-4">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-neutral-700 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <span className="text-neutral-400 font-medium">
                    Click to upload images
                  </span>
                  <span className="text-xs text-neutral-500">
                    PNG, JPG, GIF up to 10MB each
                  </span>
                </label>
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition shadow-lg"
                        title="Remove image"
                      >
                        ✕
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-2 truncate">
                        {image.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Trivia...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Create Trivia
                </>
              )}
            </button>
          </div>
        </form>

        {/* All Trivia Popup */}
        {showAllTrivias && (
          <AllTriviaPopup
            open={showAllTrivias}
            onClose={() => setShowAllTrivias(false)}
            trivias={allTrivias}
            onRefresh={refreshTrivias}
          />
        )}
      </motion.div>
    </div>
  );
};

export default AddNewTriviaPage;
