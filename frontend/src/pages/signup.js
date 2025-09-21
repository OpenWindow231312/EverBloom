import React from "react";
import "./Signup.css";

function Signup() {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-heading">Get Started Now</h1>
        <p className="signup-subheading">Create your account to get started</p>
        <form className="signup-form">
          <input
            type="text"
            placeholder="Name"
            className="signup-input"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="signup-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="signup-input"
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
