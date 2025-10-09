import React, { useEffect, useState } from "react";
import axios from "axios";
import "../dashboard/Dashboard.css";

export default function DashboardInventory() {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const [inventory, setInventory] = useState([]);
  const [inventoryForm, setInventoryForm] = useState({
    harvestBatch_id: "",
    stemsInColdroom: "",
  });
  const [loading, setLoading] = useState(true);

  // ===========================
  // 🧭 Fetch current inventory data
  // ===========================
  const loadInventory = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/flowers/inventory`);
      setInventory(res.data || []);
    } catch (error) {
      console.error("Error loading inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // ===========================
  // ❄️ Update Coldroom Inventory
  // ===========================
  const handleChange = (e) => {
    setInventoryForm({ ...inventoryForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${API_URL}/api/flowers/inventory/${inventoryForm.harvestBatch_id}`,
        { stemsInColdroom: inventoryForm.stemsInColdroom }
      );
      alert("✅ Coldroom inventory updated!");
      setInventoryForm({ harvestBatch_id: "", stemsInColdroom: "" });
      loadInventory();
    } catch (err) {
      console.error("Error updating inventory:", err);
      alert("❌ Failed to update inventory.");
    }
  };

  if (loading) return <p className="loading">Loading inventory...</p>;

  return (
    <div className="dashboard-inventory">
      <h2 className="overview-heading">Coldroom Inventory</h2>

      {/* ============================ */}
      {/* 1️⃣ UPDATE INVENTORY FORM */}
      {/* ============================ */}
      <section className="dashboard-section">
        <h3>Update Coldroom Inventory</h3>
        <form className="dashboard-form" onSubmit={handleUpdate}>
          <select
            name="harvestBatch_id"
            value={inventoryForm.harvestBatch_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Harvest Batch</option>
            {inventory.map((i) => (
              <option key={i.harvestBatch_id} value={i.harvestBatch_id}>
                Batch #{i.harvestBatch_id} — {i.HarvestBatch?.Flower?.variety} (
                {i.HarvestBatch?.Flower?.color})
              </option>
            ))}
          </select>
          <input
            type="number"
            name="stemsInColdroom"
            placeholder="New stem count"
            value={inventoryForm.stemsInColdroom}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary">
            Update Inventory
          </button>
        </form>
      </section>

      <hr />

      {/* ============================ */}
      {/* 2️⃣ CURRENT INVENTORY TABLE */}
      {/* ============================ */}
      <section className="dashboard-section">
        <h3>Current Coldroom Inventory</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Flower</th>
              <th>Color</th>
              <th>Stems in Coldroom</th>
              <th>Harvest Date</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length > 0 ? (
              inventory.map((inv) => (
                <tr key={inv.harvestBatch_id}>
                  <td>{inv.harvestBatch_id}</td>
                  <td>{inv.HarvestBatch?.Flower?.variety || "-"}</td>
                  <td>{inv.HarvestBatch?.Flower?.color || "-"}</td>
                  <td>{inv.stemsInColdroom}</td>
                  <td>
                    {inv.HarvestBatch?.harvestDateTime
                      ? new Date(
                          inv.HarvestBatch.harvestDateTime
                        ).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {new Date(inv.updatedAt).toLocaleDateString()}{" "}
                    {new Date(inv.updatedAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No inventory data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
