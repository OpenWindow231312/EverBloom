// ========================================
// 🌸 EverBloom — Individual Product Page
// ========================================
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductPage.css";
import API from "../api/api";
import { Heart, ShoppingBag } from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function ProductPage() {
  const { id } = useParams(); // URL param (flower_id)
  const navigate = useNavigate();

  const [flower, setFlower] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [favourites, setFavourites] = useState(
    JSON.parse(localStorage.getItem("favourites")) || []
  );
  const [loading, setLoading] = useState(true);

  // 🌼 Fetch flower by ID
  useEffect(() => {
    const fetchFlower = async () => {
      try {
        const res = await API.get(`/shop/${id}`);
        setFlower(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlower();
  }, [id]);

  // ❤️ Toggle favourite
  const toggleFavourite = () => {
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
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.flower_id === flower.flower_id);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map((item) =>
        item.flower_id === flower.flower_id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...cart, { ...flower, quantity }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("🛒 Added to cart!");
  };

  if (loading) return <p className="loading-text">Loading flower details...</p>;
  if (!flower) return <p className="error-text">Flower not found.</p>;

  // ✅ Safe conversions
  const isFavourite = favourites.some((f) => f.flower_id === flower.flower_id);
  const onSale = Number(flower.is_on_sale) === 1;

  const price = Number(flower.price_per_stem || 0).toFixed(2);
  const salePrice = Number(
    flower.sale_price_per_stem || flower.price_per_stem || 0
  ).toFixed(2);
  const stemLength = flower.stem_length ? `${flower.stem_length} cm` : "N/A";
  const shelfLife = flower.shelf_life ? `${flower.shelf_life} days` : "N/A";
  const harvestDate = flower.harvest_date
    ? new Date(flower.harvest_date).toLocaleDateString("en-ZA")
    : "N/A";

  return (
    <div>
      <NavBar />

      <div className="product-page">
        <div className="product-container">
          {/* 🖼️ Image Section */}
          <div className="product-image-container">
            <img
              src={
                flower.image_url && flower.image_url.trim() !== ""
                  ? flower.image_url
                  : require("../assets/placeholder-flower.jpg")
              }
              alt={flower.variety}
              className="product-image"
            />
            <button
              className={`favourite-btn ${isFavourite ? "active" : ""}`}
              onClick={toggleFavourite}
            >
              <Heart className="heart-icon" />
            </button>
            {onSale && <div className="sale-badge">On Sale</div>}
          </div>

          {/* 🌸 Details Section */}
          <div className="product-details">
            <h1 className="product-title">{flower.variety}</h1>
            <p className="product-type">
              {flower.FlowerType?.flowerTypeName || "Flower"}
            </p>

            <div className="price-section">
              {onSale ? (
                <>
                  <h2 className="product-price">R {salePrice}</h2>
                  <span className="old-price">R {price}</span>
                  <span className="sale-text">Limited time discount!</span>
                </>
              ) : (
                <h2 className="product-price">R {price}</h2>
              )}
            </div>

            <p className="product-description">
              {flower.description || "No description available."}
            </p>

            <div className="product-info1">
              <p>
                <strong>Stem Length:</strong> {stemLength}
              </p>
              <p>
                <strong>Shelf Life:</strong> {shelfLife}
              </p>
              <p>
                <strong>Harvest Date:</strong> {harvestDate}
              </p>
              <p
                className={`stock-text ${
                  flower.stock_available <= 5 ? "low-stock" : ""
                }`}
              >
                <strong>In Stock:</strong>{" "}
                {flower.stock_available > 0
                  ? `${flower.stock_available} stems`
                  : "Out of stock"}
              </p>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="cart-actions">
              <div className="quantity-selector">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={addToCart}
                disabled={flower.stock_available <= 0}
                style={{
                  background: flower.stock_available <= 0 ? "#ccc" : "",
                  cursor:
                    flower.stock_available <= 0 ? "not-allowed" : "pointer",
                }}
              >
                <ShoppingBag className="cart-icon" />
                {flower.stock_available <= 0 ? "Sold Out" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProductPage;
