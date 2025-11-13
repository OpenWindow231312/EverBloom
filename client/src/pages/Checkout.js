// ========================================
// 🌸 EverBloom — Checkout Page
// ========================================
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import api from "../api/api";
import "./Checkout.css";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  
  const navigate = useNavigate();

  const API_URL =
    import.meta.env?.VITE_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5001";

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setAddresses(data.user.Addresses || []);
        setPaymentMethods(data.user.PaymentMethods || []);
        
        // Auto-select default address and payment method
        const defaultAddr = data.user.Addresses?.find(addr => addr.isDefault);
        const defaultPayment = data.user.PaymentMethods?.find(pm => pm.isDefault);
        
        setSelectedAddress(defaultAddr?.address_id || null);
        setSelectedPayment(defaultPayment?.payment_id || null);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate, API_URL]);

  useEffect(() => {
    // Load cart
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    // Fetch user profile data
    fetchUserData();
  }, [fetchUserData]);

  // Calculate totals
  const num = (val) => Number(val) || 0;
  const formatPrice = (val) => num(val).toFixed(2);

  const subtotal = cart.reduce((acc, item) => {
    const price = num(
      item.is_on_sale ? item.sale_price_per_stem : item.price_per_stem
    );
    return acc + price * (item.quantity || 1);
  }, 0);

  const vat = subtotal * 0.15;

  const user = JSON.parse(localStorage.getItem("user"));
  const isFlorist = user?.roles?.includes("Florist");
  const discountAmount = isFlorist ? subtotal * 0.1 : 0;

  const total = subtotal + vat - discountAmount;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a shipping address");
      return;
    }

    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      const payload = {
        items: cart,
        totalAmount: total,
        pickupOrDelivery: "Delivery",
        addressId: selectedAddress,
        paymentMethodId: selectedPayment,
      };

      const res = await api.post("/orders", payload);

      if (res?.data?.order) {
        setOrderNumber(res.data.order.order_id);
        setShowSuccess(true);

        // Clear cart
        localStorage.removeItem("cart");
        setCart([]);
      } else {
        alert("Failed to create order. Please try again.");
      }
    } catch (err) {
      console.error("❌ Error creating order:", err);
      alert("Something went wrong while placing your order.");
    }
  };

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="loading-container">Loading checkout...</div>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0 && !showSuccess) {
    return (
      <div>
        <NavBar />
        <div className="empty-checkout">
          <h2>Your cart is empty</h2>
          <button className="btn-primary" onClick={() => navigate("/shop")}>
            Browse Flowers
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <NavBar />
      
      {!showSuccess ? (
        <div className="checkout-container">
          <h1 className="checkout-title">Checkout</h1>

          <div className="checkout-content">
            {/* Left Column - Order Summary */}
            <div className="checkout-section">
              <h2>Order Summary</h2>
              <div className="order-items">
                {cart.map((item) => {
                  const unitPrice = num(
                    item.is_on_sale ? item.sale_price_per_stem : item.price_per_stem
                  );
                  const lineTotal = unitPrice * (item.quantity || 1);

                  return (
                    <div key={item.flower_id} className="order-item">
                      <img
                        src={
                          item.image_url && item.image_url.trim() !== ""
                            ? item.image_url
                            : require("../assets/placeholder-flower.jpg")
                        }
                        alt={item.variety}
                      />
                      <div className="item-details">
                        <h3>{item.variety}</h3>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="item-price">R{formatPrice(lineTotal)}</div>
                    </div>
                  );
                })}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>R{formatPrice(subtotal)}</span>
                </div>
                {isFlorist && (
                  <div className="total-row discount">
                    <span>Florist Discount (10%)</span>
                    <span>-R{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="total-row">
                  <span>VAT (15%)</span>
                  <span>R{formatPrice(vat)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>R{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Shipping & Payment */}
            <div className="checkout-section">
              <h2>Shipping Address</h2>
              {addresses.length === 0 ? (
                <div className="no-data">
                  <p>No saved addresses found.</p>
                  <button
                    className="btn-secondary"
                    onClick={() => navigate("/account")}
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="address-selection">
                  {addresses.map((addr) => (
                    <div
                      key={addr.address_id}
                      className={`address-option ${
                        selectedAddress === addr.address_id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedAddress(addr.address_id)}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr.address_id}
                        onChange={() => setSelectedAddress(addr.address_id)}
                      />
                      <div className="address-info">
                        <strong>{addr.fullName}</strong>
                        <p>{addr.streetAddress}</p>
                        <p>
                          {addr.city}, {addr.province} {addr.postalCode}
                        </p>
                        {addr.phone && <p>Phone: {addr.phone}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h2 className="payment-title">Payment Method</h2>
              {paymentMethods.length === 0 ? (
                <div className="no-data">
                  <p>No saved payment methods found.</p>
                  <button
                    className="btn-secondary"
                    onClick={() => navigate("/account")}
                  >
                    Add Payment Method
                  </button>
                </div>
              ) : (
                <div className="payment-selection">
                  {paymentMethods.map((card) => (
                    <div
                      key={card.payment_id}
                      className={`payment-option ${
                        selectedPayment === card.payment_id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedPayment(card.payment_id)}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === card.payment_id}
                        onChange={() => setSelectedPayment(card.payment_id)}
                      />
                      <div className="payment-info">
                        <strong>
                          {card.nickname || `${card.cardType} ending in ${card.lastFourDigits}`}
                        </strong>
                        <p>•••• •••• •••• {card.lastFourDigits}</p>
                        <p>
                          Expires: {String(card.expiryMonth).padStart(2, "0")}/
                          {card.expiryYear}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="btn-place-order"
                onClick={handlePlaceOrder}
                disabled={!selectedAddress || !selectedPayment}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="success-container">
          <div className="success-box">
            <div className="success-icon">✓</div>
            <h2>Order Successful!</h2>
            <p className="order-number">
              Your order number is <strong>#{orderNumber}</strong>
            </p>
            <p>Check your email for delivery details and tracking information.</p>
            <div className="success-actions">
              <button className="btn-primary" onClick={() => navigate("/shop")}>
                Continue Shopping
              </button>
              <button className="btn-secondary" onClick={() => navigate("/account")}>
                View Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Checkout;
