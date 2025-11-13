// ========================================
// 🌸 EverBloom — Dashboard Layout (Responsive + Render Safe Final Version)
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

  // ✅ Environment detection (same logic as everywhere else)
  const isLocal = window.location.hostname.includes("localhost");
  const API_URL = isLocal
    ? "http://localhost:5001"
    : "https://everbloom.onrender.com"; // ✅ Render live backend root

  // 🧭 Fetch current logged-in user
  useEffect(() => {
    const loadUser = async () => {
      const user = await fetchCurrentUser(); // ✅ no param needed now
      if (!user) {
        navigate("/login");
      } else {
        setCurrentUser(user);
      }
    };
    loadUser();
  }, [navigate]);

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
                  {currentUser.profilePhoto ? (
                    <img
                      src={`${API_URL}${currentUser.profilePhoto}`}
                      alt={currentUser.fullName}
                    />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {currentUser.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div style={{ textAlign: "right" }}>
                    <strong>{currentUser.fullName}</strong>
                    <br />
                    <small>
                      {currentUser.Roles?.[0]?.roleName ||
                        currentUser.roles?.[0] ||
                        "User"}
                    </small>
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
