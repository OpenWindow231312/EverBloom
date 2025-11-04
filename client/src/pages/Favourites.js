// ========================================
// 🌸 EverBloom — Favourites Page (Updated)
// ========================================

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeartBroken } from "react-icons/fa";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import API from "../api/api";
import "../styles/shop/Shop.css";
import "../components/ProductCard.css";

function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌸 Load favourites from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(saved);
  }, []);

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
  const removeFavourite = (id) => {
    const updated = favourites.filter((f) => f.flower_id !== id);
    setFavourites(updated);
    localStorage.setItem("favourites", JSON.stringify(updated));
  };

  // 🛒 Placeholder for add to cart (shared logic from shop)
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

  // 🌼 Generate random recommendations for "You Might Like"
  const getRandomRecommendations = () => {
    if (!flowers.length) return [];
    const shuffled = [...flowers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  };

  const recommendations = getRandomRecommendations();

  return (
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
                  // Add/remove favourite directly from carousel
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
  );
}

export default Favourites;
