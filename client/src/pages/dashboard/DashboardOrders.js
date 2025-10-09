import React, { useEffect, useState } from "react";
import axios from "axios";
import "../dashboard/Dashboard.css";

export default function DashboardOrders() {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all orders from backend
  const loadOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/orders`);
      setOrders(res.data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [API_URL]);

  // ✅ Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/dashboard/orders/${orderId}/status`, {
        status: newStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("❌ Failed to update order status.");
    }
  };

  // 🧠 Helper to assign badge color class
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "Delivered":
        return "status-delivered";
      case "Cancelled":
        return "status-cancelled";
      case "Out for Delivery":
        return "status-delivery";
      default:
        return "status-generic";
    }
  };

  if (loading) return <p className="loading">Loading orders...</p>;

  return (
    <div className="dashboard-orders">
      <h2 className="overview-heading">📦 Orders Management</h2>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.User?.fullName || "Unknown"}</td>

                {/* ✅ Status dropdown integrated into single column */}
                <td>
                  <div
                    className={`status-dropdown-wrapper ${getStatusClass(
                      order.status
                    )}`}
                  >
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.order_id, e.target.value)
                      }
                      className={`status-dropdown ${getStatusClass(
                        order.status
                      )}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>
                </td>

                <td>R{Number(order.totalAmount).toFixed(2)}</td>
                <td>
                  {order.orderDateTime
                    ? new Date(order.orderDateTime).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No orders available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
