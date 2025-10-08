import React, { useEffect, useState } from "react";
import { getDashboardOverview } from "../../api/api";
import "./Dashboard.css";

export default function DashboardOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardOverview()
      .then((res) => setData(res.data))
      .catch((err) => console.error("Overview fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading overview...</p>;
  if (!data) return <p className="error">Could not load overview data.</p>;

  return (
    <div className="dashboard-overview">
      <h2>Overview</h2>
      <div className="overview-cards">
        <div className="card">👥 Total Users: {data.users}</div>
        <div className="card">🛒 Total Orders: {data.orders}</div>
        <div className="card">🌸 Total Flowers: {data.flowers}</div>
        <div className="card">🏬 Total Stores: {data.stores}</div>
        <div className="card">🌿 Harvest Batches: {data.harvestBatches}</div>
      </div>
    </div>
  );
}
