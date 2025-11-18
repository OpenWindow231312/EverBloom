import React, { useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import "./Rewards.css"; // Importing the CSS file for Rewards page styling

const Rewards = () => {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setShowPopup(true);
      setEmail("");
      // Auto-hide popup after 4 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 4000);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="rewards-hero">
        <div className="rewards-hero-overlay">
          <h1 className="rewards-hero-heading">Florist Rewards Program</h1>
          <p className="rewards-hero-subheading">
            Exclusive benefits for professional florists
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="rewards-content">
        <div className="rewards-container">
          {/* Introduction */}
          <div className="rewards-intro">
            <h2 className="section-title-rewards">Welcome to EverBloom's Florist Rewards</h2>
            <p className="intro-text">
              Join our exclusive florist community and unlock premium benefits designed 
              specifically for professional florists. From exceptional discounts to 
              priority access to our finest blooms, we're here to support your business 
              and help you create unforgettable floral experiences for your clients.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="benefits-section">
            <h2 className="section-title-rewards">Program Benefits</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon-circle">
                  <span className="benefit-icon">💰</span>
                </div>
                <h3 className="benefit-title">Automatic 10% Discount</h3>
                <p className="benefit-description">
                  Enjoy an automatic 10% discount on every purchase. Your discount 
                  is applied instantly at checkout, making it easier to manage your 
                  business costs while accessing premium quality blooms.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon-circle">
                  <span className="benefit-icon">🌸</span>
                </div>
                <h3 className="benefit-title">Exclusive Flash Sales</h3>
                <p className="benefit-description">
                  Get first access to our exclusive flash sales with discounts of up to 
                  50% off on premium stock. Be the first to know about seasonal blooms, 
                  rare varieties, and bulk purchase opportunities.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon-circle">
                  <span className="benefit-icon">📧</span>
                </div>
                <h3 className="benefit-title">Priority Mailing List</h3>
                <p className="benefit-description">
                  Stay ahead of the curve with our exclusive florist newsletter. Receive 
                  weekly updates on new arrivals, stock availability, special offers, and 
                  seasonal trends before anyone else.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon-circle">
                  <span className="benefit-icon">✨</span>
                </div>
                <h3 className="benefit-title">Premium Support</h3>
                <p className="benefit-description">
                  Access dedicated customer support tailored for professional florists. 
                  Get expert advice on flower care, arrangement tips, and personalized 
                  recommendations for your specific needs.
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
                  Sign up with your professional florist email address to join our 
                  exclusive program.
                </p>
              </div>
              <div className="step-arrow">→</div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h4 className="step-title">Get Verified</h4>
                <p className="step-description">
                  We'll send you a confirmation email with all the details to verify 
                  your florist status.
                </p>
              </div>
              <div className="step-arrow">→</div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h4 className="step-title">Start Saving</h4>
                <p className="step-description">
                  Begin enjoying your exclusive discounts and benefits immediately!
                </p>
              </div>
            </div>
          </div>

          {/* Signup Form */}
          <div className="signup-section">
            <div className="signup-card">
              <h2 className="signup-title">Ready to Join?</h2>
              <p className="signup-subtitle">
                Sign up now and start receiving exclusive florist rewards and special offers!
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
                  <button type="submit" className="signup-button">
                    Join Now
                  </button>
                </div>
              </form>
              <p className="signup-note">
                By signing up, you'll receive exclusive updates and offers tailored 
                for professional florists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon">🎉</div>
            <h3 className="popup-title">Congratulations!</h3>
            <p className="popup-message">
              Thank you for joining our Florist Rewards Program! 
              Please check your email for more information and exclusive offers.
            </p>
            <button className="popup-close" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Rewards;
