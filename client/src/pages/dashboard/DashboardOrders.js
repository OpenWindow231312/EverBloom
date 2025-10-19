// ========================================
// 🌸 EverBloom — Dashboard Orders Management (Crash-Proof)
// ========================================
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/dashboard/_core.css";
import "../../styles/dashboard/dashboardStock.css";
import { FaTruck, FaSearch } from "react-icons/fa";

export default function DashboardOrders() {
  const [orders, setOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPast, setShowPast] = useState(false);

  // 🌿 Filters
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDelivery, setFilterDelivery] = useState("");

  // 📄 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // ✅ Helper to safely display currency
  const formatCurrency = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "0.00";
    return num.toFixed(2);
  };

  // ===========================
  // 🧭 Fetch Orders
  // ===========================
  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/orders");
        const data = res.data || [];

        const active = data.filter(
          (o) => o.status !== "Delivered" && o.status !== "Cancelled"
        );
        const past = data.filter(
          (o) => o.status === "Delivered" || o.status === "Cancelled"
        );

        setOrders(active);
        setPastOrders(past);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        setError("Failed to load order data.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // ===========================
  // 🔄 Update Order Status
  // ===========================
  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      const res = await api.get("/orders");
      const data = res.data || [];

      setOrders(
        data.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled")
      );
      setPastOrders(
        data.filter((o) => o.status === "Delivered" || o.status === "Cancelled")
      );
    } catch (err) {
      console.error("❌ Error updating order:", err);
      alert("Failed to update order status.");
    }
  };

  // ===========================
  // 🧾 Status Badge
  // ===========================
  const StatusBadge = ({ status }) => {
    const map = {
      Pending: "#f0ad4e",
      "Out for Delivery": "#5bc0de",
      Delivered: "#5cb85c",
      Cancelled: "#d9534f",
    };
    return (
      <span
        style={{
          backgroundColor: map[status] || "#ccc",
          color: "#fff",
          padding: "4px 10px",
          borderRadius: "10px",
          fontSize: "0.85rem",
          fontWeight: 600,
        }}
      >
        {status}
      </span>
    );
  };

  // ===========================
  // 🌼 Filtering Logic
  // ===========================
  const filteredOrders = orders.filter((o) => {
    const searchText = filterText.toLowerCase();
    const customer = o.User?.fullName?.toLowerCase() || "guest";
    const delivery = o.pickupOrDelivery?.toLowerCase() || "pickup";
    const status = o.status?.toLowerCase();

    const matchesSearch =
      customer.includes(searchText) ||
      o.order_id?.toString().includes(searchText) ||
      o.OrderItems?.some((i) =>
        i.Flower?.variety?.toLowerCase().includes(searchText)
      );

    const matchesStatus =
      !filterStatus || status === filterStatus.toLowerCase();

    const matchesDelivery =
      !filterDelivery || delivery === filterDelivery.toLowerCase();

    return matchesSearch && matchesStatus && matchesDelivery;
  });

  // ===========================
  // 📄 Pagination Logic
  // ===========================
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ===========================
  // 🧭 Render
  // ===========================
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-stock">
      <h2 className="overview-heading">
        <FaTruck style={{ marginRight: "8px", color: "#b80315" }} />
        Orders Management
      </h2>

      {/* ============================ */}
      {/* Filter Bar */}
      {/* ============================ */}
      <div className="filter-bar">
        <div className="search-wrapper">
          {/* <FaSearch className="search-icon" /> */}
          <input
            type="text"
            placeholder="Search by customer, flower, or order ID..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={filterDelivery}
          onChange={(e) => setFilterDelivery(e.target.value)}
        >
          <option value="">All Delivery Types</option>
          <option value="Delivery">Delivery</option>
          <option value="Pickup">Pickup</option>
        </select>
      </div>

      {/* ============================ */}
      {/* Active Orders Table */}
      {/* ============================ */}
      <section className="dashboard-section">
        <h3>Active Orders</h3>
        {currentOrders.length === 0 ? (
          <p className="no-data">No matching orders found.</p>
        ) : (
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total (R)</th>
                  <th>Delivery</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((o) => (
                  <tr key={o.order_id}>
                    <td>{o.order_id}</td>
                    <td>{o.User?.fullName || "Guest"}</td>
                    <td>
                      {o.OrderItems?.map((i) => (
                        <div key={i.orderItem_id}>
                          {i.Flower?.variety} × {i.quantityOrdered}
                        </div>
                      ))}
                    </td>
                    <td>R {formatCurrency(o.totalAmount)}</td>
                    <td>{o.pickupOrDelivery || "Pickup"}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={o.status} />
                    </td>
                    <td>
                      <select
                        className="status-dropdown"
                        value={o.status}
                        onChange={(e) =>
                          updateStatus(o.order_id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* ============================ */}
      {/* Past Orders */}
      {/* ============================ */}
      <section className="dashboard-section">
        <button
          className="btn-secondary"
          onClick={() => setShowPast(!showPast)}
        >
          {showPast ? "▲ Hide Past Orders" : "▼ Show Past Orders"}
        </button>

        {showPast && (
          <div className="archive-table-wrapper">
            <h3>Past Orders</h3>
            <div className="table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total (R)</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pastOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="no-data">
                        No past orders found.
                      </td>
                    </tr>
                  ) : (
                    pastOrders.map((o) => (
                      <tr key={o.order_id}>
                        <td>{o.order_id}</td>
                        <td>{o.User?.fullName || "Guest"}</td>
                        <td>
                          {o.OrderItems?.map((i) => (
                            <div key={i.orderItem_id}>
                              {i.Flower?.variety} × {i.quantityOrdered}
                            </div>
                          ))}
                        </td>
                        <td>R {formatCurrency(o.totalAmount)}</td>
                        <td>
                          <StatusBadge status={o.status} />
                        </td>
                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
