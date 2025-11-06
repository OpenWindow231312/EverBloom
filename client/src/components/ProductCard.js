// ========================================
// 🌸 EverBloom — Product Card Component
// ========================================
import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./ProductCard.css";

export default function ProductCard({
  flower,
  isFavourite,
  onToggleFavourite,
  onAddToCart,
}) {
  const isOnSale = Number(flower.is_on_sale) === 1;

  return (
    <div className="product-card">
      {isOnSale && <div className="sale-badge">SALE</div>}

      {/* ❤️ Favourite Toggle */}
      <button
        className={`heart-btn ${isFavourite ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavourite(flower);
        }}
      >
        {isFavourite ? <FaHeart /> : <FaRegHeart />}
      </button>

      {/* 🖼️ Image + Card Link */}
      <Link to={`/product/${flower.flower_id}`} className="card-link">
        <img
          src={
            flower.image_url && flower.image_url.trim() !== ""
              ? flower.image_url
              : require("../assets/placeholder-flower.jpg")
          }
          alt={flower.variety}
          className="product-img"
        />
      </Link>

      {/* 🌼 Text Info */}
      <div className="product-info">
        <p className="product-type">
          {flower.FlowerType?.type_name ||
            flower.FlowerType?.flowerTypeName ||
            flower.type_name ||
            "Flower"}
        </p>

        <h3 className="product-name">{flower.variety}</h3>

        {/* 💰 Price */}
        {isOnSale ? (
          <p className="product-price">
            <span className="sale-price">R{flower.sale_price_per_stem}</span>
            <span className="old-price">R{flower.price_per_stem}</span>
          </p>
        ) : (
          <p className="product-price">R{flower.price_per_stem}</p>
        )}

        {/* 🛒 Add to Cart */}
        <button
          className="add-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(flower);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
