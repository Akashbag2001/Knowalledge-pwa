import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import useHttp from "../../api/useHttp";

const EditTriviaPopup = ({ open, onClose, triviaData }) => {
    const { sendRequest, loading } = useHttp();
    const triviaId = triviaData?._id || triviaData?.id;

    const [formData, setFormData] = useState({
        triviaName: "",
        subCards: [],
    });

    useEffect(() => {
        if (triviaData) {
            setFormData({
                triviaName: triviaData.triviaName || "",
                subCards: triviaData.subCards || [],
            });
        }
    }, [triviaData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubCardChange = (index, field, value) => {
        const updatedSubCards = [...formData.subCards];
        updatedSubCards[index][field] = value;
        setFormData((prev) => ({ ...prev, subCards: updatedSubCards }));
    };

    const addSubCard = () => {
        setFormData((prev) => ({
            ...prev,
            subCards: [
                ...prev.subCards,
                { heading: "", subHeading: "", content: "", image: "" },
            ],
        }));
    };

    const removeSubCard = (index) => {
        if (formData.subCards.length === 1) {
            toast.warning("At least one subCard is required");
            return;
        }
        const updatedSubCards = formData.subCards.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, subCards: updatedSubCards }));
    };

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
            const payload = new FormData();
            payload.append("triviaName", formData.triviaName.trim());
            payload.append("subCards", JSON.stringify(formData.subCards));

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
            //   onUpdate(); // refresh parent list
            onrefresh();
            // Delay popup close slightly for smooth UX
            setTimeout(() => {
                onClose();
            }, 1000);
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
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

                                    <div className="flex items-center gap-3 mt-1">
                                        {card.image && (
                                            <img
                                                src={card.image}
                                                alt={`SubCard ${index + 1}`}
                                                className="w-20 h-20 object-cover rounded-lg border border-neutral-600"
                                            />
                                        )}
                                        <input
                                            type="url"
                                            placeholder="Image URL"
                                            value={card.image || ""}
                                            onChange={(e) =>
                                                handleSubCardChange(index, "image", e.target.value)
                                            }
                                            className="flex-1 px-2 py-1 bg-neutral-900 border border-neutral-600 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition"
                                        />
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
