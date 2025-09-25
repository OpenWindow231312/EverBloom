import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import FlowerField1 from "../assets/FlowerField1.jpeg";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token to localStorage
        localStorage.setItem("token", data.token);
        navigate("/dashboard"); // redirect after login
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-heading">Welcome Back!</h1>
        <p className="login-subheading">
          Enter your Credentials to access your account
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="login-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="login-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>
          <button type="submit" className="login-button">
            Log in
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign Up
          </Link>
        </p>
      </div>

      <div className="login-image">
        <img src={FlowerField1} alt="Flower Field" />
      </div>
    </div>
  );
}

export default Login;
