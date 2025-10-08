import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./Dashboard.css";

export default function DashboardLayout() {
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
            <img src="https://i.pravatar.cc/36" alt="Admin avatar" />
            <span>Admin</span>
          </div>
        </header>

        {/* ---------- Dynamic Content ---------- */}
        <main className="dashboard-content">
          {/* Outlet dynamically renders pages like Overview, Stock, Orders */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
