// ========================================
// 🌸 EverBloom — Product Card Component (Final Synced Version)
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
  // 🌿 Normalize backend data
  const stockAvailable = Number(flower.stock_available || 0);
  const isSoldOut = flower.isSoldOut || stockAvailable <= 0;
  const isOnSale =
    flower.is_on_sale === true || Number(flower.is_on_sale) === 1;

  return (
    <div className={`product-card ${isSoldOut ? "sold-out" : ""}`}>
      {/* 🏷️ Sale / Sold Out Badge */}
      {isSoldOut ? (
        <div className="soldout-badge">SOLD OUT</div>
      ) : (
        isOnSale && <div className="sale-badge">SALE</div>
      )}

      {/* ❤️ Favourite Toggle */}
      <button
        className={`heart-btn ${isFavourite ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavourite(flower);
        }}
        disabled={isSoldOut}
      >
        {isFavourite ? <FaHeart /> : <FaRegHeart />}
      </button>

      {/* 🖼️ Image + Link */}
      <Link to={`/product/${flower.flower_id}`} className="card-link">
        <img
          src={
            flower.image_url && flower.image_url.trim() !== ""
              ? flower.image_url
              : require("../assets/placeholder-flower.jpg")
          }
          alt={flower.variety}
          className={`product-img ${isSoldOut ? "img-faded" : ""}`}
        />
      </Link>

      {/* 🌼 Text Info */}
      <div className="product-info">
        <p className="product-type">
          {flower.FlowerType?.flowerTypeName ||
            flower.FlowerType?.type_name ||
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

        {/* 🪻 Stock Status */}
        <p className={`stock-status ${isSoldOut ? "out" : "in"}`}>
          {isSoldOut
            ? "Out of Stock"
            : `In Stock: ${stockAvailable} stem${
                stockAvailable > 1 ? "s" : ""
              }`}
        </p>

        {/* 🛒 Add to Cart */}
        <button
          className={`add-btn ${isSoldOut ? "disabled" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isSoldOut) onAddToCart(flower);
          }}
          disabled={isSoldOut}
        >
          {isSoldOut ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
