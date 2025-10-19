import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaFilter } from "react-icons/fa";
import api from "../../api/api";
import "../../styles/dashboard/_core.css";
import "../../styles/dashboard/dashboardUsers.css";

export default function DashboardUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===========================
  // Fetch Users + Roles
  // ===========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          api.get("/dashboard/users"),
          api.get("/dashboard/roles"),
        ]);
        setUsers(usersRes.data || []);
        setRoles(rolesRes.data || []);
      } catch (err) {
        console.error("Error loading users:", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ===========================
  // Change Role
  // ===========================
  const updateRole = async (userId, roleId) => {
    try {
      await api.put(`/dashboard/users/${userId}/role`, { role_id: roleId });
      const refreshed = await api.get("/dashboard/users");
      setUsers(refreshed.data || []);
      alert("Role updated in database!");
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update role.");
    }
  };

  // ===========================
  // Activate / Deactivate User
  // ===========================
  const toggleActive = async (userId, isActive) => {
    try {
      await api.put(`/dashboard/users/${userId}/status`, {
        isActive: !isActive,
      });
      const refreshed = await api.get("/dashboard/users");
      setUsers(refreshed.data || []);
    } catch (err) {
      console.error("Error toggling user:", err);
    }
  };

  // ===========================
  // Delete User
  // ===========================
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/dashboard/users/${userId}`);
      setUsers(users.filter((u) => u.user_id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  // ===========================
  // Helpers
  // ===========================
  const filteredUsers =
    filter === "All" ? users : users.filter((u) => u.roleName === filter);

  // ===========================
  // Render
  // ===========================
  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-stock">
      <h2 className="overview-heading">User Management</h2>

      {/* Filter Controls */}
      <div className="dashboard-section filter-bar">
        <FaFilter className="filter-icon" />
        <label htmlFor="role-filter">Filter by Role:</label>
        <select
          id="role-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          {roles.map((r) => (
            <option key={r.role_id} value={r.roleName}>
              {r.roleName}
            </option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <section className="dashboard-section">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.phone || "—"}</td>

                {/* Role Dropdown Only */}
                <td>
                  <select
                    className="status-dropdown"
                    value={u.role_id || ""}
                    onChange={(e) =>
                      updateRole(u.user_id, parseInt(e.target.value))
                    }
                  >
                    {roles.map((r) => (
                      <option key={r.role_id} value={r.role_id}>
                        {r.roleName}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Active / Inactive */}
                <td>
                  <button
                    className={
                      u.isActive
                        ? "toggle-btn deactivate"
                        : "toggle-btn activate"
                    }
                    onClick={() => toggleActive(u.user_id, u.isActive)}
                  >
                    {u.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>

                {/* Delete Button */}
                <td>
                  <button
                    onClick={() => deleteUser(u.user_id)}
                    className="delete-btn"
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
