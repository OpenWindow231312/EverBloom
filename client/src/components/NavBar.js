// ========================================
// 🌸 EverBloom — NavBar (Updated with Profile Dropdown)
// ========================================
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ShoppingBag, Menu, X, Search, ChevronDown } from "lucide-react";
import "./NavBar.css";
import PrimaryLogo from "../assets/PrimaryLogo.svg";
import API from "../api/api"; // ✅ use your existing API instance
import { fetchCurrentUser } from "../utils/auth"; // ✅ your existing helper

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const navigate = useNavigate();
  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  // ✅ Load logged-in user
  useEffect(() => {
    const loadUser = async () => {
      const user = await fetchCurrentUser();
      if (user) setCurrentUser(user);
    };
    loadUser();
  }, []);

  // ✅ Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown]);

  // ✅ Handle Search
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 1) {
      try {
        const res = await API.get(`/shop/search?query=${query}`);
        setSearchResults(res.data);
        setShowResults(true);
      } catch (err) {
        console.error("Search error:", err);
      }
    } else {
      setShowResults(false);
    }
  };

  // ✅ Navigate to flower details or shop page
  const handleResultClick = (flowerId) => {
    navigate(`/shop/${flowerId}`);
    setSearchQuery("");
    setShowResults(false);
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/");
  };

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

          {/* ✅ Role-based Dashboard Link */}
          {currentUser &&
            (() => {
              const roles =
                currentUser.roles ||
                currentUser.Roles?.map((r) => r.roleName) ||
                [];

              const isAdminOrEmployee = roles.some((r) =>
                ["Admin", "Employee"].includes(r)
              );

              return (
                isAdminOrEmployee && (
                  <Link
                    to="/dashboard"
                    className="navbar-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )
              );
            })()}
        </div>

        {/* ✅ Search Bar */}
        <div className="nav-search">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search flowers or types..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
            />
          </div>

          {/* ✅ Dropdown Results */}
          {showResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((flower) => (
                <div
                  key={flower.flower_id}
                  className="search-result-item"
                  onClick={() => handleResultClick(flower.flower_id)}
                >
                  <img
                    src={flower.image_url}
                    alt={flower.variety}
                    className="search-thumb"
                  />
                  <span>
                    {flower.variety} ({flower.type})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Icons */}
        <div className="nav-icons mobile-icons">
          {currentUser ? (
            <div className="profile-dropdown-container">
              <button 
                className="profile-button" 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                {currentUser.profilePhoto ? (
                  <img 
                    src={currentUser.profilePhoto} 
                    alt={currentUser.fullName} 
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {currentUser.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <ChevronDown size={16} className="profile-chevron" />
              </button>
              
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <p className="profile-name">{currentUser.fullName}</p>
                    <p className="profile-email">{currentUser.email}</p>
                  </div>
                  <div className="profile-dropdown-divider"></div>
                  <Link 
                    to="/account" 
                    className="profile-dropdown-item"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    <User size={16} />
                    <span>Profile Settings</span>
                  </Link>
                  <div className="profile-dropdown-divider"></div>
                  <button 
                    className="profile-dropdown-item logout-item" 
                    onClick={() => {
                      handleLogout();
                      setShowProfileDropdown(false);
                    }}
                  >
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="icon-button" onClick={() => navigate("/login")}>
              <User />
            </button>
          )}
          <button className="icon-button" onClick={() => navigate("/cart")}>
            <ShoppingBag />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
