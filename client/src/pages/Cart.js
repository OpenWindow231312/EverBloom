// ========================================
// 🌸 EverBloom — Cart Page (Final Version with Checkout + Order Popup)
// ========================================

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import api from "../api/api";
import "../styles/shop/Shop.css";
import "../pages/Cart.css";
import "../styles/shop/CartSuccessPopup.css"; // ✅ new popup style

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // 🛒 Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // 💾 Update cart + persist to localStorage
  const updateCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ➕ Increase quantity
  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.flower_id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  // ➖ Decrease quantity
  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        item.flower_id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(updated);
  };

  // ❌ Remove item
  const removeItem = (id) => {
    const updated = cart.filter((item) => item.flower_id !== id);
    updateCart(updated);
  };

  // 💰 Helpers
  const num = (val) => Number(val) || 0;
  const formatPrice = (val) => num(val).toFixed(2);

  // 🧾 Totals
  const subtotal = cart.reduce((acc, item) => {
    const price = num(
      item.is_on_sale ? item.sale_price_per_stem : item.price_per_stem
    );
    return acc + price * (item.quantity || 1);
  }, 0);

  const vat = subtotal * 0.15;

  // 🌸 Florist discount logic
  const user = JSON.parse(localStorage.getItem("user"));
  const isFlorist = user?.roles?.includes("Florist");
  const discountRate =
    parseFloat(localStorage.getItem("discount")) || (isFlorist ? 0.1 : 0.0);
  const discountAmount = subtotal * discountRate;

  const total = subtotal + vat - discountAmount;

  // ========================================
  // 💳 Checkout Handler
  // ========================================
  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please log in to place an order.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Navigate to checkout page
    navigate("/checkout");
  };

  // ========================================
  // 🧭 Render
  // ========================================
  return (
    <div className="shop-wrapper">
      <NavBar />

      <header className="cart-header">
        <h1 className="shop-title">Your Cart</h1>
        <p className="shop-subtitle">
          Review your selected flowers and proceed to checkout.
        </p>
      </header>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty</p>
          <Link to="/shop" className="btn-view">
            Browse Flowers
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          {/* 🛒 Cart Items */}
          <div className="cart-items">
            {cart.map((item) => {
              const unitPrice = num(
                item.is_on_sale ? item.sale_price_per_stem : item.price_per_stem
              );
              const lineTotal = unitPrice * (item.quantity || 1);

              return (
                <div key={item.flower_id} className="cart-item modern">
                  <img
                    src={
                      item.image_url && item.image_url.trim() !== ""
                        ? item.image_url
                        : require("../assets/placeholder-flower.jpg")
                    }
                    alt={item.variety}
                    className="cart-img"
                  />

                  <div className="cart-details">
                    <h2 className="cart-variety">{item.variety}</h2>
                    <p className="cart-type">
                      {item.FlowerType?.flowerTypeName ||
                        item.type_name ||
                        "Unknown Type"}
                    </p>

                    <div className="cart-quantity">
                      <button onClick={() => decreaseQty(item.flower_id)}>
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQty(item.flower_id)}>
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-actions">
                    <p className="cart-line-price">R{formatPrice(lineTotal)}</p>
                    <button
                      className="modern-remove"
                      onClick={() => removeItem(item.flower_id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 💰 Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>R{formatPrice(subtotal)}</span>
            </div>

            {isFlorist && (
              <div className="summary-row">
                <span>Florist Discount (10%)</span>
                <span>-R{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>VAT (15%)</span>
              <span>R{formatPrice(vat)}</span>
            </div>

            <hr />

            <div className="summary-row total">
              <span>Total</span>
              <span>R{formatPrice(total)}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* ✅ Success Popup */}
      {showPopup && (
        <div className="cart-success-popup">
          <div className="popup-content">
            <h2>🎉 Order Successful!</h2>
            <p>
              Your order number is <strong>#{orderNumber}</strong>.
            </p>
            <p>Check your email for delivery details.</p>
            <button className="btn-primary" onClick={() => navigate("/shop")}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Cart;
