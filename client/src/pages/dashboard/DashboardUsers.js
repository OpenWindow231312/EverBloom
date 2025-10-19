import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/dashboard/_core.css";
import "../../styles/dashboard/dashboardUsers.css";

export default function DashboardUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([
    "Admin",
    "Employee",
    "Florist",
    "Customer",
  ]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===========================
  // 🧭 Fetch Users
  // ===========================
  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data || []);
      } catch (err) {
        console.error("❌ Error loading users:", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // ===========================
  // ✏️ Change Role
  // ===========================
  const updateRole = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}`, { role: newRole });
      const refreshed = await api.get("/users");
      setUsers(refreshed.data || []);
      alert("✅ Role updated!");
    } catch (err) {
      console.error("❌ Error updating role:", err);
      alert("Failed to update role.");
    }
  };

  // ===========================
  // 📴 Activate / Deactivate
  // ===========================
  const toggleActive = async (userId, active) => {
    try {
      await api.put(`/users/${userId}`, { active: !active });
      const refreshed = await api.get("/users");
      setUsers(refreshed.data || []);
    } catch (err) {
      console.error("❌ Error toggling user:", err);
    }
  };

  // ===========================
  // 🗑 Delete User
  // ===========================
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter((u) => u.user_id !== userId));
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  // ===========================
  // 🧾 Helpers
  // ===========================
  const filteredUsers =
    filter === "All"
      ? users
      : users.filter((u) => u.Role?.role_name === filter);

  const RoleBadge = ({ role }) => {
    const map = {
      Admin: "role-admin",
      Employee: "role-employee",
      Florist: "role-florist",
      Customer: "role-customer",
    };
    const className = map[role] || "role-generic";
    return <span className={`status-dropdown ${className}`}>{role}</span>;
  };

  // ===========================
  // 🧭 Render
  // ===========================
  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-stock">
      <h2 className="overview-heading">👩‍🌾 User Management</h2>

      {/* ============================ */}
      {/* Filter Controls */}
      {/* ============================ */}
      <div className="dashboard-section">
        <label htmlFor="role-filter" style={{ marginRight: "10px" }}>
          Filter by Role:
        </label>
        <select
          id="role-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* ============================ */}
      {/* Users Table */}
      {/* ============================ */}
      <section className="dashboard-section">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.name || "—"}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    className="status-dropdown"
                    value={u.Role?.role_name || "Customer"}
                    onChange={(e) => updateRole(u.user_id, e.target.value)}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className={
                      u.active ? "toggle-btn deactivate" : "toggle-btn activate"
                    }
                    onClick={() => toggleActive(u.user_id, u.active)}
                  >
                    {u.active ? "Deactivate" : "Activate"}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => deleteUser(u.user_id)}
                    className="delete-btn"
                  >
                    🗑 Delete
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
