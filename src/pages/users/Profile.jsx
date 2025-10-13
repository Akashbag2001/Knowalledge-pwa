// src/pages/User/Profile.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import useHttp from "../../api/useHttp";

const Profile = () => {
    const { sendRequest } = useHttp();
    const user = JSON.parse(localStorage.getItem("user"));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        mobileNumber: user?.mobileNumber || "",
        city: user?.city || "",
        state: user?.state || "",
        country: user?.country || "",
        dateOfBirth: user?.dateOfBirth?.split("T")[0] || "",
    });

    const [newTopics, setNewTopics] = useState([]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen text-neutral-300">
                User not logged in
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await sendRequest(`/user/editProfile/${user._id}`, "PUT", formData);

            const updatedUser = { ...user, ...formData };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            toast.success("✅ Profile updated successfully!");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error updating profile:", error.message);
            toast.error("❌ Failed to update profile");
        }
    };

    const handleAddTopics = async () => {
        if (newTopics.length === 0) {
            toast.warn("⚠️ Please select at least one topic to add");
            return;
        }
        try {
            // ✅ Send topics as an array in JSON body
            await sendRequest(`/user/addMoreTopicsLater/${user._id}`, "POST", {
                topics: newTopics,
            });

            // Update localStorage
            const updatedUser = { ...user, topics: [...user.topics, ...newTopics] };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            toast.success("✅ Topics added successfully!");
            setNewTopics([]); // clear input
        } catch (error) {
            console.error("Error adding topics:", error.message);
            toast.error("❌ Failed to add topics");
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Profile Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-neutral-900 rounded-2xl p-6 shadow-lg">
                <div className="flex-shrink-0">
                    <img
                        src={user.profilePic}
                        alt={user.name}
                        className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
                    />
                </div>

                <div className="flex-1 text-neutral-200 space-y-2">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all"
                        >
                            Edit Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {[
                            ["Email", user.email],
                            ["Mobile Number", user.mobileNumber],
                            ["Gender", user.gender],
                            ["Date of Birth", new Date(user.dateOfBirth).toLocaleDateString()],
                            ["City", user.city],
                            ["State", user.state],
                            ["Country", user.country],
                        ].map(([label, value]) => (
                            <div key={label}>
                                <p className="text-sm text-neutral-400">{label}</p>
                                <p>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Existing Topics */}
                    {user.topics && user.topics.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm text-neutral-400">Topics</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {user.topics.map((topic, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                                    >
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add More Topics Section */}
            <div className="bg-neutral-900 rounded-2xl p-6 shadow-lg space-y-3">
                <h2 className="text-xl font-bold text-white">Add More Topics</h2>
                <p className="text-sm text-neutral-400">
                    Select topics you want to add to your profile.
                </p>

                <input
                    type="text"
                    placeholder="Enter topics comma separated"
                    value={newTopics.join(", ")}
                    onChange={(e) =>
                        setNewTopics(e.target.value.split(",").map((t) => t.trim()))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={handleAddTopics}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all"
                >
                    Add Topics
                </button>
            </div>

            {/* Edit Profile Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-neutral-900 p-6 rounded-2xl w-full max-w-md shadow-lg relative">
                        <h2 className="text-xl font-bold mb-4 text-white">Edit Profile</h2>
                        <div className="space-y-3">
                            {["name", "email", "mobileNumber", "city", "state", "country"].map(
                                (field) => (
                                    <div key={field}>
                                        <p className="text-sm text-neutral-400 capitalize">{field}</p>
                                        <input
                                            type="text"
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )
                            )}

                            <div>
                                <p className="text-sm text-neutral-400">Date of Birth</p>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
