// ========================================
// 🌸 EverBloom — Favourites Page (with Backend Integration)
// ========================================

import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaHeartBroken } from "react-icons/fa";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import API from "../api/api";
import { isAuthenticated } from "../utils/auth";
import "../styles/shop/Shop.css";
import "../components/ProductCard.css";
import { Helmet } from "react-helmet-async";

function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌸 Load favourites (backend if logged in, localStorage if guest)
  const loadFavourites = useCallback(async () => {
    try {
      if (isAuthenticated()) {
        // Fetch from backend for logged-in users
        const res = await API.get("/favourites");
        setFavourites(res.data);
      } else {
        // Use localStorage for guests
        const saved = JSON.parse(localStorage.getItem("favourites")) || [];
        setFavourites(saved);
      }
    } catch (err) {
      console.error("Error loading favourites:", err);
      // Fallback to localStorage
      const saved = JSON.parse(localStorage.getItem("favourites")) || [];
      setFavourites(saved);
    }
  }, []);

  useEffect(() => {
    loadFavourites();
  }, [loadFavourites]);

  // 🌺 Fetch all flowers for recommendation carousel
  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const res = await API.get("/shop");
        setFlowers(res.data);
      } catch (err) {
        console.error("Error fetching flowers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlowers();
  }, []);

  // ❤️ Remove favourite
  const removeFavourite = async (id) => {
    try {
      if (isAuthenticated()) {
        // Remove from backend
        await API.delete(`/favourites/${id}`);
      } else {
        // Remove from localStorage
        const updated = favourites.filter((f) => f.flower_id !== id);
        localStorage.setItem("favourites", JSON.stringify(updated));
      }
      // Reload favourites
      loadFavourites();
    } catch (err) {
      console.error("Error removing favourite:", err);
      // Fallback to localStorage
      const updated = favourites.filter((f) => f.flower_id !== id);
      setFavourites(updated);
      localStorage.setItem("favourites", JSON.stringify(updated));
    }
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

  // 🌼 Random recommendations
  const getRandomRecommendations = () => {
    if (!flowers.length) return [];
    const shuffled = [...flowers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  };

  const recommendations = getRandomRecommendations();

  return (
    <>
      {/* 🪷 SEO Meta Tags */}
      <Helmet>
        <title>EverBloom | Your Favourite Flowers</title>
        <meta
          name="description"
          content="View and manage your saved flowers on EverBloom — South Africa’s online flower marketplace. Revisit your favourite blooms or explore new ones."
        />
        <meta
          name="keywords"
          content="EverBloom favourites, wishlist, saved flowers, florist, bouquets, Pretoria, South Africa"
        />
        <link rel="canonical" href="https://everbloomshop.co.za/favourites" />

        {/* Open Graph / Social */}
        <meta
          property="og:title"
          content="Your Favourite Flowers | EverBloom"
        />
        <meta
          property="og:description"
          content="Browse your saved blooms or discover more from EverBloom’s sustainable flower collection."
        />
        <meta
          property="og:image"
          content="https://everbloomshop.co.za/og-image.jpg"
        />
        <meta
          property="og:url"
          content="https://everbloomshop.co.za/favourites"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="EverBloom" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Your Favourite Flowers | EverBloom"
        />
        <meta
          name="twitter:description"
          content="Your saved flowers from the EverBloom marketplace — revisit your favourites or shop new arrivals."
        />
        <meta
          name="twitter:image"
          content="https://everbloomshop.co.za/og-image.jpg"
        />
      </Helmet>

      <div className="shop-wrapper">
        <NavBar />

        <header className="shop-header">
          <h1 className="shop-title">Your Favourite Blooms</h1>
          <p className="shop-subtitle">
            Here are the flowers you’ve saved from the EverBloom collection.
          </p>
        </header>

        {/* 💖 Favourite Cards */}
        {favourites.length === 0 ? (
          <div className="shop-empty">
            <p>You haven’t added any favourites yet 🌷</p>
            <Link to="/shop" className="btn-view">
              Browse Flowers
            </Link>
          </div>
        ) : (
          <section className="shop-page">
            <div className="shop-grid">
              {favourites.map((flower) => (
                <ProductCard
                  key={flower.flower_id}
                  flower={flower}
                  isFavourite={true}
                  onToggleFavourite={() => removeFavourite(flower.flower_id)}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* 🌺 You Might Like Section */}
        {!loading && recommendations.length > 0 && (
          <section className="recommend-section">
            <h2 className="recommend-title">You Might Like</h2>
            <div className="recommend-carousel">
              {recommendations.map((flower) => (
                <ProductCard
                  key={`rec-${flower.flower_id}`}
                  flower={flower}
                  isFavourite={favourites.some(
                    (f) => f.flower_id === flower.flower_id
                  )}
                  onToggleFavourite={(item) => {
                    const exists = favourites.find(
                      (f) => f.flower_id === item.flower_id
                    );
                    let updated;
                    if (exists) {
                      updated = favourites.filter(
                        (f) => f.flower_id !== item.flower_id
                      );
                    } else {
                      updated = [...favourites, item];
                    }
                    setFavourites(updated);
                    localStorage.setItem("favourites", JSON.stringify(updated));
                  }}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  );
}

export default Favourites;
