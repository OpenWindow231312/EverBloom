import React, { useEffect, useState } from "react";
import axios from "axios";
import "../dashboard/Dashboard.css";

export default function DashboardStock() {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const [flowers, setFlowers] = useState([]);
  const [types, setTypes] = useState([]);
  const [harvests, setHarvests] = useState([]);
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
  });
  const [loading, setLoading] = useState(true);

  // ===========================
  // 🧭 Fetch all stock-related data
  // ===========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typeRes, flowerRes, harvestRes] = await Promise.all([
          axios.get(`${API_URL}/api/flowers/types`),
          axios.get(`${API_URL}/api/dashboard/flowers`),
          axios.get(`${API_URL}/api/dashboard/harvests`),
        ]);
        setTypes(typeRes.data || []);
        setFlowers(flowerRes.data || []);
        setHarvests(harvestRes.data || []);
      } catch (err) {
        console.error("Error fetching stock data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  // ===========================
  // 🌸 ADD FLOWER FORM
  // ===========================
  const handleFlowerChange = (e) => {
    setFlowerForm({ ...flowerForm, [e.target.name]: e.target.value });
  };

  const handleAddFlower = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/dashboard/flowers`, flowerForm);
      alert("✅ Flower added successfully!");
      setFlowerForm({
        type_id: "",
        variety: "",
        color: "",
        stem_length: "",
        shelf_life: "",
      });
      const res = await axios.get(`${API_URL}/api/dashboard/flowers`);
      setFlowers(res.data || []);
    } catch (err) {
      console.error("Error adding flower:", err);
      alert("❌ Failed to add flower.");
    }
  };

  // ===========================
  // 🌾 ADD HARVEST FORM
  // ===========================
  const handleHarvestChange = (e) => {
    setHarvestForm({ ...harvestForm, [e.target.name]: e.target.value });
  };

  const handleAddHarvest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/flowers/harvests`, harvestForm);
      alert("✅ Harvest batch recorded!");
      setHarvestForm({ flower_id: "", totalStemsHarvested: "", notes: "" });

      const res = await axios.get(`${API_URL}/api/dashboard/harvests`);
      setHarvests(res.data || []);
    } catch (err) {
      console.error("Error adding harvest:", err);
      alert("❌ Failed to record harvest batch.");
    }
  };

  if (loading) return <p>Loading stock data...</p>;

  return (
    <div className="dashboard-stock">
      <h2 className="overview-heading">Stock Management</h2>

      {/* ============================ */}
      {/* 1️⃣ ADD FLOWER SECTION */}
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
            ➕ Add Flower
          </button>
        </form>
      </section>

      {/* ============================ */}
      {/* 2️⃣ HARVEST SECTION */}
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
                {f.variety} ({f.color})
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
            type="text"
            name="notes"
            placeholder="Notes (optional)"
            value={harvestForm.notes}
            onChange={handleHarvestChange}
          />
          <button type="submit" className="btn-primary">
            🌾 Add Harvest Batch
          </button>
        </form>
      </section>

      {/* ============================ */}
      {/* 3️⃣ CURRENT FLOWERS & HARVESTS */}
      {/* ============================ */}
      <section className="dashboard-section">
        <h3>Current Flowers</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Variety</th>
              <th>Color</th>
              <th>Stem</th>
              <th>Life</th>
            </tr>
          </thead>
          <tbody>
            {flowers.map((f) => (
              <tr key={f.flower_id}>
                <td>{f.flower_id}</td>
                <td>{f.FlowerType?.type_name}</td>
                <td>{f.variety}</td>
                <td>{f.color}</td>
                <td>{f.stem_length} cm</td>
                <td>{f.shelf_life} days</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Recent Harvest Batches</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Flower</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {harvests.map((h) => (
              <tr key={h.harvestBatch_id}>
                <td>{h.harvestBatch_id}</td>
                <td>{h.Flower?.variety}</td>
                <td>{h.totalStemsHarvested}</td>
                <td>{h.status}</td>
                <td>{new Date(h.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
