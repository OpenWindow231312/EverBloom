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

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/dashboard/overview`);
        setStats(res.data);
      } catch (err) {
        console.error("Overview fetch error:", err);
        setError("Could not load overview data. Please try again.");
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
          <h3>{stats.users}</h3>
          <p>Total Users</p>
        </div>

        <div className="overview-card">
          <ShoppingBag size={28} />
          <h3>{stats.orders}</h3>
          <p>Total Orders</p>
        </div>

        <div className="overview-card">
          <Flower size={28} />
          <h3>{stats.flowers}</h3>
          <p>Total Flowers</p>
        </div>

        <div className="overview-card">
          <Store size={28} />
          <h3>{stats.stores}</h3>
          <p>Total Stores</p>
        </div>

        <div className="overview-card">
          <Sprout size={28} />
          <h3>{stats.harvestBatches}</h3>
          <p>Harvest Batches</p>
        </div>

        <div className="overview-card">
          <Star size={28} />
          <h3>{stats.reviews}</h3>
          <p>Customer Reviews</p>
        </div>
      </div>

      <div className="overview-summary">
        <h3>📈 Summary</h3>
        <ul>
          <li>🧑‍💼 Active users: {stats.activeUsers}</li>
          <li>🕒 Pending orders: {stats.pendingOrders}</li>
          <li>✅ Completed orders: {stats.completedOrders}</li>
          <li>💐 Flowers in coldroom: {stats.flowersInColdroom}</li>
          <li>⚠️ Low-stock flowers: {stats.lowStock}</li>
        </ul>
      </div>
    </div>
  );
}
