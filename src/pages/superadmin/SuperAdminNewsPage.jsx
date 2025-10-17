import React from "react";
import AllNewsPreview from "../../components/superadmin/AllNewsPreview";

const SuperAdminNewsPage = () => {
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

      {/* All News Section Inline */}
      <AllNewsPreview />
    </div>
  );
};

export default SuperAdminNewsPage;
