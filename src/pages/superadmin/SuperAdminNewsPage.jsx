import React, { useState } from "react";
import AllNewsPreview from "../../components/superadmin/AllNewsPreview";

const SuperAdminNewsPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 p-8 sm:p-12">
      {/* Hero / Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1f4edb] mb-4">
          📰 SuperAdmin News Dashboard
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
          Manage, preview, and review all news items for your platform in one place.
          Keep your content organized and up to date.
        </p>
      </div>

      {/* Actions / Button */}
      <div className="flex justify-center mb-12">
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-[#1E2D5B] to-[#253b7a] hover:from-[#253b7a] hover:to-[#1E2D5B] 
                     px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          📜 View All News
        </button>
      </div>

      {/* Preview Section */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* You can add small sample cards for quick preview */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[#1E1E1E] border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl hover:bg-[#2B2B2B]/80 transition duration-300 flex flex-col justify-between"
          >
            <h2 className="text-xl font-bold text-[#1f4edb] mb-2">
              Sample News Heading {i}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              This is a short preview of news content. It gives an idea of how the news will appear in the list.
            </p>
            <div className="mt-auto flex justify-between items-center text-xs text-gray-500">
              <span>📅 2025-10-15</span>
              <span>🏷 Current Affair</span>
            </div>
          </div>
        ))}
      </div>

      {/* All News Modal */}
      <AllNewsPreview open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default SuperAdminNewsPage;
