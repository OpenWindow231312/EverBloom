// ========================================
// 🌸 EverBloom — Signup Page
// ========================================
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Customer", // default role
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🪶 Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ✅ Register Account
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_URL =
        import.meta.env?.VITE_API_URL ||
        process.env.REACT_APP_API_URL ||
        "http://localhost:5001";

      const registerRes = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const registerData = await registerRes.json();

      if (registerRes.ok) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(registerData.error || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error("❌ Register error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* ❌ Close / Back to Home */}
      <button className="close-btn" onClick={() => navigate("/")}>
        <FaTimes />
      </button>

      <div className="signup-container">
        <h1 className="signup-heading">Get Started Now</h1>
        <p className="signup-subheading">
          Create your account to get started
        </p>

        {/* Registration Form */}
        <form className="signup-form" onSubmit={handleRegister}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="signup-input"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="signup-input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="signup-input"
              value={formData.password}
              onChange={handleChange}
              required
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

          {/* 🌸 Role selector */}
          <label className="role-label">Select your role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="signup-select"
          >
            <option value="Customer">Customer</option>
            <option value="Florist">Florist</option>
            <option value="Employee">Employee</option>
          </select>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <p className="signin-text">
          Have an account?{" "}
          <a href="/login" className="login-link">
            Sign In
          </a>
        </p>
      </div>

      <div className="signup-image">
        <img
          src={require("../assets/FlowerField2.jpeg")}
          alt="Signup Background"
        />
      </div>
    </div>
  );
}

export default Signup;
