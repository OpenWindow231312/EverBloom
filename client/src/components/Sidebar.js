// ========================================
// 🌸 EverBloom — Collapsible Sidebar (with White Dashboard Logo)
// ========================================
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "../styles/sidebar.css";
import WhiteLogoDashboard from "../assets/WhiteLogoDashboard.svg"; // ✅ Updated logo import

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Topbar */}
      <div className="mobile-topbar">
        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo">
          <img
            src={WhiteLogoDashboard}
            alt="EverBloom Logo"
            className="sidebar-logo-img"
          />
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end className="nav-item">
            <span>Overview</span>
          </NavLink>
          <NavLink to="/dashboard/stock" className="nav-item">
            <span>Stock</span>
          </NavLink>
          <NavLink to="/dashboard/harvest" className="nav-item">
            <span>Harvests</span>
          </NavLink>
          <NavLink to="/dashboard/orders" className="nav-item">
            <span>Orders</span>
          </NavLink>
          <NavLink to="/dashboard/inventory" className="nav-item">
            <span>Inventory</span>
          </NavLink>
          <NavLink to="/dashboard/users" className="nav-item">
            <span>Users</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
