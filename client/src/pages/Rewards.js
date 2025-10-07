import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import "./Rewards.css"; // Importing the CSS file for Rewards page styling

const Rewards = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Rewards Page Content */}
      <section className="rewards-section">
        <div className="container">
          <h1 className="rewards-heading">Rewards Program</h1>
          <p className="rewards-description">
            Join our rewards program and earn points for every purchase! Redeem
            your points for exclusive discounts and special offers.
          </p>
          {/* Add your rewards program details or functionality here */}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Rewards;
