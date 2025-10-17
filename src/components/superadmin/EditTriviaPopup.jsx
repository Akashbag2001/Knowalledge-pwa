import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import useHttp from "../../api/useHttp";

const EditTriviaPopup = ({ open, onClose, triviaData, onRefresh }) => {
    const { sendRequest, loading } = useHttp();
    const triviaId = triviaData?._id || triviaData?.id;

    const [formData, setFormData] = useState({
        triviaName: "",
        subCards: [],
    });

    // Initialize form data when triviaData changes
    useEffect(() => {
        if (triviaData) {
            setFormData({
                triviaName: triviaData.triviaName || "",
                subCards:
                    triviaData.subCards?.map((card) => ({
                        ...card,
                        imageFile: null, // for device upload
                    })) || [],
            });
        }
    }, [triviaData]);

    // Handle main trivia name change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle subCard text field changes
    const handleSubCardChange = (index, field, value) => {
        const updatedSubCards = [...formData.subCards];
        updatedSubCards[index][field] = value;
        setFormData((prev) => ({ ...prev, subCards: updatedSubCards }));
    };

    // Handle subCard image selection from device
    const handleSubCardImageUpload = (index, file) => {
        if (!file) return;
        const updatedSubCards = [...formData.subCards];
        updatedSubCards[index].imageFile = file;
        updatedSubCards[index].image = URL.createObjectURL(file); // preview
        setFormData((prev) => ({ ...prev, subCards: updatedSubCards }));
    };

    // Add new subCard
    const addSubCard = () => {
        setFormData((prev) => ({
            ...prev,
            subCards: [
                ...prev.subCards,
                { heading: "", subHeading: "", content: "", image: "", imageFile: null },
            ],
        }));
    };

    // Remove subCard
    const removeSubCard = (index) => {
        if (formData.subCards.length === 1) {
            toast.warning("At least one subCard is required");
            return;
        }
        const updatedSubCards = formData.subCards.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, subCards: updatedSubCards }));
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.triviaName.trim()) {
            toast.error("Trivia name is required");
            return;
        }

        if (
            formData.subCards.some(
                (c) => !c.heading.trim() || !c.subHeading.trim() || !c.content.trim()
            )
        ) {
            toast.error("All subCard fields must be filled");
            return;
        }

        try {
            // Prepare payload: only text + image URL
            const subCardsPayload = formData.subCards.map(
                ({ heading, subHeading, content, image, _id }) => ({
                    heading,
                    subHeading,
                    content,
                    image, // URL string only
                    _id,
                })
            );

            const payload = {
                triviaName: formData.triviaName.trim(),
                subCards: subCardsPayload,
            };

            // Send JSON payload
            const response = await sendRequest(
                `/superAdmin/trivia/${triviaId}`,
                "PUT",
                payload
            );

            if (!response || !response.success) {
                toast.error(response?.message || "Error updating trivia");
                return;
            }

            toast.success("Trivia updated successfully!");
            onRefresh?.();
            setTimeout(() => {
                onClose();
            }, 500);
        } catch (err) {
            console.error(err);
            toast.error("Error updating trivia");
        }
    };

    return (
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
                        className="bg-neutral-900 text-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-600 text-2xl font-bold"
                            title="Close"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-center text-blue-400">
                            Edit Trivia
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Trivia Name */}
                            <div>
                                <label className="text-sm font-semibold text-neutral-300 mb-1 block">
                                    Trivia Name
                                </label>
                                <input
                                    type="text"
                                    name="triviaName"
                                    value={formData.triviaName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            {/* SubCards */}
                            {formData.subCards.map((card, index) => (
                                <div
                                    key={index}
                                    className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 space-y-2"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-blue-400">
                                            SubCard #{index + 1}
                                        </span>
                                        {formData.subCards.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSubCard(index)}
                                                className="text-red-400 hover:text-red-500 text-xl font-bold"
                                                title="Remove SubCard"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>

                                    <input
                                        type="text"
                                        value={card.heading}
                                        onChange={(e) =>
                                            handleSubCardChange(index, "heading", e.target.value)
                                        }
                                        placeholder="Heading"
                                        className="w-full px-2 py-1 bg-neutral-900 border border-neutral-600 rounded text-white focus:outline-none focus:border-blue-500 transition"
                                    />
                                    <input
                                        type="text"
                                        value={card.subHeading}
                                        onChange={(e) =>
                                            handleSubCardChange(index, "subHeading", e.target.value)
                                        }
                                        placeholder="SubHeading"
                                        className="w-full px-2 py-1 bg-neutral-900 border border-neutral-600 rounded text-white focus:outline-none focus:border-blue-500 transition"
                                    />
                                    <textarea
                                        value={card.content}
                                        onChange={(e) =>
                                            handleSubCardChange(index, "content", e.target.value)
                                        }
                                        placeholder="Content"
                                        rows={3}
                                        className="w-full px-2 py-1 bg-neutral-900 border border-neutral-600 rounded text-white focus:outline-none focus:border-blue-500 transition resize-none"
                                    />

                                    {/* Image */}
                                    <div className="flex items-center gap-3 mt-1">
                                        {card.image && (
                                            <img
                                                src={card.image}
                                                alt={`SubCard ${index + 1}`}
                                                className="w-20 h-20 object-cover rounded-lg border border-neutral-600"
                                            />
                                        )}

                                        {/* Edit Icon Trigger */}
                                        <div className="flex items-center justify-center w-10 h-10 bg-neutral-700 rounded-lg cursor-pointer hover:bg-blue-600 transition">
                                            <label className="w-full h-full flex items-center justify-center cursor-pointer">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15.232 5.232l3.536 3.536M16 3.5a2.121 2.121 0 113 3L7 18H4v-3L16 3.5z"
                                                    />
                                                </svg>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleSubCardImageUpload(index, e.target.files[0])}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>


                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addSubCard}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                            >
                                + Add SubCard
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Updating..." : "Update Trivia"}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditTriviaPopup;
