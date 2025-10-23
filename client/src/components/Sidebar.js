// ========================================
// 🌸 EverBloom — Collapsible Sidebar (with Icons + Home Button)
// ========================================
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Leaf,
  ShoppingCart,
  Boxes,
  Users,
} from "lucide-react";
import { FaHome } from "react-icons/fa";
import "../styles/sidebar.css";
import WhiteLogoDashboard from "../assets/WhiteLogoDashboard.svg";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false); // ✅ start collapsed
  }, []);

  return (
    <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      {/* 🌸 Top Section */}
      <div className="sidebar-header">
        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {isOpen && (
          <img
            src={WhiteLogoDashboard}
            alt="EverBloom Logo"
            className="sidebar-logo-img"
          />
        )}
      </div>

      {/* 🌿 Navigation */}
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" end className="nav-item">
          <LayoutDashboard className="nav-icon" />
          {isOpen && <span>Overview</span>}
        </NavLink>

        <NavLink to="/dashboard/stock" className="nav-item">
          <Package className="nav-icon" />
          {isOpen && <span>Stock</span>}
        </NavLink>

        <NavLink to="/dashboard/harvest" className="nav-item">
          <Leaf className="nav-icon" />
          {isOpen && <span>Harvests</span>}
        </NavLink>

        <NavLink to="/dashboard/orders" className="nav-item">
          <ShoppingCart className="nav-icon" />
          {isOpen && <span>Orders</span>}
        </NavLink>

        <NavLink to="/dashboard/inventory" className="nav-item">
          <Boxes className="nav-icon" />
          {isOpen && <span>Inventory</span>}
        </NavLink>

        <NavLink to="/dashboard/users" className="nav-item">
          <Users className="nav-icon" />
          {isOpen && <span>Users</span>}
        </NavLink>
      </nav>

      {/* 🌸 Footer — Home button only */}
      <div className="sidebar-footer">
        <NavLink to="/" className={`home-btn ${isOpen ? "expanded" : ""}`}>
          <FaHome className="home-icon" />
          {isOpen && <span>Home</span>}
        </NavLink>
      </div>
    </aside>
  );
}
