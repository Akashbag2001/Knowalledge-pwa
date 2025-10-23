import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useHttp from "../../api/useHttp";
import { toast } from "react-toastify";
import moment from "moment-timezone";

const AddEventComponent = () => {
  const { sendRequest, loading } = useHttp();
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    eventName: "",
    eventStartTime: "",
    eventEndTime: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // ✅ Fetch all events
//   const fetchEvents = async () => {
//     try {
//       const res = await sendRequest({
//         url: "/api/event", // Replace with your GET events endpoint
//         method: "GET",
//       });

//       if (res?.data) {
//         setEvents(res.data);
//       } else {
//         setEvents([]);
//         toast.info("No events found");
//       }
//     } catch (err) {
//       toast.error("Error fetching events");
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle submit to create new event
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { eventName, eventStartTime, eventEndTime } = formData;
    if (!eventName || !eventStartTime || !eventEndTime) {
      toast.warn("Please fill all fields");
      return;
    }

    setSubmitting(true);

    try {
      const res = await sendRequest({
        url: "/superAdmin/event", // Replace with your POST endpoint
        method: "POST",
        body: {
          eventName,
          eventStartTime,
          eventEndTime,
        },
      });

      if (res?.success) {
        toast.success("Event created successfully!");
        setFormData({ eventName: "", eventStartTime: "", eventEndTime: "" });
        // fetchEvents(); // Refresh the list immediately
      } else {
        toast.error(res?.message || "Failed to create event");
      }
    } catch (err) {
      toast.error("Error creating event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-5 text-gray-200 text-center">
        Create & View Events
      </h2>

      {/* ✅ Event Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-[#141C2F] p-6 rounded-2xl shadow-md space-y-5"
      >
        <div>
          <label className="block mb-1 text-gray-300">Event Name</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            placeholder="Enter event name"
            className="w-full p-2 rounded-md bg-[#1E2A47] text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-300">Event Start Time</label>
            <input
              type="datetime-local"
              name="eventStartTime"
              value={formData.eventStartTime}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-[#1E2A47] text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Event End Time</label>
            <input
              type="datetime-local"
              name="eventEndTime"
              value={formData.eventEndTime}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-[#1E2A47] text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-2 rounded-md font-semibold hover:opacity-90 transition-all"
        >
          {submitting ? "Creating..." : "Create Event"}
        </button>
      </form>

      {/* ✅ Event Cards */}
      <div className="mt-10">
        {loading ? (
          <p className="text-center text-gray-400 animate-pulse">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500">No events created yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event._id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-[#141C2F] rounded-xl shadow-md p-5 hover:shadow-blue-500/30 transition-all"
              >
                <h3 className="text-lg font-semibold text-blue-400 mb-2">
                  {event.eventName}
                </h3>

                <div className="text-sm text-gray-300 space-y-1">
                  <p>
                    <span className="text-gray-400">Start:</span>{" "}
                    {moment(event.eventStartTime).tz("Asia/Kolkata").format("DD MMM YYYY, hh:mm A")}
                  </p>
                  <p>
                    <span className="text-gray-400">End:</span>{" "}
                    {moment(event.eventEndTime).tz("Asia/Kolkata").format("DD MMM YYYY, hh:mm A")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEventComponent;
