// ========================================
// 🌸 EverBloom — Signup Page with OTP Verification
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
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: form, 2: OTP verification, 3: complete
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

  // 📧 Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_URL =
        import.meta.env?.VITE_API_URL ||
        process.env.REACT_APP_API_URL ||
        "http://localhost:5001";

      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Verification code sent to your email!");
        setStep(2);
      } else {
        setError(data.error || "Failed to send verification code");
      }
    } catch (err) {
      console.error("❌ Send OTP error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP and Register
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_URL =
        import.meta.env?.VITE_API_URL ||
        process.env.REACT_APP_API_URL ||
        "http://localhost:5001";

      // First verify OTP
      const verifyRes = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: otp,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.verified) {
        setError(verifyData.error || "Invalid verification code");
        setLoading(false);
        return;
      }

      // OTP verified, now register
      const registerRes = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const registerData = await registerRes.json();

      if (registerRes.ok) {
        setSuccess("Account created successfully!");
        setStep(3);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(registerData.error || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error("❌ Verify/Register error:", err);
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
          {step === 1 && "Create your account to get started"}
          {step === 2 && "Enter the verification code sent to your email"}
          {step === 3 && "Registration complete!"}
        </p>

        {/* Step 1: Registration Form */}
        {step === 1 && (
          <form className="signup-form" onSubmit={handleSendOTP}>
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
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form className="signup-form" onSubmit={handleVerifyAndRegister}>
            <p className="otp-message">
              We've sent a 6-digit code to <strong>{formData.email}</strong>
            </p>

            <input
              type="text"
              placeholder="Enter 6-digit code"
              className="signup-input otp-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength="6"
              required
              autoFocus
            />

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <button
              type="button"
              className="resend-btn"
              onClick={handleSendOTP}
              disabled={loading}
            >
              Resend Code
            </button>

            <button
              type="button"
              className="back-btn"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
              }}
            >
              Back to Form
            </button>
          </form>
        )}

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        {step === 1 && (
          <p className="signin-text">
            Have an account?{" "}
            <a href="/login" className="login-link">
              Sign In
            </a>
          </p>
        )}
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
