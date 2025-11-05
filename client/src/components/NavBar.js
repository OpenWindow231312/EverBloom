import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ShoppingBag, Menu, X, Search } from "lucide-react";
import "./NavBar.css";
import PrimaryLogo from "../assets/PrimaryLogo.svg";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-left">
        <Link to="/">
          <img src={PrimaryLogo} alt="Logo" className="navbar-logo" />
        </Link>
      </div>

      {/* Hamburger for Mobile */}
      <button className="menu-toggle1" onClick={handleMenuToggle}>
        {menuOpen ? <X /> : <Menu />}
      </button>

      {/* Navbar Center: Links + Search + Icons */}
      <div className={`navbar-center ${menuOpen ? "active" : ""}`}>
        {/* Links */}
        <div className="navbar-links">
          <Link
            to="/shop"
            className="navbar-link"
            onClick={() => setMenuOpen(false)}
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="navbar-link"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="navbar-link"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/dashboard"
            className="navbar-link"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
        </div>

        {/* Search Bar (same style as mobile) */}
        <div className="nav-search">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="nav-icons mobile-icons">
          <button className="icon-button" onClick={() => navigate("/account")}>
            <User />
          </button>
          <button className="icon-button" onClick={() => navigate("/cart")}>
            <ShoppingBag />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
