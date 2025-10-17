import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useHttp from "../../api/useHttp";
import PreviewNews from "../../components/superadmin/PreviewNews";

/* ✅ Reusable Rich Text Editor */
const RichTextEditor = ({ value, onChange, placeholder, minHeight = "150px" }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const execCommand = (command, value = null) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      const range = document.createRange();
      range.selectNodeContents(editor);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    document.execCommand(command, false, value);
  };

  const handleColorChange = (e, command) => execCommand(command, e.target.value);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-[#1E1E1E] shadow-inner">
      {/* Toolbar */}
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

        {[{ cmd: "justifyLeft", label: "⬅" }, { cmd: "justifyCenter", label: "↔" }, { cmd: "justifyRight", label: "➡" }].map(
          ({ cmd, label }) => (
            <button
              key={cmd}
              type="button"
              onClick={() => execCommand(cmd)}
              className="px-3 py-1 bg-[#1E2D5B]/40 border border-gray-700 rounded hover:bg-[#1E2D5B]/60 text-gray-200"
            >
              {label}
            </button>
          )
        )}

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
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="p-4 text-gray-200 focus:outline-none"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />
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

/* ✅ Add News Component */
const AddNews = () => {
  const { sendRequest, loading } = useHttp();
  const [showPreview, setShowPreview] = useState(false);
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

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

  /* Fetch Topics */
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

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRichTextChange = (field, value) => {
    if (field === "smallContent") {
      const plainText = value.replace(/<[^>]*>/g, " ").trim();
      const wordCount = plainText.split(/\s+/).filter(Boolean).length;
      if (wordCount > 80) toast.warn("⚠️ Only 80 words allowed in the first content box");
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTopicToggle = (topic) => {
    setFormData((prev) => {
      const isSelected = prev.topics.includes(topic);
      if (!isSelected && prev.topics.length >= 5) {
        toast.warn("⚠️ Max 5 topics allowed");
        return prev;
      }
      return {
        ...prev,
        topics: isSelected ? prev.topics.filter((t) => t !== topic) : [...prev.topics, topic],
      };
    });
  };

  const handleFileChange = (e) => setFormData((prev) => ({ ...prev, images: e.target.files[0] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.heading || !formData.subHeading || !formData.date) {
      toast.warn("⚠️ Please fill all required fields");
      return;
    }

    const newsData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "topics") newsData.append(key, JSON.stringify(value));
      else if (key === "images" && value) newsData.append("images", value);
      else newsData.append(key, value);
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
        {/* Heading & Subheading */}
        {["heading", "subHeading"].map((field, i) => (
          <div key={i}>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              {field === "heading" ? "Heading" : "Sub Heading"}
            </label>
            <RichTextEditor
              value={formData[field]}
              onChange={(value) => handleRichTextChange(field, value)}
              placeholder={`Enter ${field === "heading" ? "heading" : "sub heading"}...`}
              minHeight="100px"
            />
          </div>
        ))}

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
                <p
                  className={`text-sm mt-1 ${wordCount > 80 ? "text-red-500" : "text-gray-400"
                    }`}
                >
                  {wordCount}/80 words
                </p>
              )}
            </div>
          );
        })}

        {/* Content Type */}
        {/* <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">
            Content Type
          </label>
          <select
            name="contentType"
            value={formData.contentType}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#2B2B2B] border border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Current Affair">Current Affair</option>
            <option value="Sports">Sports</option>
            <option value="Technology">Technology</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div> */}

        {/* Topics */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">Topics</label>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <button
                key={topic.name}
                type="button"
                onClick={() => handleTopicToggle(topic.name)}
                className={`px-4 py-2 rounded-full border ${formData.topics.includes(topic.name)
                    ? "bg-blue-700 border-blue-500 text-white"
                    : "bg-[#2B2B2B] border-gray-600 text-gray-300 hover:bg-[#3B3B3B]"
                  } transition`}
              >
                {topic.name}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-1">Max 5 topics allowed</p>
        </div>

        {/* Content For */}
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Content For
          </label>
          <select
            name="contentFor"
            value={formData.contentFor}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            required
          >
            <option value="">Select...</option>
            <option value="For School">For School</option>
            <option value="For Others">For Others</option>
          </select>

        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#2B2B2B] border border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 rounded-lg bg-[#2B2B2B] border border-gray-700 text-gray-200 focus:outline-none"
          />
          {formData.images && (
            <div className="mt-3">
              <p className="text-gray-400 mb-1 text-sm">Preview:</p>
              <img
                src={URL.createObjectURL(formData.images)}
                alt="Preview"
                className="w-48 h-32 object-cover rounded-lg border border-gray-700"
              />
            </div>
          )}
        </div>

        {/* Preview Button */}
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="w-full py-3 rounded-lg bg-[#1E2D5B] hover:bg-[#253b7a] text-white font-semibold transition"
        >
          👁️ Preview News
        </button>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "💾 Add News"}
        </button>

        {/* Navigate to All News Page */}
        <button
          type="button"
          onClick={() => navigate("/admin/all-news")}
          className="w-full sm:w-1/2 py-3 rounded-lg bg-[#3B3B3B] hover:bg-[#4A4A4A] text-gray-200 font-semibold transition"
        >
          📜 View All News
        </button>
      </form>

      {/* Preview Modal */}
      <PreviewNews
        open={showPreview}
        onClose={() => setShowPreview(false)}
        formData={formData}
      />
    </div>
  );
};

export default AddNews;
