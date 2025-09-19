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
  const [filters, setFilters] = useState({ name: "", email: "", schoolName: "" });


  const [debouncedFilters] = useDebounce(filters, 500);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // For editing
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

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
        console.log(res);
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

  // --- Edit handlers ---
  const handleEditClick = (user) => {
    setEditUser(user);
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        `/superAdmin/userEdit/${editUser._id}`,
        "PUT",
        editUser,
        { Authorization: `Bearer ${token}` }
      );
      toast.success("User updated successfully!");
      setEditOpen(false);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error editing user:", err.message);
      toast.error("Failed to update user");
    }
  };

  // --- Export to Excel ---
  const handleExport = async () => {
    try {
      const response = await fetch(`/superAdmin/exportUserList`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export users");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "UserList.xlsx"; // default file name
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Export successful!");
    } catch (err) {
      console.error("Export error:", err.message);
      toast.error("Failed to export users");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-10 px-6">
      <ToastContainer />
      <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-400">
        View Users
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleFilterChange}
          className="px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="email"
          placeholder="Search by email"
          value={filters.email}
          onChange={handleFilterChange}
          className="px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="schoolName"
          placeholder="Search by school"
          value={filters.schoolName}
          onChange={handleFilterChange}
          className="px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="p-[3px] relative cursor-pointer" onClick={handleExport}>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
            Export
          </div>
        </button>
      </div>



      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-neutral-800">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white">
              <tr>
                {[
                  "#",
                  "Name",
                  "Email",
                  "Role",
                  "School",
                  "mobileNumber",
                  "City",
                  "State",
                  "Country",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} className="py-3 px-4 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-neutral-900 divide-y divide-neutral-800">
              {users.length > 0 ? (
                users.map((user, index) => {
                  let role = "User";
                  if (user.is_schoolStudent) role = "Student";
                  else if (user.schoolId) role = "School User";

                  return (
                    <tr key={user._id || index} className="hover:bg-neutral-800 transition">
                      <td className="py-3 px-4">{(page - 1) * limit + index + 1}</td>
                      <td className="py-3 px-4">{user.name || "-"}</td>
                      <td className="py-3 px-4">{user.email || "-"}</td>
                      <td className="py-3 px-4 capitalize">{role}</td>
                      <td className="py-3 px-4">{user.schoolId?.name || "-"}</td>
                      <td className="py-3 px-4">{user.mobileNumber || "-"}</td>
                      <td className="py-3 px-4">{user.city || "-"}</td>
                      <td className="py-3 px-4">{user.state || "-"}</td>
                      <td className="py-3 px-4">{user.country || "-"}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-700 text-green-200">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="px-3 py-1 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 cursor-pointer py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow hover:opacity-90 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-lg font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 cursor-pointer py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow hover:opacity-90 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Confirm Delete Popup */}
      <ConfirmPopup
        isOpen={confirmOpen}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Edit User Popup */}
      {editOpen && editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-neutral-900 p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Edit User</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={editUser.name || ""}
                onChange={handleEditChange}
                placeholder="Name"
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 text-white"
              />
              <input
                type="email"
                name="email"
                value={editUser.email || ""}
                onChange={handleEditChange}
                placeholder="Email"
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 text-white"
              />
              <input
                type="text"
                name="mobileNumber"
                value={editUser.mobileNumber || ""}
                onChange={handleEditChange}
                placeholder="Mobile Number"
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 text-white"
              />
              <input
                type="text"
                name="city"
                value={editUser.city || ""}
                onChange={handleEditChange}
                placeholder="City"
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 text-white"
              />
              <input
                type="text"
                name="state"
                value={editUser.state || ""}
                onChange={handleEditChange}
                placeholder="State"
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 text-white"
              />
              <input
                type="text"
                name="country"
                value={editUser.country || ""}
                onChange={handleEditChange}
                placeholder="Country"
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 text-white"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
