import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { fetchCurrentUser, logoutUser } from "../../utils/auth";
import "../../styles/dashboard/_core.css";
import "../../styles/dashboard/dashboardLayout.css";

export default function DashboardLayout() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const API_URL =
    import.meta.env?.VITE_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5001";

  // 🧭 Fetch current logged-in user on mount
  useEffect(() => {
    const loadUser = async () => {
      const user = await fetchCurrentUser(API_URL);
      if (!user) {
        // Not logged in — redirect to login
        navigate("/login");
      } else {
        setCurrentUser(user);
      }
    };
    loadUser();
  }, [API_URL, navigate]);

  return (
    <div className="dashboard">
      {/* ============================
          🌸 Sidebar
      ============================ */}
      <aside className="dashboard-sidebar">
        <h2 className="dashboard-logo">EverBloom</h2>

        <nav className="dashboard-nav">
          <NavLink to="/dashboard" end>
            Overview
          </NavLink>
          <NavLink to="/dashboard/stock">Stock</NavLink>
          <NavLink to="/dashboard/orders">Orders</NavLink>
          <NavLink to="/dashboard/inventory">Inventory</NavLink>
          <NavLink to="/dashboard/users">Users</NavLink>
        </nav>
      </aside>

      {/* ============================
          🌼 Main Section
      ============================ */}
      <div className="dashboard-main">
        {/* ---------- Topbar ---------- */}
        <header className="dashboard-topbar">
          <h2>Admin Panel</h2>

          <div className="dashboard-user">
            {currentUser ? (
              <>
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    currentUser.fullName
                  )}`}
                  alt={currentUser.fullName}
                />
                <div style={{ textAlign: "right" }}>
                  <strong>{currentUser.fullName}</strong>
                  <br />
                  <small>{currentUser.Roles?.[0]?.roleName || "User"}</small>
                </div>
                <button
                  onClick={logoutUser}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#d84e55",
                    cursor: "pointer",
                    fontWeight: "600",
                    marginLeft: "10px",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <span>Loading user...</span>
            )}
          </div>
        </header>

        {/* ---------- Dynamic Content ---------- */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
