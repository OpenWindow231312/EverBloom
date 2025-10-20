import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { FaHeartBroken } from "react-icons/fa";
import "../styles/shop/Shop.css";

function Favourites() {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(saved);
  }, []);

  const removeFavourite = (id) => {
    const updated = favourites.filter((f) => f.flower_id !== id);
    setFavourites(updated);
    localStorage.setItem("favourites", JSON.stringify(updated));
  };

  return (
    <div className="shop-wrapper">
      <NavBar />

      <header className="shop-header">
        <h1 className="shop-title">Your Favourite Blooms</h1>
        <p className="shop-subtitle">
          Here are the flowers you’ve saved from the EverBloom collection.
        </p>
      </header>

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
              <div key={flower.flower_id} className="flower-card">
                <button
                  className="heart-btn active"
                  onClick={() => removeFavourite(flower.flower_id)}
                >
                  <FaHeartBroken />
                </button>

                <Link
                  to={`/product/${flower.flower_id}`}
                  className="flower-link"
                >
                  <img
                    src={
                      flower.image_url && flower.image_url.trim() !== ""
                        ? flower.image_url
                        : require("../assets/placeholder-flower.jpg")
                    }
                    alt={flower.variety}
                    className="flower-img"
                  />
                </Link>

                <div className="flower-info">
                  <h3 className="flower-name">{flower.variety}</h3>
                  <p className="flower-type">
                    {flower.FlowerType?.flowerTypeName || "Unknown Type"}
                  </p>
                  <p className="flower-price">R{flower.price_per_stem}</p>
                  <Link to={`/product/${flower.flower_id}`}>
                    <button className="btn-view">View Details</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export default Favourites;
