import React, { useEffect } from "react";
import { motion } from "framer-motion";

const TriviaSection = ({ triviaList }) => {
    if (!triviaList?.length) return null;
    useEffect(() => {
        console.log(triviaList)
    }, [])

    return (
        <div className="w-full mt-10">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">
                🧠 Trivia
            </h2>

            {/* Each Trivia Block */}
            {triviaList.map((triviaItem) => {
                const trivia = triviaItem.data;
                return (
                    <div
                        key={trivia?._id}
                        className="bg-[#111] border border-gray-800 rounded-2xl p-6 mb-8 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        {/* Trivia Header */}
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-[#1f4edb] mb-1">
                                {trivia?.triviaName || "Untitled Trivia"}
                            </h3>
                            {/* <p className="text-gray-400 text-sm">
                                📅 {new Date(trivia?.createdAt).toLocaleDateString()} •{" "}
                                {trivia?.subCards?.length || 0} Questions
                            </p> */}
                        </div>

                        {/* Subcards (horizontal scroll) */}
                        <div className="overflow-x-auto flex gap-4 pb-2">
                            {trivia?.subCards?.map((sub, index) => {
                                // Get image safely — assuming structure like sub.image or sub.images[0].url
                                const imageSrc =
                                    typeof sub.image === "string"
                                        ? sub.image
                                        : sub.images?.[0]?.url || null;

                                return (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.03 }}
                                        className="min-w-[260px] sm:min-w-[320px] bg-[#1e1e1e] border border-gray-700 rounded-xl hover:bg-[#2a2a2a] transition-all duration-300 overflow-hidden"
                                    >
                                        {/* 🖼️ Image Section */}
                                        {imageSrc && (
                                            <img
                                                src={imageSrc}
                                                alt="Trivia"
                                                className="w-full h-40 object-cover border-b border-gray-700"
                                            />
                                        )}

                                        {/* 📄 Content Section */}
                                        <div className="p-5">
                                            <h4
                                                className="text-lg font-semibold text-gray-100 mb-2"
                                                dangerouslySetInnerHTML={{ __html: sub.heading }}
                                            />
                                            <div
                                                className="text-gray-400 text-sm leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html: sub.content || "No content available",
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                    </div>
                );
            })}
        </div>
    );
};

export default TriviaSection;
