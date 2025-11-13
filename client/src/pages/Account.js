// ========================================
// 🌸 EverBloom — Account/Profile Page
// ========================================
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaMapMarkerAlt, FaCreditCard, FaCamera, FaPlus, FaTrash, FaEdit, FaShoppingBag } from "react-icons/fa";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "./Account.css";

function Account() {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  const navigate = useNavigate();

  const API_URL =
    import.meta.env?.VITE_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5001";

  // Address form state
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    streetAddress: "",
    city: "",
    province: "",
    postalCode: "",
    country: "South Africa",
    phone: "",
    addressType: "Shipping",
    isDefault: false,
  });

  // Card form state
  const [cardForm, setCardForm] = useState({
    cardholderName: "",
    nickname: "",
    cardType: "Visa",
    lastFourDigits: "",
    expiryMonth: "",
    expiryYear: "",
    isDefault: false,
  });

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
  });

  const fetchProfile = useCallback(async () => {
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
        setUser(data.user);
        setAddresses(data.user.Addresses || []);
        setPaymentMethods(data.user.PaymentMethods || []);
        setProfileForm({
          fullName: data.user.fullName,
          phone: data.user.phone || "",
        });
      } else {
        setError(data.error || "Failed to load profile");
      }

      // Fetch user orders
      const ordersRes = await fetch(`${API_URL}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileForm),
      });

      const data = await res.json();
      if (res.ok) {
        setUser({ ...user, ...data.user });
        setEditingProfile(false);
        alert("Profile updated successfully!");
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Server error");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/profile/photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUser({ ...user, profilePhoto: data.profilePhoto });
        alert("Profile photo updated!");
      } else {
        alert(data.error || "Failed to upload photo");
      }
    } catch (err) {
      console.error("Error uploading photo:", err);
      alert("Server error");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const method = editingAddress ? "PUT" : "POST";
      const url = editingAddress
        ? `${API_URL}/api/profile/addresses/${editingAddress.address_id}`
        : `${API_URL}/api/profile/addresses`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });

      const data = await res.json();
      if (res.ok) {
        fetchProfile();
        setShowAddressModal(false);
        setEditingAddress(null);
        resetAddressForm();
        alert(editingAddress ? "Address updated!" : "Address added!");
      } else {
        alert(data.error || "Failed to save address");
      }
    } catch (err) {
      console.error("Error saving address:", err);
      alert("Server error");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/profile/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchProfile();
        alert("Address deleted!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete address");
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      alert("Server error");
    }
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/profile/payment-methods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cardForm),
      });

      const data = await res.json();
      if (res.ok) {
        fetchProfile();
        setShowCardModal(false);
        resetCardForm();
        alert("Payment method added!");
      } else {
        alert(data.error || "Failed to add payment method");
      }
    } catch (err) {
      console.error("Error adding card:", err);
      alert("Server error");
    }
  };

  const handleDeleteCard = async (id) => {
    if (!window.confirm("Delete this payment method?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/profile/payment-methods/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchProfile();
        alert("Payment method deleted!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete payment method");
      }
    } catch (err) {
      console.error("Error deleting card:", err);
      alert("Server error");
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      fullName: "",
      streetAddress: "",
      city: "",
      province: "",
      postalCode: "",
      country: "South Africa",
      phone: "",
      addressType: "Shipping",
      isDefault: false,
    });
  };

  const resetCardForm = () => {
    setCardForm({
      cardholderName: "",
      nickname: "",
      cardType: "Visa",
      lastFourDigits: "",
      expiryMonth: "",
      expiryYear: "",
      isDefault: false,
    });
  };

  const openEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm(address);
    setShowAddressModal(true);
  };

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="loading-container">Loading profile...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <div className="error-container">Error: {error}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="account-page">
      <NavBar />
      <div className="account-container">
        <h1 className="account-title">My Account</h1>

        {/* Tabs */}
        <div className="account-tabs">
          <button
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser /> Profile
          </button>
          <button
            className={`tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FaShoppingBag /> Orders
          </button>
          <button
            className={`tab ${activeTab === "addresses" ? "active" : ""}`}
            onClick={() => setActiveTab("addresses")}
          >
            <FaMapMarkerAlt /> Addresses
          </button>
          <button
            className={`tab ${activeTab === "payment" ? "active" : ""}`}
            onClick={() => setActiveTab("payment")}
          >
            <FaCreditCard /> Payment Methods
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="tab-content">
            <div className="profile-photo-section">
              <div className="profile-photo">
                {user.profilePhoto ? (
                  <img src={`${API_URL}${user.profilePhoto}`} alt="Profile" />
                ) : (
                  <FaUser className="default-avatar" />
                )}
              </div>
              <label className="upload-photo-btn">
                <FaCamera /> Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {editingProfile ? (
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, fullName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={user.email} disabled />
                  <small>Email cannot be changed</small>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setEditingProfile(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-item">
                  <strong>Name:</strong> {user.fullName}
                </div>
                <div className="info-item">
                  <strong>Email:</strong> {user.email}
                </div>
                <div className="info-item">
                  <strong>Phone:</strong> {user.phone || "Not provided"}
                </div>
                <button
                  className="btn-primary"
                  onClick={() => setEditingProfile(true)}
                >
                  <FaEdit /> Edit Profile
                </button>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="tab-content">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
              <p>You haven't placed any orders yet.</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.order_id} className="order-card">
                    <div className="order-header">
                      <div>
                        <h3>Order #{order.order_id}</h3>
                        <p className="order-date">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="order-status-container">
                        <span className={`order-status status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="order-items">
                      {order.OrderItems && order.OrderItems.map((item) => (
                        <div key={item.order_item_id} className="order-item">
                          <div className="order-item-details">
                            <span className="item-name">
                              {item.Flower?.variety || 'Flower'}
                            </span>
                            <span className="item-quantity">
                              Qty: {item.quantityOrdered}
                            </span>
                          </div>
                          <span className="item-price">
                            R{(item.unitPrice * item.quantityOrdered).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="order-footer">
                      <div className="order-delivery">
                        <strong>Delivery Method:</strong> {order.pickupOrDelivery}
                      </div>
                      <div className="order-total">
                        <strong>Total:</strong> R{parseFloat(order.totalAmount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Shipping Addresses</h2>
              <button
                className="btn-primary"
                onClick={() => {
                  resetAddressForm();
                  setEditingAddress(null);
                  setShowAddressModal(true);
                }}
              >
                <FaPlus /> Add Address
              </button>
            </div>

            <div className="addresses-grid">
              {addresses.length === 0 ? (
                <p>No addresses saved yet.</p>
              ) : (
                addresses.map((addr) => (
                  <div key={addr.address_id} className="address-card">
                    {addr.isDefault && <span className="default-badge">Default</span>}
                    <h3>{addr.fullName}</h3>
                    <p>{addr.streetAddress}</p>
                    <p>
                      {addr.city}, {addr.province} {addr.postalCode}
                    </p>
                    <p>{addr.country}</p>
                    {addr.phone && <p>Phone: {addr.phone}</p>}
                    <div className="card-actions">
                      <button onClick={() => openEditAddress(addr)}>
                        <FaEdit /> Edit
                      </button>
                      <button onClick={() => handleDeleteAddress(addr.address_id)}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === "payment" && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Payment Methods</h2>
              <button
                className="btn-primary"
                onClick={() => {
                  resetCardForm();
                  setShowCardModal(true);
                }}
              >
                <FaPlus /> Add Card
              </button>
            </div>

            <div className="cards-grid">
              {paymentMethods.length === 0 ? (
                <p>No payment methods saved yet.</p>
              ) : (
                paymentMethods.map((card) => (
                  <div key={card.payment_id} className="payment-card">
                    {card.isDefault && <span className="default-badge">Default</span>}
                    <div className="card-type">{card.cardType}</div>
                    {card.nickname && <div className="card-nickname">{card.nickname}</div>}
                    <div className="card-number">•••• •••• •••• {card.lastFourDigits}</div>
                    <div className="card-holder">{card.cardholderName}</div>
                    <div className="card-expiry">
                      Expires: {String(card.expiryMonth).padStart(2, "0")}/
                      {card.expiryYear}
                    </div>
                    <button
                      className="delete-card-btn"
                      onClick={() => handleDeleteCard(card.payment_id)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingAddress ? "Edit Address" : "Add New Address"}</h2>
            <form onSubmit={handleAddressSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  value={addressForm.streetAddress}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, streetAddress: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Province *</label>
                  <input
                    type="text"
                    value={addressForm.province}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, province: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    value={addressForm.postalCode}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, postalCode: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, country: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, isDefault: e.target.checked })
                    }
                  />
                  Set as default address
                </label>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingAddress ? "Update" : "Add"} Address
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowAddressModal(false);
                    setEditingAddress(null);
                    resetAddressForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Card Modal */}
      {showCardModal && (
        <div className="modal-overlay" onClick={() => setShowCardModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Payment Method</h2>
            <form onSubmit={handleCardSubmit}>
              <div className="form-group">
                <label>Cardholder Name *</label>
                <input
                  type="text"
                  value={cardForm.cardholderName}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, cardholderName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Card Nickname (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Personal Visa, Work Card"
                  value={cardForm.nickname}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, nickname: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Card Type *</label>
                <select
                  value={cardForm.cardType}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, cardType: e.target.value })
                  }
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="American Express">American Express</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Last 4 Digits *</label>
                <input
                  type="text"
                  maxLength="4"
                  value={cardForm.lastFourDigits}
                  onChange={(e) =>
                    setCardForm({
                      ...cardForm,
                      lastFourDigits: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Month *</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={cardForm.expiryMonth}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, expiryMonth: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Expiry Year *</label>
                  <input
                    type="number"
                    min={new Date().getFullYear()}
                    value={cardForm.expiryYear}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, expiryYear: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={cardForm.isDefault}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, isDefault: e.target.checked })
                    }
                  />
                  Set as default payment method
                </label>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Add Card
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowCardModal(false);
                    resetCardForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Account;
