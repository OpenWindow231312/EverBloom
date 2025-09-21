import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import "./About.css"; // Assuming you have a CSS file for About page styling

const About = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* About Page Content */}
      <section className="about-section">
        <div className="container">
          <h1 className="about-heading">About EverBloom</h1>
          <p className="about-description">
            At EverBloom, we believe in spreading joy through the beauty of
            flowers. Our mission is to provide sustainably grown,
            premium-quality blooms that brighten your day and make every
            occasion special. With a commitment to eco-friendly practices and
            exceptional customer service, we ensure that every bouquet is
            crafted with love and care.
          </p>
          <p className="about-description">
            From same-day delivery to farm-to-florist pricing, we strive to make
            fresh flowers accessible to everyone. Thank you for choosing
            EverBloom as your trusted flower retailer.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
