import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, ShoppingBag } from "lucide-react";
import "./NavBar.css";
import PrimaryLogo from "../assets/PrimaryLogo.svg";

function NavBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Make the logo clickable and navigate to Home */}
        <Link to="/">
          <img src={PrimaryLogo} alt="Logo" className="navbar-logo" />
        </Link>
      </div>
      <div className="navbar-center">
        <Link to="/shop" className="navbar-link">
          Shop
        </Link>
        <Link to="/about" className="navbar-link">
          About
        </Link>
        <Link to="/contact" className="navbar-link">
          Contact
        </Link>
        {/* New Rewards Link */}
        <Link to="/rewards" className="navbar-link">
          Rewards
        </Link>
        <Link to="/dashboard" className="navbar-link">
          Dashboard
        </Link>
      </div>
      <div className="navbar-right">
        <button className="icon-button" onClick={handleSearchToggle}>
          <Search />
        </button>
        <button className="icon-button" onClick={() => navigate("/account")}>
          <User />
        </button>
        <button className="icon-button" onClick={() => navigate("/cart")}>
          <ShoppingBag />
        </button>
      </div>
      {searchOpen && (
        <div className="search-bar">
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
      )}
    </nav>
  );
}

export default NavBar;
