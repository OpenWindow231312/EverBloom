// ========================================
// 🌸 EverBloom — Dashboard Overview (Final + Render Safe)
// ========================================
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/dashboard/_core.css";
import "../../styles/dashboard/dashboardOverview.css";

// ✅ React Icons
import { FaShoppingBag, FaTruck, FaUsers, FaWarehouse } from "react-icons/fa";
import { GiFlowerPot } from "react-icons/gi";
import { MdOutlineLowPriority, MdRateReview } from "react-icons/md";
import { RiInboxArchiveFill } from "react-icons/ri";

export default function DashboardOverview() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Environment detection (same as api.js)
  const isLocal = window.location.hostname.includes("localhost");
  const API_URL = isLocal
    ? "http://localhost:5001"
    : "https://everbloom.onrender.com"; // ✅ your live backend root

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in again.");

        const headers = { Authorization: `Bearer ${token}` };

        // ✅ Correct endpoint with /api prefix
        const res = await axios.get(`${API_URL}/api/dashboard/overview`, {
          headers,
        });

        setOverview(res.data);
      } catch (err) {
        console.error("❌ Overview error:", err);
        setError(
          err.response?.status === 401
            ? "Session expired. Please log in again."
            : "Failed to load overview stats."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [API_URL]);

  if (loading)
    return (
      <div className="dashboard-page">
        <p>Loading dashboard overview...</p>
      </div>
    );

  if (error)
    return (
      <div className="dashboard-page">
        <p>{error}</p>
      </div>
    );

  if (!overview) return null;

  // =========================================
  // 🧭 Dashboard Summary Cards
  // =========================================
  const cards = [
    {
      title: "Total Orders",
      value: overview.orders,
      icon: <FaShoppingBag className="icon orders" />,
    },
    {
      title: "Pending Orders",
      value: overview.pendingOrders,
      icon: <RiInboxArchiveFill className="icon pending" />,
    },
    {
      title: "Delivered Orders",
      value: overview.completedOrders,
      icon: <FaTruck className="icon delivered" />,
    },
    {
      title: "Flower Varieties",
      value: overview.flowers,
      icon: <GiFlowerPot className="icon flowers" />,
    },
    {
      title: "Stems in Coldroom",
      value: overview.flowersInColdroom,
      icon: <FaWarehouse className="icon coldroom" />,
    },
    {
      title: "Low Stock Alerts",
      value: overview.lowStock,
      icon: <MdOutlineLowPriority className="icon alert" />,
    },
    {
      title: "Total Users",
      value: overview.users,
      icon: <FaUsers className="icon users" />,
    },
    {
      title: "Reviews",
      value: overview.reviews,
      icon: <MdRateReview className="icon reviews" />,
    },
  ];

  return (
    <div className="dashboard-page">
      <h2 className="overview-heading">
        <span className="overview-icon-title">
          <GiFlowerPot className="overview-title-icon" />
        </span>
        Business Overview
      </h2>

      {/* ============================ */}
      {/* Stats Grid */}
      {/* ============================ */}
      <div className="overview-grid">
        {cards.map((card, index) => (
          <div key={index} className="overview-card">
            <div className="overview-card-icon">{card.icon}</div>
            <p className="overview-value">{card.value ?? 0}</p>
            <h3>{card.title}</h3>
          </div>
        ))}
      </div>

      {/* ============================ */}
      {/* Summary Section */}
      {/* ============================ */}
      <section className="overview-summary">
        <h3>Quick Summary</h3>
        <ul>
          <li>
            Active Users <strong>{overview.activeUsers ?? 0}</strong>
          </li>
          <li>
            Harvest Batches <strong>{overview.harvestBatches ?? 0}</strong>
          </li>
          <li>
            Completed Orders <strong>{overview.completedOrders ?? 0}</strong>
          </li>
          <li>
            Stores Registered <strong>{overview.stores ?? 0}</strong>
          </li>
        </ul>
      </section>
    </div>
  );
}
