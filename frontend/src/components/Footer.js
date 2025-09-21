import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react"; // Social media icons
import "./Footer.css";
import SecondaryLogo from "../assets/SecondaryLogo.svg"; // Assuming the logo is in the same directory

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo Section */}
        <div className="footer-logo">
          <img
            src={SecondaryLogo}
            alt="EverBloom Logo"
            className="footer-logo-img"
          />
        </div>

        {/* Navigation Links */}
        <div className="footer-links">
          <a href="/home" className="footer-link">
            Home
          </a>
          <a href="/about" className="footer-link">
            About
          </a>
          <a href="/shop" className="footer-link">
            Shop
          </a>
          <a href="/contact" className="footer-link">
            Contact
          </a>
        </div>

        {/* Social Media Icons */}
        <div className="footer-social">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <Facebook />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <Twitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <Instagram />
          </a>
        </div>
      </div>

      {/* Footer Bottom Text */}
      <div className="footer-bottom">
        <p>2025 EverBloom Flower Retailer. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
