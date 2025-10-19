// ========================================
// 🌾 EverBloom — Dashboard Harvest Management (Final Layout Fix)
// ========================================
import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/api";
import "../../styles/dashboard/_core.css";
import "../../styles/dashboard/dashboardHarvest.css";

export default function DashboardHarvest() {
  const [flowers, setFlowers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    flower_id: "",
    totalStemsHarvested: "",
    harvestDateTime: "",
    notes: "",
  });

  // ===========================
  // 🌿 Helpers
  // ===========================
  const calcStatus = (batch) => {
    const harvestDate = new Date(batch.harvestDateTime || batch.createdAt);
    const today = new Date();
    const daysElapsed = Math.floor(
      (today - harvestDate) / (1000 * 60 * 60 * 24)
    );

    const shelfLife =
      batch?.Flower?.shelf_life ??
      batch?.Flower?.FlowerType?.default_shelf_life ??
      7;

    const daysLeft = shelfLife - daysElapsed;

    let status = "In Coldroom";
    if (!batch?.Inventory) status = "Not Added";
    if (daysLeft <= 2 && daysLeft >= 0) status = "Expiring Soon";
    if (daysLeft < 0) status = "Expired";

    return { daysLeft, status };
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      "In Coldroom": "#5cb85c",
      "Not Added": "#6c757d",
      "Expiring Soon": "#f0ad4e",
      Expired: "#d9534f",
    };
    return (
      <span
        style={{
          backgroundColor: colors[status] || "#bbb",
          color: "#fff",
          padding: "4px 8px",
          borderRadius: "8px",
          fontSize: "0.85rem",
          fontWeight: 600,
        }}
      >
        {status}
      </span>
    );
  };

  // ===========================
  // 🧭 Fetch Data
  // ===========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flowerRes, batchRes] = await Promise.all([
          api.get("/flowers"),
          api.get("/harvests"),
        ]);
        setFlowers(Array.isArray(flowerRes.data) ? flowerRes.data : []);
        setBatches(Array.isArray(batchRes.data) ? batchRes.data : []);
      } catch (err) {
        console.error("❌ Error fetching harvests:", err);
        setError("Failed to load harvest data.");
        setBatches([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const computedBatches = useMemo(() => {
    const safeList = Array.isArray(batches) ? batches : [];
    return safeList.map((b) => {
      const { daysLeft, status } = calcStatus(b);
      return { ...b, _daysLeft: daysLeft, _status: status };
    });
  }, [batches]);

  // ===========================
  // 🌾 Record Harvest
  // ===========================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const recordHarvest = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        flower_id: form.flower_id,
        totalStemsHarvested: Number(form.totalStemsHarvested),
        harvestDateTime: form.harvestDateTime || new Date(),
        notes: form.notes || "",
      };

      await api.post("/harvests", payload);
      alert("✅ Harvest recorded successfully!");

      setForm({
        flower_id: "",
        totalStemsHarvested: "",
        harvestDateTime: "",
        notes: "",
      });

      const refresh = await api.get("/harvests");
      setBatches(Array.isArray(refresh.data) ? refresh.data : []);
    } catch (err) {
      console.error("❌ Error recording harvest:", err);
      alert("❌ Failed to record harvest.");
    }
  };

  const addToColdroom = async (batch) => {
    try {
      await api.post("/inventory", {
        harvestBatch_id: batch.harvestBatch_id,
        stemsInColdroom: batch.totalStemsHarvested,
      });

      const refresh = await api.get("/harvests");
      setBatches(Array.isArray(refresh.data) ? refresh.data : []);
      alert("❄️ Harvest added to coldroom!");
    } catch (err) {
      console.error("❌ Error adding to coldroom:", err);
      alert("❌ Could not add batch to coldroom.");
    }
  };

  // ===========================
  // 🧭 Render
  // ===========================
  if (loading) return <p>Loading harvest data...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-stock">
      <h2 className="overview-heading">Record & Manage Harvests</h2>

      {/* Add New Harvest Header */}
      <h3 className="section-heading">Add New Harvest Batch</h3>
      <section className="dashboard-section">
        <form className="dashboard-form" onSubmit={recordHarvest}>
          <select
            name="flower_id"
            value={form.flower_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Flower</option>
            {flowers.map((f) => (
              <option key={f.flower_id} value={f.flower_id}>
                {f.FlowerType?.type_name} — {f.variety} ({f.color})
              </option>
            ))}
          </select>

          <input
            type="number"
            name="totalStemsHarvested"
            placeholder="Total stems harvested"
            value={form.totalStemsHarvested}
            onChange={handleChange}
            required
            min="1"
          />

          <input
            type="date"
            name="harvestDateTime"
            value={form.harvestDateTime}
            onChange={handleChange}
          />

          <input
            type="text"
            name="notes"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={handleChange}
          />

          <button type="submit" className="btn-primary">
            Record Harvest
          </button>
        </form>
      </section>

      {/* Recent Harvest Header */}
      <h3 className="section-heading">Recent Harvests</h3>
      <section className="dashboard-section">
        {computedBatches.length === 0 ? (
          <p>No harvest batches recorded yet.</p>
        ) : (
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
                <th>Coldroom</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {computedBatches.map((b) => (
                <tr key={b.harvestBatch_id}>
                  <td>{b.harvestBatch_id}</td>
                  <td>{b.Flower?.FlowerType?.type_name || "-"}</td>
                  <td>{b.Flower?.variety || "-"}</td>
                  <td>{b.totalStemsHarvested}</td>
                  <td>
                    {b._daysLeft >= 0 ? `${b._daysLeft} days` : "Expired"}
                  </td>
                  <td>
                    <StatusBadge status={b._status} />
                  </td>
                  <td>
                    {new Date(
                      b.harvestDateTime || b.createdAt
                    ).toLocaleDateString()}
                  </td>
                  <td>{b.Inventory ? b.Inventory.stemsInColdroom : "-"}</td>
                  <td>
                    {!b.Inventory && (
                      <button
                        className="btn-primary"
                        onClick={() => addToColdroom(b)}
                      >
                        Add to Coldroom
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
