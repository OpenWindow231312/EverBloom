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
  Star,
} from "lucide-react";
import { FaHome } from "react-icons/fa";
import "../styles/sidebar.css";
import WhiteLogoDashboard from "../assets/WhiteLogoDashboard.svg";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsOpen(false); // ✅ start collapsed
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/dashboard/stock", label: "Stock", icon: Package },
    { to: "/dashboard/harvest", label: "Harvests", icon: Leaf },
    { to: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
    { to: "/dashboard/inventory", label: "Inventory", icon: Boxes },
    { to: "/dashboard/users", label: "Users", icon: Users },
    { to: "/dashboard/reviews", label: "Reviews", icon: Star },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      {isMobile && (
        <div className="mobile-dashboard-nav">
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <img
            src={WhiteLogoDashboard}
            alt="EverBloom Logo"
            className="mobile-nav-logo"
          />
        </div>
      )}

      {/* Sidebar/Dropdown Menu */}
      <aside className={`sidebar ${isOpen ? "open" : "collapsed"} ${isMobile ? "mobile" : ""}`}>
        {/* 🌸 Top Section - Desktop only */}
        {!isMobile && (
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
        )}

        {/* 🌿 Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="nav-item"
              onClick={handleNavClick}
            >
              <item.icon className="nav-icon" />
              {(isOpen || isMobile) && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* 🌸 Footer — Home button */}
        <div className="sidebar-footer">
          <NavLink to="/" className={`home-btn ${isOpen ? "expanded" : ""}`} onClick={handleNavClick}>
            <FaHome className="home-icon" />
            {(isOpen || isMobile) && <span>Home</span>}
          </NavLink>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
