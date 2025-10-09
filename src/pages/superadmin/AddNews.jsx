import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import useHttp from "../../api/useHttp";

// ✅ Reusable Rich Text Editor with Dark UI
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
    const editor = editorRef.current;
    if (!editor) return;

    // Focus the editor first
    editor.focus();

    // Restore the last selection if user clicked toolbar
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      const range = document.createRange();
      range.selectNodeContents(editor);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // Execute the command safely
    document.execCommand(command, false, value);
  };

  const handleColorChange = (e, command) => {
    execCommand(command, e.target.value);
  };

   const isActive = (cmd) => activeCommands.includes(cmd);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-[#1E1E1E] shadow-inner">
      <div className="flex flex-wrap gap-1 p-2 bg-[#2B2B2B] border-b border-gray-700">
        {[
          { cmd: "bold", label: "B", style: "font-bold" },
          { cmd: "italic", label: "I", style: "italic" },
          { cmd: "underline", label: "U", style: "underline" },
          { cmd: "strikeThrough", label: "S", style: "line-through" },
        ].map(({ cmd, label, style }) => (
          <button
            key={cmd}
            type="button"
            onClick={() => execCommand(cmd)}
            className={`px-3 py-1 bg-[#1E2D5B]/40 border border-gray-700 rounded hover:bg-[#1E2D5B]/60 text-gray-200 ${style}`}
          >
            {label}
          </button>
        ))}

        <div className="w-px bg-gray-700 mx-1"></div>

        {/* <button
          onClick={() => execCommand("insertUnorderedList")}
          type="button"
          className="px-3 py-1 bg-[#1E2D5B]/40 border border-gray-700 rounded hover:bg-[#1E2D5B]/60 text-gray-200"
        >
          • List
        </button>
        <button
          onClick={() => execCommand("insertOrderedList")}
          type="button"
          className="px-3 py-1 bg-[#1E2D5B]/40 border border-gray-700 rounded hover:bg-[#1E2D5B]/60 text-gray-200"
        >
          1. List
        </button> */}

        <div className="w-px bg-gray-700 mx-1"></div>

        {[
          { cmd: "justifyLeft", label: "⬅" },
          { cmd: "justifyCenter", label: "↔" },
          { cmd: "justifyRight", label: "➡" },
        ].map(({ cmd, label }) => (
          <button
            key={cmd}
            type="button"
            onClick={() => execCommand(cmd)}
            className="px-3 py-1 bg-[#1E2D5B]/40 border border-gray-700 rounded hover:bg-[#1E2D5B]/60 text-gray-200"
          >
            {label}
          </button>
        ))}

        <div className="w-px bg-gray-700 mx-1"></div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 px-2 py-1 bg-[#1E2D5B]/40 border border-gray-700 rounded hover:bg-[#1E2D5B]/60 cursor-pointer text-gray-200">
            <span className="text-sm">A</span>
            <input
              type="color"
              onChange={(e) => handleColorChange(e, "foreColor")}
              className="w-6 h-6 cursor-pointer border-none bg-transparent"
              title="Text Color"
            />
          </label>
          <label className="flex items-center gap-1 px-2 py-1 bg-[#1E2D5B]/40 border border-gray-700 rounded hover:bg-[#1E2D5B]/60 cursor-pointer text-gray-200">
            <span className="text-sm">🎨</span>
            <input
              type="color"
              onChange={(e) => handleColorChange(e, "backColor")}
              className="w-6 h-6 cursor-pointer border-none bg-transparent"
              title="Background Color"
            />
          </label>
        </div>

        <div className="w-px bg-gray-700 mx-1"></div>

        {/* <button
          onClick={() => execCommand("removeFormat")}
          type="button"
          className="px-3 py-1 bg-red-700/40 border border-gray-700 rounded hover:bg-red-700/60 text-gray-200"
        >
          ✕
        </button> */}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onClick={(e) => e.stopPropagation()} // prevent losing selection
        className="p-4 text-gray-200 focus:outline-none"
        style={{ minHeight }}
        data-placeholder={placeholder}
      ></div>


      <style jsx>{`
        [contentEditable]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

// ✅ Add News (Dark UI)
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

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await sendRequest("/superAdmin/topics", "GET");
        setTopics(data?.topics || []);
      } catch {
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
    if (field === "smallContent") {
      // Strip HTML tags and count words
      const plainText = value.replace(/<[^>]*>/g, " ").trim();
      const wordCount = plainText.split(/\s+/).filter(Boolean).length;

      if (wordCount > 80) {
        toast.warn("Sorry in First Content Box you can add only 80 words!!");
        return; // Prevent updating state beyond 80 words
      }
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, images: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.heading || !formData.subHeading || !formData.date) {
      toast.warn("⚠️ Please fill all required fields");
      return;
    }

    const newsData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "topics") {
        newsData.append(key, JSON.stringify(value));
      } else if (key === "images" && value) {
        newsData.append("images", value); // append single image
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
    <div className="p-8 min-h-screen bg-[#121212] text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-[#1f4edb]">📰 Add News</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-[#1E1E1E] p-8 rounded-2xl shadow-lg border border-gray-800"
      >
        {/* Heading */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">
            Heading
          </label>
          <RichTextEditor
            value={formData.heading}
            onChange={(value) => handleRichTextChange("heading", value)}
            placeholder="Enter heading..."
            minHeight="100px"
          />
        </div>

        {/* Subheading */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">
            Sub Heading
          </label>
          <RichTextEditor
            value={formData.subHeading}
            onChange={(value) => handleRichTextChange("subHeading", value)}
            placeholder="Enter sub heading..."
            minHeight="100px"
          />
        </div>

        {/* Small & Large Content */}
        {["smallContent", "largeContent"].map((field, i) => {
          const plainText = formData[field]?.replace(/<[^>]*>/g, " ").trim() || "";
          const wordCount = plainText.split(/\s+/).filter(Boolean).length;

          return (
            <div key={i}>
              <label className="block text-sm font-semibold mb-2 text-gray-300 capitalize">
                {field.replace("Content", " Content")}
              </label>
              <RichTextEditor
                value={formData[field]}
                onChange={(value) => handleRichTextChange(field, value)}
                placeholder={`Enter ${field.replace("Content", " content")}...`}
                minHeight={field === "largeContent" ? "250px" : "150px"}
              />
              {field === "smallContent" && (
                <p className={`text-sm mt-1 ${wordCount > 80 ? "text-red-500" : "text-gray-400"}`}>
                  {wordCount}/80 words
                </p>
              )}
            </div>
          );
        })}


        {/* Content Type */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">
            Content Type
          </label>
          <input
            type="text"
            name="contentType"
            value={formData.contentType}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#2B2B2B] text-gray-100 border border-gray-700 focus:ring-2 focus:ring-[#1E2D5B]"
          />
        </div>

        {/* Topics */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">
            Select Topics (max 5)
          </label>
          {topics.length === 0 ? (
            <p className="text-gray-500">Loading topics...</p>
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isSelected
                      ? "bg-[#1E2D5B] text-white"
                      : "bg-[#2B2B2B] text-gray-300 hover:bg-[#1E2D5B]/70 hover:text-white"
                      }`}
                  >
                    {topicName}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content For */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">
            Content For
          </label>
          <select
            name="contentFor"
            value={formData.contentFor}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#2B2B2B] text-gray-100 border border-gray-700 focus:ring-2 focus:ring-[#1E2D5B]"
          >
            <option value="">Select</option>
            <option value="For School">For School</option>
            <option value="For Others">For Others</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#2B2B2B] text-gray-100 border border-gray-700 focus:ring-2 focus:ring-[#1E2D5B]"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">
            Upload Image
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1E2D5B] file:text-white hover:file:bg-[#253b7a]"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "💾 Add News"}
        </button>
      </form>
    </div>
  );
};

export default AddNews;
