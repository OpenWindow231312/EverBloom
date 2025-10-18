import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import FlowerField1 from "../assets/FlowerField1.jpeg";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔧 Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🚀 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("🔍 Login response:", data);

      if (res.ok && data.token) {
        // ✅ Store token and user in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("✅ Logged in successfully:", data.user);

        // ⏩ Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError(
          data.error ||
            (data.errors && data.errors[0]?.msg) ||
            "Invalid email or password"
        );
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-heading">Welcome Back!</h1>
        <p className="login-subheading">
          Enter your credentials to access your account
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

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
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
