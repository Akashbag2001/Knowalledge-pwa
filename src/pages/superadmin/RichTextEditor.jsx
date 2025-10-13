import { useEffect, useRef } from "react";


export const RichTextEditor = ({ value, onChange, placeholder, minHeight = "150px" }) => {
 
  const editorRef = useRef(null);

  // ✅ FIXED: update editor when value changes (important for reset)
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
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

  const handleColorChange = (e, command) => {
    execCommand(command, e.target.value);
  };

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

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onClick={(e) => e.stopPropagation()}
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