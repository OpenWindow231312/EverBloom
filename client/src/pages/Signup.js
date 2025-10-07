import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    florist: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setShowPopup(false);

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("🔍 Signup response:", data); // 👈 debug log

      if (res.ok) {
        setSuccess("Account created successfully!");
        if (formData.florist) {
          setShowPopup(true);
        }
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("❌ Signup error:", err); // 👈 debug log
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
            <input
              type="checkbox"
              id="florist"
              name="florist"
              checked={formData.florist}
              onChange={handleChange}
              className="terms-checkbox"
            />
            <label htmlFor="florist" className="terms-text">
              I am a florist
            </label>
          </div>

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

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h3>Almost there!</h3>
              <p>
                Please check your email to confirm your eligibility as a
                florist.
              </p>
              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}

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
