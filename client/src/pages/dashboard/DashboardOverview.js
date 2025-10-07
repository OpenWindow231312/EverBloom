import React from "react";
import "../Dashboard.css";

function DashboardOverview() {
  return (
    <div className="overview-cards">
      <div className="card">🌸 Total Flowers: 1200</div>
      <div className="card">📦 Active Orders: 15</div>
      <div className="card">❄️ Coldroom Reservations: 5</div>
      <div className="card">🗑️ Discarded Stock: 50</div>
    </div>
  );
}

export default DashboardOverview;
