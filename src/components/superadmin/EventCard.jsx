import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import useHttp from "../../api/useHttp";
import AddQuiz from "./AddQuiz";

const EventCard = () => {
    const { sendRequest, loading } = useHttp();
    const [events, setEvents] = useState([]);
    const [openQuiz, setOpenQuiz] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);

    // Fetch events from API
    const fetchEvents = async () => {
        try {
            const res = await sendRequest("/superAdmin/event", "GET");

            if (res?.data && Array.isArray(res.data)) {
                setEvents(res.data);
            } else if (Array.isArray(res)) {
                setEvents(res);
            } else {
                setEvents([]);
                toast.info("No events found");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error fetching events");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Open quiz popup for selected event
    const handleOpenQuiz = (eventId) => {
        setSelectedEventId(eventId);
        setOpenQuiz(true);
    };

    // Close quiz popup
    const handleCloseQuiz = () => {
        setOpenQuiz(false);
        setSelectedEventId(null);
    };

    return (
        <div className="mt-10 max-w-6xl mx-auto">
            {loading ? (
                <p className="text-center text-gray-400 animate-pulse">Loading events...</p>
            ) : events.length === 0 ? (
                <p className="text-center text-gray-500">No events created yet.</p>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-[#141C2F] rounded-xl shadow-md p-5 hover:shadow-blue-500/30 transition-all cursor-pointer"
                            onClick={() => handleOpenQuiz(event._id)}
                        >
                            <h3 className="text-lg font-semibold text-blue-400 mb-2">
                                {event.eventName}
                            </h3>
                            <div className="text-sm text-gray-300 space-y-1">
                                <p>
                                    <span className="text-gray-400">Start:</span>{" "}
                                    {moment(event.eventStartTime)
                                        .tz("Asia/Kolkata")
                                        .format("DD MMM YYYY, hh:mm A")}
                                </p>
                                <p>
                                    <span className="text-gray-400">End:</span>{" "}
                                    {moment(event.eventEndTime)
                                        .tz("Asia/Kolkata")
                                        .format("DD MMM YYYY, hh:mm A")}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Quiz Modal */}
            {openQuiz && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
                    <div className="bg-[#0B1120] rounded-3xl shadow-2xl max-w-3xl w-full p-6 relative">
                        <button
                            onClick={handleCloseQuiz}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
                        >
                            &times;
                        </button>
                        <AddQuiz eventId={selectedEventId} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventCard;
