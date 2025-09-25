import React, { useState } from "react";
import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Account created successfully! You can now log in.");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-heading">Get Started Now</h1>
        <p className="signup-subheading">Create your account to get started</p>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Name"
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
          <div className="terms-container">
            <input type="checkbox" id="terms" className="terms-checkbox" />
            <label htmlFor="terms" className="terms-text">
              I agree to the terms & policy
            </label>
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <p className="signin-text">
          Have an account?{" "}
          <a href="login" className="login-link">
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
