import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import "./Cart.css"; // Importing the CSS file for Cart page styling

const Cart = () => {
  const buttonStyle = {
    backgroundColor: "#DE0D22", // Red fill
    color: "#FFFFFF", // White text
    padding: "1rem", // Padding
    fontSize: "18px", // Font size
    border: "none", // No border
    borderRadius: "30px", // Corner radius
    cursor: "pointer", // Pointer cursor
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Cart Page Content */}
      <section className="cart-section">
        <div className="container">
          <h1 className="cart-heading">Your Shopping Cart</h1>
          <p className="cart-description">
            Review your selected items and proceed to checkout when you're
            ready.
          </p>

          {/* Cart Items */}
          <div className="cart-items">
            {/* Example of a single cart item */}
            <div className="cart-item">
              <img
                src="https://via.placeholder.com/100"
                alt="Product"
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h2 className="cart-item-title">Product Name</h2>
                <p className="cart-item-price">R250.00</p>
                <div className="cart-item-quantity">
                  <button style={buttonStyle}>-</button>
                  <span className="quantity-value">1</span>
                  <button style={buttonStyle}>+</button>
                </div>
              </div>
              <button style={buttonStyle}>Remove</button>
            </div>
            {/* Repeat for other cart items */}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2 className="summary-heading">Order Summary</h2>
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>R500.00</span>
            </div>
            <div className="summary-item">
              <span>Tax:</span>
              <span>R50.00</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span>R550.00</span>
            </div>
            <button style={buttonStyle}>Proceed to Checkout</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Cart;
