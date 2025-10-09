import React, { useEffect, useState } from "react";
import axios from "axios";
import "../dashboard/Dashboard.css";

export default function DashboardUsers() {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    role_id: "",
  });

  // ✅ Fetch users & roles
  const loadUsers = async () => {
    try {
      const [userRes, roleRes] = await Promise.all([
        axios.get(`${API_URL}/api/dashboard/users`),
        axios.get(`${API_URL}/api/auth/roles`).catch(() => ({ data: [] })),
      ]);

      setUsers(userRes.data || []);
      setRoles(
        roleRes.data.length > 0
          ? roleRes.data
          : [
              { role_id: 1, roleName: "Admin" },
              { role_id: 2, roleName: "Employee" },
              { role_id: 3, roleName: "Florist" },
              { role_id: 4, roleName: "Customer" },
            ]
      );
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ Toggle active/inactive
  const toggleStatus = async (userId) => {
    try {
      await axios.put(`${API_URL}/api/dashboard/users/${userId}/status`);
      alert("✅ User status updated!");
      loadUsers();
    } catch (error) {
      console.error("Toggle status error:", error);
      alert("❌ Failed to update user status.");
    }
  };

  // ✅ Change user role
  const handleRoleChange = async (userId, roleId) => {
    try {
      await axios.put(`${API_URL}/api/dashboard/users/${userId}/role`, {
        role_id: roleId,
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === userId
            ? {
                ...u,
                Roles: [
                  {
                    roleName: roles.find((r) => r.role_id == roleId)?.roleName,
                  },
                ],
              }
            : u
        )
      );
    } catch (error) {
      console.error("Update role error:", error);
      alert("❌ Failed to update user role.");
    }
  };

  // ✅ Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        fullName: newUser.fullName,
        email: newUser.email,
        password: newUser.password,
      });

      alert("✅ User added successfully!");
      setNewUser({ fullName: "", email: "", password: "", role_id: "" });
      loadUsers();
    } catch (error) {
      console.error("Add user error:", error);
      alert("❌ Failed to add user.");
    }
  };

  // ✅ Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/api/auth/users/${userId}`);
      alert("🗑️ User deleted successfully!");
      loadUsers();
    } catch (error) {
      console.error("Delete user error:", error);
      alert("❌ Failed to delete user.");
    }
  };

  // ✅ Helper for color-coded roles
  const getRoleClass = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case "admin":
        return "role-admin";
      case "employee":
        return "role-employee";
      case "florist":
        return "role-florist";
      case "customer":
        return "role-customer";
      default:
        return "role-generic";
    }
  };

  if (loading) return <p className="loading">Loading users...</p>;

  return (
    <div className="dashboard-users">
      <h2 className="overview-heading">👥 User Management</h2>

      {/* ============================ */}
      {/* ADD NEW USER FORM */}
      {/* ============================ */}
      <section className="dashboard-section">
        <h3>Add New User</h3>
        <form className="dashboard-form" onSubmit={handleAddUser}>
          <input
            type="text"
            placeholder="Full Name"
            value={newUser.fullName}
            onChange={(e) =>
              setNewUser({ ...newUser, fullName: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
          />
          <select
            value={newUser.role_id}
            onChange={(e) =>
              setNewUser({ ...newUser, role_id: e.target.value })
            }
            required
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.role_id} value={r.role_id}>
                {r.roleName}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary">
            ➕ Add User
          </button>
        </form>
      </section>

      <hr />

      {/* ============================ */}
      {/* USERS TABLE */}
      {/* ============================ */}
      <section className="dashboard-section">
        <h3>All Users</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => {
                const currentRole =
                  user.Roles && user.Roles.length > 0
                    ? user.Roles[0].roleName
                    : "No Role";
                return (
                  <tr key={user.user_id}>
                    <td>{user.user_id}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>
                      <div
                        className={`status-dropdown-wrapper ${getRoleClass(
                          currentRole
                        )}`}
                      >
                        <select
                          onChange={(e) =>
                            handleRoleChange(user.user_id, e.target.value)
                          }
                          className={`status-dropdown ${getRoleClass(
                            currentRole
                          )}`}
                          value={
                            roles.find(
                              (r) =>
                                r.roleName.toLowerCase() ===
                                currentRole.toLowerCase()
                            )?.role_id || ""
                          }
                        >
                          {roles.map((r) => (
                            <option key={r.role_id} value={r.role_id}>
                              {r.roleName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>
                      {user.isActive ? (
                        <span className="status-active">Active</span>
                      ) : (
                        <span className="status-inactive">Inactive</span>
                      )}
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
                      <button
                        onClick={() => handleDeleteUser(user.user_id)}
                        className="delete-btn"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
