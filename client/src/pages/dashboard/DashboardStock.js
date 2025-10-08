import React, { useState, useEffect } from "react";
import "./Dashboard.css";

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

  const handleChange = (e) => {
    setStockForm({ ...stockForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/stock/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stockForm),
      });

      if (res.ok) {
        alert("✅ Stock added!");
        setStockForm({
          typeName: "",
          flowerName: "",
          harvestDate: "",
          quantity: "",
        });
        loadInventory();
      } else {
        alert("❌ Failed to add stock");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadInventory = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/stock/inventory`);
    const data = await res.json();
    setInventory(data);
  };

  const handleEdit = (id, currentQty) => {
    setEditingId(id);
    setEditQty(currentQty);
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/stock/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: editQty }),
      });
      if (res.ok) {
        alert("✅ Stock updated!");
        setEditingId(null);
        loadInventory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("🗑️ Delete this stock item?")) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/stock/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("🗑️ Stock deleted");
        loadInventory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  return (
    <div className="dashboard-stock">
      {/* Stock Input Form */}
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

      {/* Inventory Table */}
      <h2>Current Inventory</h2>
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
          {inventory.length > 0 ? (
            inventory.map((item) => {
              const flower = item.HarvestBatch?.Flower;
              return (
                <tr key={item.inventory_id}>
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
                        style={{ width: "80px" }}
                      />
                    ) : (
                      item.stemsInColdroom
                    )}
                  </td>
                  <td>
                    {editingId === item.inventory_id ? (
                      <button onClick={() => handleSaveEdit(item.inventory_id)}>
                        💾 Save
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleEdit(item.inventory_id, item.stemsInColdroom)
                        }
                      >
                        ✏️ Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.inventory_id)}
                      style={{ marginLeft: "8px" }}
                    >
                      🗑️ Delete
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
    </div>
  );
}

export default DashboardStock;
