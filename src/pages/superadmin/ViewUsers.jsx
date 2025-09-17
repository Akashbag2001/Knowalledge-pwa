import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useHttp from "../../api/useHttp";
import ConfirmPopup from "../../utils/Authentication/popup/ConfirmPopup";


const ViewUsers = () => {
  const { sendRequest, loading } = useHttp();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ name: "", email: "", role: "" });
  const [debouncedFilters] = useDebounce(filters, 500);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...debouncedFilters,
      });

      const res = await sendRequest(
        `/superAdmin/getAllUsers?${queryParams.toString()}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res) {
        setUsers(res.users || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching users:", err.message);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await sendRequest(
        `/superAdmin/userDelete/${userToDelete}`,
        "DELETE",
        null,
        { Authorization: `Bearer ${token}` }
      );
      toast.success("User deleted successfully!");
      setConfirmOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err.message);
      toast.error("Failed to delete user");
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-10 px-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-8">View Users</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Filter by name"
          value={filters.name}
          onChange={handleFilterChange}
          className="px-3 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700"
        />
        <input
          type="text"
          name="email"
          placeholder="Filter by email"
          value={filters.email}
          onChange={handleFilterChange}
          className="px-3 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700"
        />
        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          className="px-3 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="schoolUser">School User</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-400">Loading users...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full text-left border-collapse border border-neutral-700">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 border border-neutral-700">#</th>
                <th className="py-3 px-4 border border-neutral-700">Name</th>
                <th className="py-3 px-4 border border-neutral-700">Email</th>
                <th className="py-3 px-4 border border-neutral-700">Role</th>
                <th className="py-3 px-4 border border-neutral-700">School</th>
                <th className="py-3 px-4 border border-neutral-700">Phone</th>
                <th className="py-3 px-4 border border-neutral-700">City</th>
                <th className="py-3 px-4 border border-neutral-700">State</th>
                <th className="py-3 px-4 border border-neutral-700">Country</th>
                <th className="py-3 px-4 border border-neutral-700">Status</th>
                <th className="py-3 px-4 border border-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-neutral-900 divide-y divide-neutral-800">
              {users.length > 0 ? (
                users.map((user, index) => {
                  let role = "User";
                  if (user.is_schoolStudent) role = "Student";
                  else if (user.schoolId) role = "School User";

                  return (
                    <tr
                      key={user._id || index}
                      className="hover:bg-neutral-800 transition"
                    >
                      <td className="py-3 px-4">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="py-3 px-4">{user.name || "-"}</td>
                      <td className="py-3 px-4">{user.email || "-"}</td>
                      <td className="py-3 px-4 capitalize">{role}</td>
                      <td className="py-3 px-4">{user.schoolId?.name || "-"}</td>
                      <td className="py-3 px-4">{user.phone || "-"}</td>
                      <td className="py-3 px-4">{user.city || "-"}</td>
                      <td className="py-3 px-4">{user.state || "-"}</td>
                      <td className="py-3 px-4">{user.country || "-"}</td>
                      <td className="py-3 px-4">
                        <span className="text-green-400">Active</span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteClick(user._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-4 text-gray-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Confirm Popup */}
      <ConfirmPopup
        isOpen={confirmOpen}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ViewUsers;
