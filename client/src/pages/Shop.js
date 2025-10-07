import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import "./Shop.css"; // Importing the CSS file for Shop page styling

const Shop = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Shop Page Content */}
      <section className="shop-section">
        <div className="container">
          <h1 className="shop-heading">Shop Our Collection</h1>
          <p className="shop-description">
            Explore our wide range of products and find the perfect items for
            you. Browse through our collection and enjoy a seamless shopping
            experience.
          </p>
          {/* Add your product listings or shop functionality here */}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Shop;
