import React, { useState } from "react";
import { toast } from "react-toastify";
import useHttp from "../../api/useHttp";
import { div } from "framer-motion/client";
import EventCard from "./EventCard";

const AddEventComponent = () => {
  const { sendRequest, loading } = useHttp();
 
  const [formData, setFormData] = useState({
    eventName: "",
    eventStartTime: "",
    eventEndTime: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { eventName, eventStartTime, eventEndTime } = formData;

    if (!eventName || !eventStartTime || !eventEndTime) {
      toast.warn("Please fill all fields");
      return;
    }

    try {
      const res = await sendRequest(
        "/superAdmin/event", // endpoint
        "POST",              // method
        { eventName, eventStartTime, eventEndTime } // body
      );

      if (res?.message == "Event created") {
        toast.success("Event created successfully!");
        setFormData({ eventName: "", eventStartTime: "", eventEndTime: "" });
      } else {
        toast.error(res?.message || "Failed to create event");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating event");
    }
  };

  return (
    <div className="flex flex-col">
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
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-2 rounded-md font-semibold hover:opacity-90 transition-all"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
      <EventCard />
    </div>
  );
};

export default AddEventComponent;
