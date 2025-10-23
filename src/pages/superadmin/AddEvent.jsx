import React, { useState } from "react";
import useHttp from "../../api/useHttp";
import { toast } from "react-toastify";
import AddEventComponent from "../../components/superadmin/AddEventComponent";

const AddEvent = () => {
  const { sendRequest, loading } = useHttp();

  const [formData, setFormData] = useState({
    eventName: "",
    eventStartTime: "",
    eventEndTime: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.eventName || !formData.eventStartTime || !formData.eventEndTime) {
      toast.warn("Please fill all fields");
      return;
    }

    try {
      const res = await sendRequest({
        url: "/api/event", // ✅ Update this with your correct API endpoint
        method: "POST",
        body: {
          eventName: formData.eventName,
          eventStartTime: formData.eventStartTime,
          eventEndTime: formData.eventEndTime,
        },
      });

      if (res?.success) {
        toast.success("Event created successfully!");
        setFormData({ eventName: "", eventStartTime: "", eventEndTime: "" });
      } else {
        toast.error(res?.message || "Failed to create event");
      }
    } catch (err) {
      toast.error("Error creating event");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Create New Event</h1>

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

      <div className="mt-10">
        <AddEventComponent />
      </div>
    </div>
  );
};

export default AddEvent;
