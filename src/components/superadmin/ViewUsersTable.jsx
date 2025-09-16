import React from "react";

const ViewUsersTable = ({ users }) => {
  if (!users || users.length === 0) {
    return <p className="text-center text-gray-400">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="w-full text-left border-collapse">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4">#</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="bg-neutral-900 divide-y divide-neutral-800">
          {users.map((user, index) => (
            <tr
              key={user._id || index}
              className="hover:bg-neutral-800 transition"
            >
              <td className="py-3 px-4">{index + 1}</td>
              <td className="py-3 px-4">{user.name}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4 capitalize">{user.role}</td>
              <td className="py-3 px-4">
                {user.active ? (
                  <span className="text-green-400">Active</span>
                ) : (
                  <span className="text-red-400">Inactive</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewUsersTable;
