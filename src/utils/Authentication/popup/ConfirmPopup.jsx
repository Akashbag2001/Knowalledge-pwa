// src/components/ConfirmPopup.jsx
import React from "react";

const ConfirmPopup = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex shadow-2xl items-center justify-center backdrop-blur-sm bg-opacity-50">
      <div className="bg-neutral-900 text-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4">{title || "Confirm Action"}</h2>
        <p className="mb-6">{message || "Are you sure you want to proceed?"}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
