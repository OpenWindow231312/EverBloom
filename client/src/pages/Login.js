import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import FlowerField1 from "../assets/FlowerField1.jpeg";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_URL =
        import.meta.env?.VITE_API_URL ||
        process.env.REACT_APP_API_URL ||
        "http://localhost:5001";

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("❌ Non-JSON response:", text.slice(0, 200));
        throw new Error("Invalid response from server");
      }

      console.log("🔍 Login response:", data);

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // 💐 Save florist discount if exists
        if (data.user.discount) {
          localStorage.setItem("discount", data.user.discount);
        }

        console.log("✅ Logged in successfully:", data.user);

        const roles = data.user.roles || [];
        if (roles.includes("Admin") || roles.includes("Employee")) {
          navigate("/dashboard");
        } else {
          navigate("/shop");
        }
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
      {/* ❌ Close / Back to Home */}
      <button className="close-btn" onClick={() => navigate("/")}>
        <FaTimes />
      </button>

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
            autoComplete="email"
          />
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="login-input"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

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
