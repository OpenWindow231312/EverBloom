import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import "./Contact.css"; // Importing the CSS file for Contact page styling

const Contact = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Contact Page Content */}
      <section className="contact-section">
        <div className="container">
          <h1 className="contact-heading">Contact Us</h1>
          <p className="contact-description">
            Have questions or need assistance? We're here to help! Reach out to
            us using the form below or via our contact details.
          </p>
          {/* Add your contact form or contact details here */}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
