import React, { useState, useEffect } from "react";
import useHttp from "../../api/useHttp"; // adjust path

const AddSchool = () => {
  const [formData, setFormData] = useState({ name: "" });
  const [schools, setSchools] = useState([]);

  const { sendRequest, loading } = useHttp();
  const token = localStorage.getItem("token"); // ✅ get token

  // Fetch all schools on mount
  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await sendRequest(
        "/school/getSchool",
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );
      if (res?.schools) {
        setSchools(res.schools);
      }
    } catch (err) {
      console.error("❌ Failed to fetch schools:", err.message);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await sendRequest(
        "/school/addSchool",
        "POST",
        formData,
        { Authorization: `Bearer ${token}` }
      );
      alert("✅ School added successfully!");

      // Reset form
      setFormData({ name: "" });

      // ✅ Option 1: Directly append new school to state (optimistic update)
      if (res?.school) {
        setSchools((prev) => [...prev, res.school]);
      } else {
        // if API doesn't return the new school object, fallback to fetch
        fetchSchools();
      }
    } catch (err) {
      console.error(err.message);
      alert("❌ Failed to add school: " + err.message);
    }
  };


  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Add New School
        </h1>

        {/* Add School Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Enter school name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-600 bg-gray-900 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition"
          >
            {loading ? "Adding..." : "Add School"}
          </button>
        </form>
      </div>

      {/* List of Schools */}
      <div className="mt-10 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          All Schools
        </h2>
        {schools.length > 0 ? (
          <ul className="space-y-3">
            {schools.map((school) => (
              <li
                key={school._id}
                className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg shadow-md transition"
              >
                <span className="text-lg font-medium">{school.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center">
            No schools available yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default AddSchool;
