import React, { useEffect, useRef } from "react";

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
        {/* Text style buttons */}
        {[
          { cmd: "bold", label: "B", style: "font-bold" },
          { cmd: "italic", label: "I", style: "italic" },
          { cmd: "underline", label: "U", style: "underline" },
          { cmd: "strikeThrough", label: "S", style: "line-through" },
          { cmd: "insertUnorderedList", label: "•", style: "" },
          { cmd: "insertOrderedList", label: "1.", style: "" },
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

        {/* Alignment buttons */}
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

        {/* Color pickers */}
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

export default RichTextEditor;
