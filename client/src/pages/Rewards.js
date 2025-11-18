import React, { useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import "./Rewards.css";

// React Icons
import { FaPercent, FaBolt, FaEnvelopeOpenText, FaStar } from "react-icons/fa";

const Rewards = () => {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setShowPopup(true);
      setEmail("");

      setTimeout(() => {
        setShowPopup(false);
      }, 4000);
    }
  };

  return (
    <div>
      <Navbar />

      <section className="rewards-hero">
        <div className="rewards-hero-overlay">
          <h1 className="rewards-hero-heading">Florist Rewards Program</h1>
          <p className="rewards-hero-subheading">
            Exclusive benefits for professional florists
          </p>
        </div>
      </section>

      <section className="rewards-content">
        <div className="rewards-container">
          <div className="rewards-intro">
            <h2 className="section-title-rewards">
              Welcome to EverBloom's Florist Rewards
            </h2>
            <p className="intro-text">
              Join our exclusive florist community and unlock premium benefits
              designed specifically for professional florists. From exceptional
              discounts to priority access to our finest blooms, we're here to
              support your business.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="benefits-section">
            <h2 className="section-title-rewards">Program Benefits</h2>

            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon-circle">
                  <FaPercent className="benefit-icon" />
                </div>
                <h3 className="benefit-title">Automatic 10% Discount</h3>
                <p className="benefit-description">
                  Enjoy an automatic 10% discount on every purchase—instantly
                  applied at checkout.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon-circle">
                  <FaBolt className="benefit-icon" />
                </div>
                <h3 className="benefit-title">Exclusive Flash Sales</h3>
                <p className="benefit-description">
                  Get first access to rare varieties, seasonal blooms, and bulk
                  deals with up to 50% off.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon-circle">
                  <FaEnvelopeOpenText className="benefit-icon" />
                </div>
                <h3 className="benefit-title">Priority Mailing List</h3>
                <p className="benefit-description">
                  Receive weekly updates on new arrivals, specials, and trending
                  flowers.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon-circle">
                  <FaStar className="benefit-icon" />
                </div>
                <h3 className="benefit-title">Premium Support</h3>
                <p className="benefit-description">
                  Get expert support tailored to florists—care tips,
                  recommendations, and guidance.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="how-it-works-section">
            <h2 className="section-title-rewards">How It Works</h2>
            <div className="steps-container">
              <div className="step-card">
                <div className="step-number">1</div>
                <h4 className="step-title">Register Your Email</h4>
                <p className="step-description">
                  Sign up with your florist business email.
                </p>
              </div>

              <div className="step-arrow">→</div>

              <div className="step-card">
                <div className="step-number">2</div>
                <h4 className="step-title">Get Verified</h4>
                <p className="step-description">
                  Check your email for a verification message.
                </p>
              </div>

              <div className="step-arrow">→</div>

              <div className="step-card">
                <div className="step-number">3</div>
                <h4 className="step-title">Start Saving</h4>
                <p className="step-description">
                  Instant discounts and benefits are activated!
                </p>
              </div>
            </div>
          </div>

          {/* Signup */}
          <div className="signup-section">
            <div className="signup-card">
              <h2 className="signup-title">Ready to Join?</h2>
              <p className="signup-subtitle">
                Sign up now and start receiving exclusive florist rewards!
              </p>

              <form className="signup-form" onSubmit={handleEmailSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className="email-input"
                    placeholder="Enter your professional email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="signup-buttonnew">
                    Join Now
                  </button>
                </div>
              </form>

              <p className="signup-note">
                You'll receive exclusive updates and offers tailored for
                florists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon">🎉</div>
            <h3 className="popup-title">Congratulations!</h3>
            <p className="popup-message">
              Thank you for joining our Florist Rewards Program! Please check
              your email.
            </p>
            <button className="popup-close" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Rewards;
