import React, { useState } from "react";
import useHttp from "../../api/useHttp"; // adjust path

const AddSchool = () => {
  const [formData, setFormData] = useState({
    name: "",
  });

  const { sendRequest, loading } = useHttp();

  // ✅ get token from localStorage
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await sendRequest(
        "/school/addSchool", // ✅ matches your API
        "POST",
        formData,
        {
          Authorization: `Bearer ${token}`, // ✅ pass token in header
        }
      );
      alert("✅ School added successfully!");
      console.log(res);

      // reset form
      setFormData({
        name: "",
      });
    } catch (err) {
      console.error(err.message);
      alert("❌ Failed to add school: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New School</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          name="name"
          placeholder="School Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
        >
          {loading ? "Adding..." : "Add School"}
        </button>
      </form>
    </div>
  );
};

export default AddSchool;
