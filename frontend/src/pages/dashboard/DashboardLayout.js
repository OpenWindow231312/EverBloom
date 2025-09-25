import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "../Dashboard.css";

function DashboardLayout() {
  const location = useLocation();

  // Map route paths to page titles
  const pageTitles = {
    "/dashboard": "Overview",
    "/dashboard/stock": "Stock Management",
    "/dashboard/orders": "Orders",
    "/dashboard/inventory": "Inventory",
  };

  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">EverBloom</div>
        <nav className="dashboard-nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Overview
          </NavLink>
          <NavLink
            to="/dashboard/stock"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Stock
          </NavLink>
          <NavLink
            to="/dashboard/orders"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Orders
          </NavLink>
          <NavLink
            to="/dashboard/inventory"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Inventory
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <h2>{pageTitle}</h2>
          <div className="dashboard-user">
            <img
              src="https://ui-avatars.com/api/?name=Admin"
              alt="User Avatar"
            />
            <span>Admin</span>
          </div>
        </header>

        {/* Content Area */}
        <section className="dashboard-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;
