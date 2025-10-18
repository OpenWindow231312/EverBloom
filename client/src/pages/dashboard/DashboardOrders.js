import React, { useEffect, useState } from "react";
import axios from "axios";
import "../dashboard/Dashboard.css";

export default function DashboardOrders() {
  const API_URL =
    import.meta.env?.VITE_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5001";
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stockWarnings, setStockWarnings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newOrder, setNewOrder] = useState({
    user_id: "",
    pickupOrDelivery: "Pickup",
    shippingAddress: "",
    flowers: [{ flower_id: "", quantity: "" }],
  });

  // 🧭 Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) throw new Error("No token found.");

        const [ordersRes, usersRes, flowersRes] = await Promise.all([
          axios.get(`${API_URL}/api/dashboard/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/dashboard/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/dashboard/flowers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setOrders(ordersRes.data || []);
        setUsers(usersRes.data || []);

        const availableFlowers = flowersRes.data.map((f) => {
          const batch = f.HarvestBatches?.[0];
          const status = batch?.status || "Unknown";
          const stock = batch?.Inventory?.stemsInColdroom ?? 0;

          return {
            flower_id: f.flower_id,
            variety: f.variety,
            color: f.color,
            type_name: f.FlowerType?.type_name,
            status,
            stock,
          };
        });
        setFlowers(availableFlowers);
      } catch (err) {
        console.error("❌ Load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  // ✅ Add order
  const handleAddOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/dashboard/orders`,
        newOrder,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Order created successfully!");
      setOrders((prev) => [...prev, res.data.order]);
      setNewOrder({
        user_id: "",
        pickupOrDelivery: "Pickup",
        shippingAddress: "",
        flowers: [{ flower_id: "", quantity: "" }],
      });
      setStockWarnings({});
      setShowAddForm(false);
    } catch (err) {
      console.error("❌ Error creating order:", err);
      alert(err.response?.data?.message || "❌ Failed to create order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🧮 Handle flower selection & stock check
  const handleFlowerChange = (index, field, value) => {
    const updated = [...newOrder.flowers];
    updated[index][field] = value;

    if (field === "quantity" || field === "flower_id") {
      const selectedFlower =
        flowers.find(
          (fl) => fl.flower_id === Number(updated[index].flower_id)
        ) || {};
      const maxStock = selectedFlower.stock || 0;
      const qty = Number(updated[index].quantity) || 0;

      setStockWarnings((prev) => ({
        ...prev,
        [index]:
          qty > maxStock
            ? `⚠️ Only ${maxStock} stems available`
            : qty === maxStock && maxStock > 0
            ? `✅ Using all available stock`
            : "",
      }));
    }

    setNewOrder({ ...newOrder, flowers: updated });
  };

  const addFlowerRow = () =>
    setNewOrder({
      ...newOrder,
      flowers: [...newOrder.flowers, { flower_id: "", quantity: "" }],
    });

  if (loading) return <p className="loading">Loading orders...</p>;

  return (
    <div className="dashboard-orders">
      <h2 className="overview-heading">📦 Orders Management</h2>

      <button
        className="btn-primary add-order-btn"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "✖ Close Form" : "➕ Add New Order"}
      </button>

      {showAddForm && (
        <div className="order-form card">
          <h3>Create New Order</h3>
          <form onSubmit={handleAddOrder}>
            <label>Customer</label>
            <select
              name="user_id"
              value={newOrder.user_id}
              onChange={(e) =>
                setNewOrder({ ...newOrder, user_id: e.target.value })
              }
              required
            >
              <option value="">Select Customer</option>
              {users.map((u) => (
                <option key={u.user_id} value={u.user_id}>
                  {u.fullName} ({u.email})
                </option>
              ))}
            </select>

            <label>Delivery Type</label>
            <select
              name="pickupOrDelivery"
              value={newOrder.pickupOrDelivery}
              onChange={(e) =>
                setNewOrder({ ...newOrder, pickupOrDelivery: e.target.value })
              }
            >
              <option value="Pickup">Pickup</option>
              <option value="Delivery">Delivery</option>
            </select>

            {newOrder.pickupOrDelivery === "Delivery" && (
              <>
                <label>Shipping Address</label>
                <input
                  type="text"
                  placeholder="Enter shipping address"
                  value={newOrder.shippingAddress}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      shippingAddress: e.target.value,
                    })
                  }
                  required
                />
              </>
            )}

            <h4>🪷 Flower Selection</h4>
            {newOrder.flowers.map((f, i) => (
              <div key={i} className="flower-row">
                <select
                  value={f.flower_id}
                  onChange={(e) =>
                    handleFlowerChange(i, "flower_id", e.target.value)
                  }
                  required
                >
                  <option value="">Select Flower</option>
                  {flowers.map((fl) => (
                    <option key={fl.flower_id} value={fl.flower_id}>
                      {fl.type_name} - {fl.variety} ({fl.color}) 🌿 {fl.status}{" "}
                      ({fl.stock} stems)
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  value={f.quantity}
                  onChange={(e) =>
                    handleFlowerChange(i, "quantity", e.target.value)
                  }
                  required
                />

                {stockWarnings[i] && (
                  <small
                    className={`stock-warning ${
                      stockWarnings[i].includes("⚠️") ? "warning" : "ok"
                    }`}
                  >
                    {stockWarnings[i]}
                  </small>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn-secondary"
              onClick={addFlowerRow}
            >
              ➕ Add Another Flower
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Order"}
            </button>
          </form>
        </div>
      )}

      <table className="dashboard-table orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((o) => (
              <tr key={o.order_id}>
                <td>{o.order_id}</td>
                <td>{o.User?.fullName || "Unknown"}</td>
                <td>
                  <span className={`status-badge ${o.status.toLowerCase()}`}>
                    {o.status}
                  </span>
                </td>
                <td>R{Number(o.totalAmount).toFixed(2)}</td>
                <td>{o.pickupOrDelivery}</td>
                <td>{new Date(o.orderDateTime).toLocaleDateString("en-ZA")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No orders available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
