import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  Users,
  ShoppingBag,
  Flower,
  Store,
  Sprout,
  Star,
} from "lucide-react";
import "./Dashboard.css";

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ API base URL logic — supports both local + Render
  const API_URL =
    import.meta.env?.VITE_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5001";

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in again.");

        console.log(
          "📡 Fetching overview from:",
          `${API_URL}/api/dashboard/overview`
        );

        const res = await axios.get(`${API_URL}/api/dashboard/overview`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(res.data);
      } catch (err) {
        console.error("❌ Overview fetch error:", err.response || err.message);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setError("Could not load overview data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [API_URL]);

  if (loading)
    return (
      <div className="loading-state">
        <Loader2 className="spinner" /> Loading dashboard overview...
      </div>
    );

  if (error) return <p className="error-message">{error}</p>;

  if (!stats)
    return (
      <p className="error-message">No data available for the dashboard.</p>
    );

  return (
    <div className="dashboard-overview">
      <h2 className="overview-heading">📊 Dashboard Overview</h2>

      <div className="overview-grid">
        <div className="overview-card">
          <Users size={28} />
          <h3>{stats.users ?? 0}</h3>
          <p>Total Users</p>
        </div>

        <div className="overview-card">
          <ShoppingBag size={28} />
          <h3>{stats.orders ?? 0}</h3>
          <p>Total Orders</p>
        </div>

        <div className="overview-card">
          <Flower size={28} />
          <h3>{stats.flowers ?? 0}</h3>
          <p>Total Flowers</p>
        </div>

        <div className="overview-card">
          <Store size={28} />
          <h3>{stats.stores ?? 0}</h3>
          <p>Total Stores</p>
        </div>

        <div className="overview-card">
          <Sprout size={28} />
          <h3>{stats.harvestBatches ?? 0}</h3>
          <p>Harvest Batches</p>
        </div>

        <div className="overview-card">
          <Star size={28} />
          <h3>{stats.reviews ?? 0}</h3>
          <p>Customer Reviews</p>
        </div>
      </div>

      <div className="overview-summary">
        <h3>📈 Summary</h3>
        <ul>
          <li>🧑‍💼 Active users: {stats.activeUsers ?? 0}</li>
          <li>🕒 Pending orders: {stats.pendingOrders ?? 0}</li>
          <li>✅ Completed orders: {stats.completedOrders ?? 0}</li>
          <li>💐 Flowers in coldroom: {stats.flowersInColdroom ?? 0}</li>
          <li>⚠️ Low-stock flowers: {stats.lowStock ?? 0}</li>
        </ul>
      </div>
    </div>
  );
}
