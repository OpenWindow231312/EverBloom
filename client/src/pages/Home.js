// ========================================
// 🌸 EverBloom — Home Page (Featured Flowers Carousel + SEO)
// ========================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import API from "../api/api";
import "./Home.css";
import { Truck, Leaf, Award, Gem } from "lucide-react";
import { Helmet } from "react-helmet-async";

function Home() {
  const navigate = useNavigate();
  const [flowers, setFlowers] = useState([]);
  const [favourites, setFavourites] = useState(
    JSON.parse(localStorage.getItem("favourites")) || []
  );
  const [loading, setLoading] = useState(true);

  // 🌼 Fetch flowers
  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const res = await API.get("/shop");
        const data = res.data || [];
        // Filter featured (e.g. sale or first few)
        const featured = data
          .filter((f) => f.is_on_sale || f.price_per_stem < 25)
          .slice(0, 8);
        setFlowers(featured);
      } catch (err) {
        console.error("Error fetching featured flowers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlowers();
  }, []);

  // ❤️ Toggle favourite
  const toggleFavourite = (flower) => {
    let updated;
    const exists = favourites.find((f) => f.flower_id === flower.flower_id);
    if (exists) {
      updated = favourites.filter((f) => f.flower_id !== flower.flower_id);
    } else {
      updated = [...favourites, flower];
    }
    setFavourites(updated);
    localStorage.setItem("favourites", JSON.stringify(updated));
  };

  // 🛒 Add to cart
  const addToCart = (flower) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((item) => item.flower_id === flower.flower_id);
    let updatedCart;

    if (exists) {
      updatedCart = cart.map((item) =>
        item.flower_id === flower.flower_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...flower, quantity: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    console.log("🛒 Added to cart:", flower.variety);
  };

  return (
    <>
      {/* 🪷 SEO Meta Tags */}
      <Helmet>
        <title>EverBloom | Beautiful Blooms Delivered Fresh</title>
        <meta
          name="description"
          content="Shop EverBloom’s farm-fresh flowers — hand-picked, sustainable, and delivered across South Africa. Discover our bestsellers and new arrivals."
        />
        <meta
          name="keywords"
          content="EverBloom, flowers, bouquets, delivery, Pretoria, florist, South Africa"
        />
        <link rel="canonical" href="https://everbloomshop.co.za/" />
      </Helmet>

      <div>
        <NavBar />

        {/* 🌸 Hero Section */}
        <div className="hero-banner">
          <img
            src={require("../assets/HeroImageNew.jpeg")}
            alt="EverBloom hero banner"
            className="hero-image"
          />
          <div className="hero-content">
            <h1 className="hero-heading">Beautiful Blooms</h1>
            <h2 className="hero-subheading">Delivered Fresh</h2>
            <div className="hero-buttons">
              <button
                className="primary-button"
                onClick={() => navigate("/shop")}
              >
                Shop Collection
              </button>
              <button
                className="secondary-button"
                onClick={() => navigate("/rewards")}
              >
                Florist Rewards
              </button>
            </div>
          </div>
        </div>

        {/* 🌷 Featured Flowers */}
        <section className="featured-flowers">
          <h4 className="featured-flowers-subtitle">bestsellers</h4>
          <h1 className="featured-flowers-title">Featured Flowers</h1>
          <p className="featured-flowers-description">
            Our most loved blooms, freshly harvested from the EverBloom farm.
          </p>

          {!loading && flowers.length > 0 && (
            <div className="recommend-carousel">
              {flowers.map((flower) => (
                <ProductCard
                  key={flower.flower_id}
                  flower={flower}
                  isFavourite={favourites.some(
                    (f) => f.flower_id === flower.flower_id
                  )}
                  onToggleFavourite={() => toggleFavourite(flower)}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}

          <button
            className="view-all-products-button"
            onClick={() => navigate("/shop")}
          >
            View All Products <span className="arrow">→</span>
          </button>
        </section>

        {/* 🌻 Why Choose Us */}
        <section className="why-choose-us">
          <div className="container">
            <h4 className="why-choose-us-title">Why Choose Us</h4>
            <h1 className="why-choose-us-heading">The EverBloom Promise</h1>

            <div className="reasons-carousel">
              <div className="reason">
                <div className="icon-container">
                  <Truck className="icon" />
                </div>
                <h5 className="reason-title">Same Day Delivery</h5>
                <p className="reason-description">
                  Fresh flowers delivered within hours of your order.
                </p>
              </div>

              <div className="reason">
                <div className="icon-container">
                  <Leaf className="icon" />
                </div>
                <h5 className="reason-title">Sustainably Grown</h5>
                <p className="reason-description">
                  Eco-friendly practices for a greener tomorrow.
                </p>
              </div>

              <div className="reason">
                <div className="icon-container">
                  <Award className="icon" />
                </div>
                <h5 className="reason-title">Premium Quality</h5>
                <p className="reason-description">
                  Only the finest, farm-fresh blooms make it to your bouquet.
                </p>
              </div>

              <div className="reason">
                <div className="icon-container">
                  <Gem className="icon" />
                </div>
                <h5 className="reason-title">Farm to Florist Pricing</h5>
                <p className="reason-description">
                  Skip the middleman — pay less for more freshness.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default Home;
