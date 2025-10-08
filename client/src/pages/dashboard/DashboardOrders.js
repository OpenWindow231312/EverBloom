import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../api/api";
import "../dashboard/Dashboard.css";

export default function DashboardOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all orders from backend
  const loadOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ✅ Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert("✅ Order status updated!");
      loadOrders(); // reload updated data
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("❌ Failed to update order status.");
    }
  };

  if (loading) return <p className="loading">Loading orders...</p>;

  return (
    <div className="dashboard-orders">
      <h2>Orders</h2>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total Amount</th>
            <th>Date</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.User?.fullName || "Unknown"}</td>
                <td>{order.status}</td>
                <td>R{Number(order.totalAmount).toFixed(2)}</td>
                <td>
                  {order.orderDateTime
                    ? new Date(order.orderDateTime).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.order_id, e.target.value)
                    }
                    className="status-dropdown"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Returned">Returned</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No orders available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
