import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/api";
import "../../styles/dashboard/_core.css";
import "../../styles/dashboard/dashboardInventory.css";

export default function DashboardInventory() {
  const [inventory, setInventory] = useState([]);
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showArchive, setShowArchive] = useState(false);

  // ===========================
  // 🌿 Helpers: calculate freshness
  // ===========================
  const calcStatus = (item) => {
    const harvestDate = new Date(item.harvest_date || item.createdAt);
    const today = new Date();
    const daysElapsed = Math.floor(
      (today - harvestDate) / (1000 * 60 * 60 * 24)
    );
    const shelfLife =
      item.Flower?.shelf_life ??
      item.Flower?.FlowerType?.default_shelf_life ??
      7;

    const daysLeft = shelfLife - daysElapsed;
    let status = "Fresh";
    if (daysLeft <= 2 && daysLeft > 0) status = "Expiring Soon";
    if (daysLeft <= 0) status = "Expired";
    return { daysLeft, status };
  };

  const StatusBadge = ({ status }) => {
    const map = {
      Fresh: "#5cb85c",
      "Expiring Soon": "#f0ad4e",
      Expired: "#d9534f",
    };
    return (
      <span
        style={{
          background: map[status] || "#ccc",
          color: "#fff",
          padding: "4px 8px",
          borderRadius: "8px",
          fontSize: ".85rem",
          fontWeight: 600,
        }}
      >
        {status}
      </span>
    );
  };

  // ===========================
  // 🧭 Fetch Coldroom + Archive
  // ===========================
  useEffect(() => {
    const run = async () => {
      try {
        const [activeRes, archiveRes] = await Promise.all([
          api.get("/inventory"),
          api.get("/discards"),
        ]);
        setInventory(activeRes.data || []);
        setArchive(archiveRes.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load coldroom data.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const computedInventory = useMemo(
    () =>
      inventory.map((i) => {
        const { daysLeft, status } = calcStatus(i);
        return { ...i, _daysLeft: daysLeft, _status: status };
      }),
    [inventory]
  );

  // ===========================
  // ❌ Discard expired batch manually
  // ===========================
  const discardBatch = async (item) => {
    if (!window.confirm("Move this batch to archive?")) return;
    try {
      await api.post("/discards", {
        harvestBatch_id: item.harvestBatch_id,
        quantityDiscarded: item.stemsInColdroom,
        reason: "Manual discard",
      });
      const refresh = await api.get("/inventory");
      setInventory(refresh.data || []);
    } catch (err) {
      console.error("❌ Error discarding batch:", err);
      alert("Failed to archive batch.");
    }
  };

  // ===========================
  // 🧭 Render
  // ===========================
  if (loading) return <p>Loading coldroom inventory...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-stock">
      <h2 className="overview-heading">❄️ Coldroom Inventory</h2>

      {/* ============================ */}
      {/* Active Inventory Table */}
      {/* ============================ */}
      <section className="dashboard-section">
        <h3>Current Flowers in Coldroom</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Flower</th>
              <th>Variety</th>
              <th>Quantity</th>
              <th>Days Left</th>
              <th>Status</th>
              <th>Harvest Date</th>
              <th>Expiry Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {computedInventory.map((i) => (
              <tr
                key={i.inventory_id}
                className={i._status === "Expired" ? "row-discarded" : ""}
              >
                <td>{i.harvestBatch_id}</td>
                <td>{i.Flower?.FlowerType?.type_name || "-"}</td>
                <td>{i.Flower?.variety || "-"}</td>
                <td>{i.stemsInColdroom}</td>
                <td>{i._daysLeft >= 0 ? `${i._daysLeft} days` : "Expired"}</td>
                <td>
                  <StatusBadge status={i._status} />
                </td>
                <td>
                  {new Date(i.harvest_date || i.createdAt).toLocaleDateString()}
                </td>
                <td>
                  {i.expiryDate
                    ? new Date(i.expiryDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  {i._status === "Expired" && (
                    <button
                      onClick={() => discardBatch(i)}
                      className="delete-btn"
                    >
                      🗑 Discard
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ============================ */}
      {/* Archive Toggle */}
      {/* ============================ */}
      <section className="dashboard-section">
        <button
          className="btn-secondary"
          onClick={() => setShowArchive(!showArchive)}
        >
          {showArchive ? "▲ Hide Archive" : "▼ Show Archived Batches"}
        </button>

        {showArchive && (
          <div className="archive-table-wrapper">
            <h3>Past / Discarded Batches</h3>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Flower</th>
                  <th>Variety</th>
                  <th>Quantity</th>
                  <th>Discard Reason</th>
                  <th>Discarded On</th>
                </tr>
              </thead>
              <tbody>
                {archive.length === 0 && (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No archived batches.
                    </td>
                  </tr>
                )}
                {archive.map((a) => (
                  <tr key={a.discard_id}>
                    <td>{a.harvestBatch_id}</td>
                    <td>
                      {a.HarvestBatch?.Flower?.FlowerType?.type_name || "-"}
                    </td>
                    <td>{a.HarvestBatch?.Flower?.variety || "-"}</td>
                    <td>{a.quantityDiscarded}</td>
                    <td>{a.reason}</td>
                    <td>
                      {new Date(
                        a.movedToArchiveDate || a.createdAt
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
