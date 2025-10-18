import React, { useEffect, useState } from "react";
import axios from "axios";
import "../dashboard/Dashboard.css";

export default function DashboardStock() {
  const API_URL =
    import.meta.env?.VITE_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5001";

  const [flowers, setFlowers] = useState([]);
  const [types, setTypes] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [editingHarvest, setEditingHarvest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [flowerForm, setFlowerForm] = useState({
    type_id: "",
    variety: "",
    color: "",
    stem_length: "",
    shelf_life: "",
  });

  const [harvestForm, setHarvestForm] = useState({
    flower_id: "",
    totalStemsHarvested: "",
    notes: "",
    harvestDateTime: "",
  });

  // ===========================
  // 🧭 Fetch Stock Data
  // ===========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in again.");

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [typeRes, flowerRes, harvestRes] = await Promise.all([
          axios.get(`${API_URL}/api/dashboard/flower-types`, { headers }),
          axios.get(`${API_URL}/api/dashboard/flowers`, { headers }),
          axios.get(`${API_URL}/api/dashboard/harvests`, { headers }),
        ]);

        setTypes(typeRes.data || []);
        setFlowers(flowerRes.data || []);
        setHarvests(updateHarvestLifespans(harvestRes.data || []));
      } catch (err) {
        console.error("❌ Error fetching stock data:", err);
        setError(
          err.response?.status === 401
            ? "Session expired or unauthorized access."
            : "Failed to load stock data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  // ===========================
  // 🌸 Add Flower
  // ===========================
  const handleFlowerChange = (e) =>
    setFlowerForm({ ...flowerForm, [e.target.name]: e.target.value });

  const handleAddFlower = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      await axios.post(`${API_URL}/api/dashboard/flowers`, flowerForm, {
        headers,
      });

      alert("✅ Flower added successfully!");
      setFlowerForm({
        type_id: "",
        variety: "",
        color: "",
        stem_length: "",
        shelf_life: "",
      });

      const res = await axios.get(`${API_URL}/api/dashboard/flowers`, {
        headers,
      });
      setFlowers(res.data || []);
    } catch (err) {
      console.error("❌ Error adding flower:", err);
      alert("❌ Failed to add flower.");
    }
  };

  // ===========================
  // 🌾 Add Harvest
  // ===========================
  const handleHarvestChange = (e) =>
    setHarvestForm({ ...harvestForm, [e.target.name]: e.target.value });

  const handleAddHarvest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const payload = {
        flower_id: harvestForm.flower_id,
        totalStemsHarvested: harvestForm.totalStemsHarvested,
        harvestDateTime: harvestForm.harvestDateTime || new Date(),
        notes: harvestForm.notes || "",
        status: "InColdroom",
      };

      await axios.post(`${API_URL}/api/flowers/harvests`, payload, { headers });
      alert("✅ Harvest batch recorded!");

      setHarvestForm({
        flower_id: "",
        totalStemsHarvested: "",
        notes: "",
        harvestDateTime: "",
      });

      const res = await axios.get(`${API_URL}/api/dashboard/harvests`, {
        headers,
      });
      setHarvests(updateHarvestLifespans(res.data || []));
    } catch (err) {
      console.error("❌ Error adding harvest:", err);
      alert("❌ Failed to record harvest batch.");
    }
  };

  // ===========================
  // 🧮 Lifespan Calculation
  // ===========================
  const updateHarvestLifespans = (harvestList) => {
    const today = new Date();
    return harvestList.map((h) => {
      const harvestDate = new Date(h.harvestDateTime || h.createdAt);
      const daysElapsed = Math.floor(
        (today - harvestDate) / (1000 * 60 * 60 * 24)
      );

      const shelfLife =
        h.Flower?.shelf_life || h.Flower?.FlowerType?.default_shelf_life || 7;
      const daysLeft = shelfLife - daysElapsed;
      const status =
        daysLeft < 0
          ? "Discarded"
          : daysLeft <= 2
          ? "Expiring Soon"
          : "InColdroom";

      return { ...h, daysLeft, status };
    });
  };

  // ===========================
  // ✏️ Edit Harvest (Modal)
  // ===========================
  const handleEditHarvest = (harvest) => setEditingHarvest({ ...harvest });

  const handleEditChange = (e) =>
    setEditingHarvest({ ...editingHarvest, [e.target.name]: e.target.value });

  const handleSaveHarvest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const {
        harvestBatch_id,
        totalStemsHarvested,
        harvestDateTime,
        notes,
        status,
      } = editingHarvest;

      await axios.put(
        `${API_URL}/api/dashboard/harvests/${harvestBatch_id}`,
        { totalStemsHarvested, harvestDateTime, notes, status },
        { headers }
      );

      alert("✅ Harvest batch updated!");
      setEditingHarvest(null);

      const res = await axios.get(`${API_URL}/api/dashboard/harvests`, {
        headers,
      });
      setHarvests(updateHarvestLifespans(res.data || []));
    } catch (err) {
      console.error("❌ Error updating harvest:", err);
      alert("❌ Failed to update harvest.");
    }
  };

  // ===========================
  // 🎨 UI Helpers
  // ===========================
  const StatusBadge = ({ status }) => {
    let color = "#ccc";
    if (status === "InColdroom") color = "#5cb85c";
    else if (status === "Expiring Soon") color = "#f0ad4e";
    else if (status === "Discarded") color = "#d9534f";

    return (
      <span
        style={{
          backgroundColor: color,
          color: "white",
          padding: "4px 8px",
          borderRadius: "8px",
          fontSize: "0.85rem",
          fontWeight: 500,
        }}
      >
        {status}
      </span>
    );
  };

  // ===========================
  // 🧭 RENDER
  // ===========================
  if (loading) return <p>Loading stock data...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-stock">
      <h2 className="overview-heading">Stock Management</h2>

      {/* ============================ */}
      {/* ADD FLOWER FORM */}
      {/* ============================ */}
      <section className="dashboard-section">
        <h3>Add New Flower</h3>
        <form className="dashboard-form" onSubmit={handleAddFlower}>
          <select
            name="type_id"
            value={flowerForm.type_id}
            onChange={handleFlowerChange}
            required
          >
            <option value="">Select Flower Type</option>
            {types.map((t) => (
              <option key={t.type_id} value={t.type_id}>
                {t.type_name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="variety"
            placeholder="Variety (e.g. Red Naomi)"
            value={flowerForm.variety}
            onChange={handleFlowerChange}
            required
          />
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={flowerForm.color}
            onChange={handleFlowerChange}
          />
          <input
            type="number"
            name="stem_length"
            placeholder="Stem length (cm)"
            value={flowerForm.stem_length}
            onChange={handleFlowerChange}
          />
          <input
            type="number"
            name="shelf_life"
            placeholder="Shelf life (days)"
            value={flowerForm.shelf_life}
            onChange={handleFlowerChange}
          />
          <button type="submit" className="btn-primary">
            Add Flower
          </button>
        </form>
      </section>

      {/* ============================ */}
      {/* RECORD HARVEST */}
      {/* ============================ */}
      <section className="dashboard-section">
        <h3>Record Harvest Batch</h3>
        <form className="dashboard-form" onSubmit={handleAddHarvest}>
          <select
            name="flower_id"
            value={harvestForm.flower_id}
            onChange={handleHarvestChange}
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
            value={harvestForm.totalStemsHarvested}
            onChange={handleHarvestChange}
            required
          />
          <input
            type="date"
            name="harvestDateTime"
            value={harvestForm.harvestDateTime}
            onChange={handleHarvestChange}
          />
          <input
            type="text"
            name="notes"
            placeholder="Notes (optional)"
            value={harvestForm.notes}
            onChange={handleHarvestChange}
          />
          <button type="submit" className="btn-primary">
            Add Harvest Batch
          </button>
        </form>
      </section>

      {/* ============================ */}
      {/* RECENT HARVESTS */}
      {/* ============================ */}
      <section className="dashboard-section">
        <h3>Recent Harvest Batches</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Flower</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Days Left</th>
              <th>Harvest Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {harvests.map((h) => (
              <tr key={h.harvestBatch_id}>
                <td>{h.harvestBatch_id}</td>
                <td>{h.Flower?.variety || "-"}</td>
                <td>{h.Flower?.FlowerType?.type_name || "-"}</td>
                <td>{h.totalStemsHarvested}</td>
                <td>
                  <StatusBadge status={h.status} />
                </td>
                <td>{h.daysLeft >= 0 ? `${h.daysLeft} days` : "Expired"}</td>
                <td>
                  {new Date(
                    h.harvestDateTime || h.createdAt
                  ).toLocaleDateString()}
                </td>
                <td>
                  <button
                    onClick={() => handleEditHarvest(h)}
                    className="edit-btn"
                  >
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ============================ */}
      {/* EDIT HARVEST MODAL */}
      {/* ============================ */}
      {editingHarvest && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Edit Harvest Batch #{editingHarvest.harvestBatch_id}</h3>
            <form onSubmit={handleSaveHarvest}>
              <input
                type="number"
                name="totalStemsHarvested"
                value={editingHarvest.totalStemsHarvested}
                onChange={handleEditChange}
                placeholder="Total stems harvested"
              />
              <input
                type="date"
                name="harvestDateTime"
                value={
                  editingHarvest.harvestDateTime
                    ? editingHarvest.harvestDateTime.split("T")[0]
                    : ""
                }
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="notes"
                value={editingHarvest.notes || ""}
                onChange={handleEditChange}
                placeholder="Notes"
              />
              <select
                name="status"
                value={editingHarvest.status || ""}
                onChange={handleEditChange}
              >
                <option value="InColdroom">In Coldroom</option>
                <option value="Expiring Soon">Expiring Soon</option>
                <option value="Discarded">Discarded</option>
              </select>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingHarvest(null)}
                >
                  ✖ Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
