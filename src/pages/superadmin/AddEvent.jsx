import React from "react";
import AddEventComponent from "../../components/superadmin/AddEventComponent";

const AddEvent = () => {
  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Create New Event</h1>
      <AddEventComponent />
    </div>
  );
};

export default AddEvent;
