import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "../../api/api";
import "../dashboard/Dashboard.css";

export default function DashboardUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch users
  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ Toggle user active/inactive
  const toggleStatus = async (userId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/dashboard/users/${userId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        alert("✅ User status updated");
        loadUsers();
      } else {
        alert("❌ Failed to update user status");
      }
    } catch (error) {
      console.error("Toggle status error:", error);
    }
  };

  // ✅ Change user role
  const handleRoleChange = async (userId, roleId) => {
    try {
      await updateUserRole(userId, roleId);
      alert("✅ User role updated");
      loadUsers();
    } catch (error) {
      console.error("Update role error:", error);
      alert("❌ Failed to update user role");
    }
  };

  if (loading) return <p className="loading">Loading users...</p>;

  return (
    <div className="dashboard-users">
      <h2>Users Management</h2>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
            <th>Change Role</th>
            <th>Toggle Status</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => {
              const userRole =
                user.Roles && user.Roles.length > 0
                  ? user.Roles[0].roleName
                  : "No Role";
              return (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{userRole}</td>
                  <td>{user.isActive ? "✅ Active" : "❌ Inactive"}</td>
                  <td>
                    <select
                      onChange={(e) =>
                        handleRoleChange(user.user_id, e.target.value)
                      }
                      defaultValue={userRole}
                      className="status-dropdown"
                    >
                      <option value="1">Admin</option>
                      <option value="2">Employee</option>
                      <option value="3">Florist</option>
                      <option value="4">Customer</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleStatus(user.user_id)}
                      className={`toggle-btn ${
                        user.isActive ? "deactivate" : "activate"
                      }`}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
