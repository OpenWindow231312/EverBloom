// ========================================
// 🌸 EverBloom — Contact Page
// ========================================
import React, { useState } from "react";
import "./Contact.css";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import Footer from "../components/Footer";

export default function Contact() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);

    // reset form fields
    e.target.reset();

    // hide success message after 4 seconds
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <div className="contact-page">
      {/* ===== Hero Section ===== */}
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>
          We’d love to hear from you! Whether you’re planning a wedding,
          ordering flowers, or visiting the farm — let’s get in touch.
        </p>
      </section>

      {/* ===== Main Contact Section ===== */}
      <section className="contact-content">
        {/* ===== Contact Info ===== */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            Reach out to us using the form or find us at our farm location
            below.
          </p>

          <div className="info-group">
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <h4>Our Farm</h4>
                <p>Adene’s Farm Flowers, Pretoria, South Africa</p>
              </div>
            </div>

            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div>
                <h4>Email</h4>
                <p>hello@everbloomshop.co.za</p>
              </div>
            </div>

            <div className="info-item">
              <FaPhoneAlt className="info-icon" />
              <div>
                <h4>Phone</h4>
                <p>+27 82 123 4567</p>
              </div>
            </div>

            <div className="info-item">
              <FaClock className="info-icon" />
              <div>
                <h4>Hours</h4>
                <p>
                  Mon – Fri: 8:00 – 17:00
                  <br />
                  Sat: 9:00 – 14:00
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Contact Form ===== */}
        <div className="contact-form">
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <input type="text" placeholder="Subject" />
            </div>
            <div className="form-group">
              <textarea
                rows="5"
                placeholder="Your Message..."
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* ===== Google Map ===== */}
      <section className="map-section">
        <h2>Find Us Here</h2>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d459300.9603496046!2d27.66741046562501!3d-25.925741999999985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e95699a52fa08df%3A0x4f0a520a465210c4!2sAdene%E2%80%99s%20Farm%20Flowers%20Pretoria!5e0!3m2!1sen!2sza!4v1762385474151!5m2!1sen!2sza"
            allowFullScreen
            loading="lazy"
            title="EverBloom Location"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* ===== Success Modal ===== */}
      {showSuccess && (
        <div className="success-modal">
          <div className="success-box">
            <FaCheckCircle className="success-icon" />
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out — we’ll get back to you soon.</p>
          </div>
        </div>
      )}

      {/* ===== Footer ===== */}
      <Footer />
    </div>
  );
}
