// ========================================
// 🌸 EverBloom — Dashboard Layout (Responsive + Full-Width Topbar)
// ========================================
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { fetchCurrentUser, logoutUser } from "../../utils/auth";
import Sidebar from "../../components/Sidebar";
import "../../styles/dashboard/_core.css";
import "../../styles/dashboard/dashboardLayout.css";

export default function DashboardLayout() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const API_URL =
    import.meta.env?.VITE_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5001";

  // 🧭 Fetch current logged-in user
  useEffect(() => {
    const loadUser = async () => {
      const user = await fetchCurrentUser(API_URL);
      if (!user) {
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
          🌸 Sidebar Component
      ============================ */}
      <Sidebar />

      {/* ============================
          🌼 Main Section
      ============================ */}
      <div className="dashboard-main">
        {/* ---------- Topbar ---------- */}
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-content">
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
                    className="logout-btn"
                    onClick={logoutUser}
                    title="Logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <span>Loading user...</span>
              )}
            </div>
          </div>
        </header>

        {/* ---------- Dynamic Page Content ---------- */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
