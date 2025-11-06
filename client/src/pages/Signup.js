// ========================================
// 🌸 EverBloom — Signup Page
// ========================================
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa"; // ✅ added
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
  const navigate = useNavigate();

  // 🪶 Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 🚀 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const API_URL =
        import.meta.env?.VITE_API_URL ||
        process.env.REACT_APP_API_URL ||
        "http://localhost:5001";

      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("🔍 Signup response:", data);

      if (res.ok) {
        setSuccess("Account created successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError("Server error. Please try again later.");
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
        <p className="signup-subheading">Create your account to get started</p>

        <form className="signup-form" onSubmit={handleSubmit}>
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

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="signup-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

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

          <button type="submit" className="signup-button">
            Sign Up
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
