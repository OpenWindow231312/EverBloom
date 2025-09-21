import React from "react";
import { Link } from "react-router-dom";
import "./Login.css"; // Assuming you will style it in a CSS file
import FlowerField1 from "../assets/FlowerField1.jpeg";

function Login() {
  return (
    <div className="login-page">
      {/* Left Side: Login Form */}
      <div className="login-container">
        <h1 className="login-heading">Welcome Back!</h1>
        <p className="login-subheading">
          Enter your Credentials to access your account
        </p>
        <form className="login-form">
          <input
            type="email"
            placeholder="Email Address"
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
          />
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>
          <button type="submit" className="login-button">
            Log in
          </button>
        </form>
        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Right Side: Image */}
      <div className="login-image">
        <img src={FlowerField1} alt="Flower Field" />
      </div>
    </div>
  );
}

export default Login;
