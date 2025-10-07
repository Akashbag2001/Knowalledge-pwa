import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import useHttp from "../../api/useHttp"; // ✅ your actual hook

// ✅ Reusable Rich Text Editor (unchanged)
const RichTextEditor = ({ value, onChange, placeholder, minHeight = "150px" }) => {
  const editorRef = useRef(null);
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleColorChange = (e, command) => {
    execCommand(command, e.target.value);
  };

  return (
    <div className="border border-gray-600 rounded-lg overflow-hidden bg-white">
      <div className="flex flex-wrap gap-1 p-2 bg-gray-100 border-b border-gray-300">
        {[
          { cmd: "bold", label: "B", style: "font-bold" },
          { cmd: "italic", label: "I", style: "italic" },
          { cmd: "underline", label: "U", style: "underline" },
          { cmd: "strikeThrough", label: "S", style: "line-through" },
        ].map(({ cmd, label, style }) => (
          <button
            key={cmd}
            onClick={() => execCommand(cmd)}
            className={`px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 ${style}`}
          >
            {label}
          </button>
        ))}
        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          onClick={() => execCommand("insertUnorderedList")}
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          • List
        </button>
        <button
          onClick={() => execCommand("insertOrderedList")}
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          1. List
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        {[
          { cmd: "justifyLeft", label: "⬅" },
          { cmd: "justifyCenter", label: "↔" },
          { cmd: "justifyRight", label: "➡" },
        ].map(({ cmd, label }) => (
          <button
            key={cmd}
            onClick={() => execCommand(cmd)}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            {label}
          </button>
        ))}

        <div className="w-px bg-gray-300 mx-1"></div>

        <div className="flex items-center gap-1">
          <label className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
            <span className="text-sm">A</span>
            <input
              type="color"
              onChange={(e) => handleColorChange(e, "foreColor")}
              className="w-6 h-6 cursor-pointer"
              title="Text Color"
            />
          </label>
          <label className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
            <span className="text-sm">🎨</span>
            <input
              type="color"
              onChange={(e) => handleColorChange(e, "backColor")}
              className="w-6 h-6 cursor-pointer"
              title="Background Color"
            />
          </label>
        </div>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          onClick={() => execCommand("removeFormat")}
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          ✕
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 text-gray-900 focus:outline-none"
        style={{ minHeight }}
        data-placeholder={placeholder}
      ></div>

      <style jsx>{`
        [contentEditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

// ✅ Add News Component
const AddNews = () => {
  const { sendRequest, loading } = useHttp();
  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
    smallContent: "",
    largeContent: "",
    contentType: "Current Affair",
    topics: [],
    contentFor: "",
    date: "",
    images: null,
  });

  // ✅ Fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await sendRequest("/superAdmin/topics", "GET");
        setTopics(data?.topics || []);
      } catch (error) {
        toast.error("❌ Failed to fetch topics");
      }
    };
    fetchTopics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRichTextChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Topic toggle with limit
  const handleTopicToggle = (topic) => {
    setFormData((prev) => {
      const isSelected = prev.topics.includes(topic);
      if (!isSelected && prev.topics.length >= 5) {
        toast.warn("⚠️ You can select up to 5 topics only");
        return prev;
      }

      return {
        ...prev,
        topics: isSelected
          ? prev.topics.filter((t) => t !== topic)
          : [...prev.topics, topic],
      };
    });
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, images: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!formData.heading || !formData.subHeading || !formData.date) {
    //   toast.warn("⚠️ Please fill all required fields");
    //   return;
    // }

    const newsData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "topics") {
        newsData.append(key, JSON.stringify(value));
      } else {
        newsData.append(key, value);
      }
    });

    try {
      await sendRequest("/superAdmin/news", "POST", newsData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ News added successfully!");
      setFormData({
        heading: "",
        subHeading: "",
        smallContent: "",
        largeContent: "",
        contentType: "Current Affair",
        topics: [],
        contentFor: "",
        date: "",
        images: null,
      });
    } catch {
      toast.error("❌ Failed to add news");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-white">📰 Add News</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-2xl shadow-lg">
        {/* Heading */}
        <div>
          <label className="block text-sm font-semibold mb-2">Heading</label>
          <RichTextEditor
            value={formData.heading}
            onChange={(value) => handleRichTextChange("heading", value)}
            placeholder="Enter heading..."
            minHeight="100px"
          />
        </div>

        {/* Subheading */}
        <div>
          <label className="block text-sm font-semibold mb-2">Sub Heading</label>
          <RichTextEditor
            value={formData.subHeading}
            onChange={(value) => handleRichTextChange("subHeading", value)}
            placeholder="Enter sub heading..."
            minHeight="100px"
          />
        </div>

        {/* Small & Large Content */}
        {["smallContent", "largeContent"].map((field, i) => (
          <div key={i}>
            <label className="block text-sm font-semibold mb-2 capitalize">
              {field.replace("Content", " Content")}
            </label>
            <RichTextEditor
              value={formData[field]}
              onChange={(value) => handleRichTextChange(field, value)}
              placeholder={`Enter ${field.replace("Content", " content")}...`}
              minHeight={field === "largeContent" ? "250px" : "150px"}
            />
          </div>
        ))}

        {/* Content Type */}
        <div>
          <label className="block text-sm font-semibold mb-2">Content Type</label>
          <input
            type="text"
            name="contentType"
            value={formData.contentType}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ✅ Topics with 5 limit */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Select Topics (max 5)
          </label>
          {topics.length === 0 ? (
            <p className="text-gray-400">Loading topics...</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {topics.map((topic, index) => {
                const topicName = topic.name || topic.title || topic;
                const isSelected = formData.topics.includes(topicName);
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => handleTopicToggle(topicName)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-blue-700 hover:text-white"
                    }`}
                  >
                    {topicName}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ✅ Dropdown for Content For */}
        <div>
          <label className="block text-sm font-semibold mb-2">Content For</label>
          <select
            name="contentFor"
            value={formData.contentFor}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="For School">For School</option>
            <option value="For Others">For Others</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-semibold mb-2">Upload Image</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "💾 Add News"}
        </button>
      </form>
    </div>
  );
};

export default AddNews;
