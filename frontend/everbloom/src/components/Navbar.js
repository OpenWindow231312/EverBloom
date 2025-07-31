// src/components/Navbar.js

import React from "react";
import { Link } from "react-router-dom"; // Only if using react-router

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>EverBloom</h2>
      <ul style={styles.navLinks}>
        <li>
          <Link to="/" style={styles.link}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/plants" style={styles.link}>
            Plants
          </Link>
        </li>
        <li>
          <Link to="/about" style={styles.link}>
            About
          </Link>
        </li>
        <li>
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#4CAF50",
    padding: "0.5rem 2rem",
  },
  logo: {
    color: "#fff",
    margin: 0,
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "1.2rem",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Navbar;
