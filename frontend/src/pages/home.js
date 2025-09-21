import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar"; // Importing the NavBar component
import Footer from "../components/Footer"; // ✅ Corrected import path
import "./Home.css";
import { Truck, Leaf, Award, Gem } from "lucide-react"; // ✅ Added icon imports

function Home() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([false, false, false]);

  const toggleFavorite = (index) => {
    const updatedFavorites = [...favorites];
    updatedFavorites[index] = !updatedFavorites[index];
    setFavorites(updatedFavorites);
  };

  return (
    <div>
      <NavBar /> {/* Adding the NavBar component at the top */}
      <div className="hero-banner">
        <img
          src={require("../assets/HeroImageNew.jpeg")}
          alt="Hero Banner"
          className="hero-image"
        />
        <div className="hero-content">
          <h1 className="hero-heading">Beautiful Blooms</h1>
          <h2 className="hero-subheading">Delivered Fresh</h2>
          <div className="hero-buttons">
            <button
              className="primary-button"
              onClick={() => navigate("/Shop")}
            >
              Shop Collection
            </button>
            <button
              className="secondary-button"
              onClick={() => navigate("/Rewards")}
            >
              Florist Rewards
            </button>
          </div>
        </div>
      </div>
      {/* Featured Flowers Section */}
      <div className="featured-flowers">
        <h4 className="featured-flowers-subtitle">bestsellers</h4>
        <h1 className="featured-flowers-title">Featured Flowers</h1>
        <p className="featured-flowers-description">
          Our most loved flower arrangements, perfect for any occasion
        </p>

        <div className="featured-flowers-cards">
          {/* Card 1 */}
          <div className="card">
            <div className="card-image-container">
              <img
                src={require("../assets/BouquetFeature3.jpeg")}
                alt="Rustic Green Bouquet"
                className="card-image"
              />
              <button
                className={`favorite-button ${favorites[0] ? "filled" : ""}`}
                onClick={() => toggleFavorite(0)}
              >
                ♥
              </button>
            </div>
            <p className="card-subheading">mixed</p>
            <h5 className="card-title">Rustic Green Bouquet</h5>
            <p className="card-price">R300.00</p>
            <button className="add-to-cart-button">add to cart</button>
          </div>

          {/* Card 2 */}
          <div className="card">
            <div className="card-image-container">
              <img
                src={require("../assets/BouquetFeature2.jpeg")}
                alt="Peony Bunch"
                className="card-image"
              />
              <button
                className={`favorite-button ${favorites[1] ? "filled" : ""}`}
                onClick={() => toggleFavorite(1)}
              >
                ♥
              </button>
            </div>
            <p className="card-subheading">peonies</p>
            <h5 className="card-title">Peony Bunch 10 stems</h5>
            <p className="card-price">R190.00</p>
            <button className="add-to-cart-button">add to cart</button>
          </div>

          {/* Card 3 */}
          <div className="card">
            <div className="card-image-container">
              <img
                src={require("../assets/BouquetFeature1.jpeg")}
                alt="You’re my sunshine Bouquet"
                className="card-image"
              />
              <button
                className={`favorite-button ${favorites[2] ? "filled" : ""}`}
                onClick={() => toggleFavorite(2)}
              >
                ♥
              </button>
            </div>
            <p className="card-subheading">mixed</p>
            <h5 className="card-title">You’re my sunshine Bouquet</h5>
            <p className="card-price">R320.00</p>
            <button className="add-to-cart-button">add to cart</button>
          </div>
        </div>

        {/* View All Products Button */}
        <button
          className="view-all-products-button"
          onClick={() => navigate("/Shop")}
        >
          View All Products <span className="arrow">→</span>
        </button>
      </div>
      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <h4 className="why-choose-us-title">Why Choose Us</h4>
          <h1 className="why-choose-us-heading">The EverBloom Promise</h1>

          <div className="reasons-carousel">
            {/* Reason 1 */}
            <div className="reason reason1">
              <div className="icon-container">
                <Truck className="icon" />
              </div>
              <h5 className="reason-title">Same Day Delivery</h5>
              <p className="reason-description">
                Fresh Flowers delivered within hours of your order and so much
                more!
              </p>
            </div>

            {/* Reason 2 */}
            <div className="reason reason2">
              <div className="icon-container">
                <Leaf className="icon" />
              </div>
              <h5 className="reason-title">Sustainably Grown</h5>
              <p className="reason-description">
                Eco-friendly farming practices for a better tomorrow.
              </p>
            </div>

            {/* Reason 3 */}
            <div className="reason reason3">
              <div className="icon-container">
                <Award className="icon" />
              </div>
              <h5 className="reason-title">Premium Quality</h5>
              <p className="reason-description">
                We guarantee that only the finest blooms make it to your
                bouquet.
              </p>
            </div>

            {/* Reason 4 */}
            <div className="reason reason4">
              <div className="icon-container">
                <Gem className="icon" />
              </div>
              <h5 className="reason-title">Farm to Florist Pricing</h5>
              <p className="reason-description">
                By eliminating the middle man, we promise to give you the best
                prices!
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer /> {/* ✅ Footer added at the bottom */}
    </div>
  );
}

export default Home;
