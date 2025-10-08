import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { Toaster, toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function DashboardStock() {
  const [stockForm, setStockForm] = useState({
    typeName: "",
    flowerName: "",
    harvestDate: "",
    quantity: "",
  });
  const [inventory, setInventory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const API = process.env.REACT_APP_API_URL;

  const handleChange = (e) =>
    setStockForm({ ...stockForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/stock/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stockForm),
      });
      if (res.ok) {
        toast.success("🌸 Stock added successfully!");
        setStockForm({
          typeName: "",
          flowerName: "",
          harvestDate: "",
          quantity: "",
        });
        loadInventory();
      } else {
        const err = await res.text();
        toast.error(`❌ Failed to add stock: ${err}`);
      }
    } catch (error) {
      toast.error("❌ Network error while adding stock");
    }
  };

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/stock/inventory`);
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      toast.error("❌ Could not load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id, currentQty) => {
    setEditingId(id);
    setEditQty(currentQty);
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`${API}/stock/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: editQty }),
      });
      if (res.ok) {
        toast.success("✅ Stock updated");
        setEditingId(null);
        loadInventory();
      } else toast.error("❌ Failed to update");
    } catch {
      toast.error("❌ Error updating stock");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("🗑️ Delete this stock item?")) return;
    try {
      const res = await fetch(`${API}/stock/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("🗑️ Deleted successfully");
        loadInventory();
      } else toast.error("❌ Failed to delete");
    } catch {
      toast.error("❌ Error deleting stock");
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredInventory = inventory.filter((item) => {
    const flower = item.HarvestBatch?.Flower;
    const type = flower?.FlowerType?.type_name || "";
    const variety = flower?.variety || "";
    return (
      type.toLowerCase().includes(search.toLowerCase()) ||
      variety.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalStock = inventory.reduce(
    (sum, item) => sum + (item.stemsInColdroom || 0),
    0
  );
  const lowStock = inventory.filter((i) => i.stemsInColdroom < 50).length;

  return (
    <div className="dashboard-stock">
      <Toaster position="top-right" />

      {/* Summary Header */}
      <div className="stock-summary">
        <div className="summary-card">
          <h3>🌼 Total Stock</h3>
          <p>{totalStock}</p>
        </div>
        <div className="summary-card warning">
          <h3>⚠️ Low Stock</h3>
          <p>{lowStock}</p>
        </div>
      </div>

      {/* Add Stock Form */}
      <form className="stock-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="typeName"
          placeholder="Flower Type (e.g. Roses)"
          value={stockForm.typeName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="flowerName"
          placeholder="Flower Name (e.g. Red Rose)"
          value={stockForm.flowerName}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="harvestDate"
          value={stockForm.harvestDate}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={stockForm.quantity}
          onChange={handleChange}
          required
        />
        <button type="submit">➕ Add Stock</button>
      </form>

      {/* Search */}
      <input
        className="stock-search"
        type="text"
        placeholder="🔍 Search by flower or type..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Inventory Table */}
      <h2>Current Inventory</h2>
      {loading ? (
        <div className="loader">
          <ClipLoader size={40} color="#900210" />
        </div>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Flower</th>
              <th>Type</th>
              <th>Harvest Date</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => {
                const flower = item.HarvestBatch?.Flower;
                const qty = item.stemsInColdroom;
                return (
                  <tr
                    key={item.inventory_id}
                    className={qty < 50 ? "low-stock" : ""}
                  >
                    <td>{item.inventory_id}</td>
                    <td>{flower?.variety || "-"}</td>
                    <td>{flower?.FlowerType?.type_name || "-"}</td>
                    <td>
                      {item.HarvestBatch?.harvestDateTime
                        ? new Date(
                            item.HarvestBatch.harvestDateTime
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      {editingId === item.inventory_id ? (
                        <input
                          type="number"
                          value={editQty}
                          onChange={(e) => setEditQty(e.target.value)}
                        />
                      ) : (
                        qty
                      )}
                    </td>
                    <td>
                      {editingId === item.inventory_id ? (
                        <button
                          onClick={() => handleSaveEdit(item.inventory_id)}
                        >
                          💾 Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(item.inventory_id, qty)}
                        >
                          ✏️ Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.inventory_id)}
                        style={{ marginLeft: "8px" }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6">No stock available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DashboardStock;
