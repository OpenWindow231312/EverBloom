import React, { useEffect, useState } from "react";
import axios from "axios";
import "../dashboard/Dashboard.css";

export default function DashboardInventory() {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const [inventory, setInventory] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [inventoryForm, setInventoryForm] = useState({
    harvestBatch_id: "",
    stemsInColdroom: "",
  });
  const [addForm, setAddForm] = useState({
    flower_id: "",
    stemsInColdroom: "",
    status: "InColdroom",
  });
  const [loading, setLoading] = useState(true);

  // ===========================
  // 🧭 Fetch flowers & inventory
  // ===========================
  const loadInventory = async () => {
    try {
      const [inventoryRes, flowerRes] = await Promise.all([
        axios.get(`${API_URL}/api/flowers/inventory`),
        axios.get(`${API_URL}/api/dashboard/flower-types`),
      ]);
      setInventory(inventoryRes.data || []);
      setFlowers(flowerRes.data || []);
    } catch (error) {
      console.error("Error loading inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [API_URL]);

  // ===========================
  // 🧩 Handle Inputs
  // ===========================
  const handleChange = (e) => {
    setInventoryForm({ ...inventoryForm, [e.target.name]: e.target.value });
  };

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  // ===========================
  // ➕ Add Inventory
  // ===========================
  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/stock/add`, addForm);
      alert("✅ Inventory added successfully!");
      setAddForm({ flower_id: "", stemsInColdroom: "", status: "InColdroom" });
      loadInventory();
    } catch (err) {
      console.error("Error adding inventory:", err);
      alert("❌ Failed to add inventory.");
    }
  };

  // ===========================
  // ❄️ Update Coldroom Inventory
  // ===========================
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

  // ===========================
  // 🗑️ Delete Inventory Entry
  // ===========================
  const handleDelete = async (harvestBatch_id) => {
    if (!window.confirm("Are you sure you want to delete this inventory item?"))
      return;
    try {
      await axios.delete(`${API_URL}/api/stock/${harvestBatch_id}`);
      alert("🗑️ Inventory item deleted!");
      loadInventory();
    } catch (err) {
      console.error("Error deleting inventory:", err);
      alert("❌ Failed to delete inventory item.");
    }
  };

  if (loading) return <p className="loading">Loading inventory...</p>;

  return (
    <div className="dashboard-inventory">
      <h2 className="overview-heading">Coldroom Inventory</h2>

      {/* ============================ */}
      {/* 1️⃣ ADD INVENTORY FORM */}
      {/* ============================ */}
      <section className="dashboard-section">
        <h3>Add New Inventory Batch</h3>
        <form className="dashboard-form" onSubmit={handleAddInventory}>
          <select
            name="flower_id"
            value={addForm.flower_id}
            onChange={handleAddChange}
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
            name="stemsInColdroom"
            placeholder="Stems in coldroom"
            value={addForm.stemsInColdroom}
            onChange={handleAddChange}
            required
          />
          <select
            name="status"
            value={addForm.status}
            onChange={handleAddChange}
            required
          >
            <option value="InColdroom">In Coldroom</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold">Sold</option>
            <option value="Discarded">Discarded</option>
          </select>
          <button type="submit" className="btn-primary">
            Add Inventory
          </button>
        </form>
      </section>

      <hr />

      {/* ============================ */}
      {/* 2️⃣ UPDATE INVENTORY FORM */}
      {/* ============================ */}
      <section className="dashboard-section">
        <h3>Update Existing Inventory</h3>
        <form className="dashboard-form" onSubmit={handleUpdate}>
          <select
            name="harvestBatch_id"
            value={inventoryForm.harvestBatch_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Batch</option>
            {inventory.map((i) => (
              <option key={i.harvestBatch_id} value={i.harvestBatch_id}>
                Batch #{i.harvestBatch_id} —{" "}
                {i.HarvestBatch?.Flower?.variety || "-"}
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
      {/* 3️⃣ CURRENT INVENTORY TABLE */}
      {/* ============================ */}
      <section className="dashboard-section">
        <h3>Current Inventory Overview</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Flower</th>
              <th>Color</th>
              <th>Stems in Coldroom</th>
              <th>Status</th>
              <th>Harvest Date</th>
              <th>Last Updated</th>
              <th>Action</th>
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
                  <td>{inv.HarvestBatch?.status || "InColdroom"}</td>
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
                  <td>
                    <button
                      onClick={() => handleDelete(inv.harvestBatch_id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No inventory data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
