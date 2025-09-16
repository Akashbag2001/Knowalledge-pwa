import React, { useEffect, useState } from "react";
 // ✅ adjust path
// ✅ adjust path
import useHttp from "../../api/useHttp";
import ViewUsersTable from "../../components/superadmin/ViewUsersTable";

const ViewUsers = () => {
  const { sendRequest, loading } = useHttp();
  const [users, setUsers] = useState([]);

  // ✅ Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await sendRequest(
          "/superAdmin/getAllUsers",
          "GET",
          null,
          {},
        //   { name: "" } // ✅ query params
        );
        setUsers(res.data || []); // adjust if API returns differently
      } catch (err) {
        console.error("Error fetching users:", err.message);
      }
    };

    fetchUsers();
  }, [sendRequest]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-8">View Users</h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading users...</p>
      ) : (
        <ViewUsersTable users={users} />
      )}
    </div>
  );
};

export default ViewUsers;
