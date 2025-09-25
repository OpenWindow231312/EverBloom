// src/pages/DashboardStock.js
import React, { useState, useEffect } from "react";

function DashboardStock() {
  const [stockForm, setStockForm] = useState({
    typeName: "",
    flowerName: "",
    harvestDate: "",
    quantity: "",
  });
  const [inventory, setInventory] = useState([]);

  const handleChange = (e) => {
    setStockForm({ ...stockForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5001/api/stock/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(stockForm),
    });

    if (res.ok) {
      alert("✅ Stock added successfully!");
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
  };

  const loadInventory = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5001/api/stock/inventory", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setInventory(data);
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
            <th>Flower</th>
            <th>Type</th>
            <th>Harvest Date</th>
            <th>Available Qty</th>
          </tr>
        </thead>
        <tbody>
          {inventory.length > 0 ? (
            inventory.map((item) => (
              <tr key={item.inventory_id}>
                <td>{item.flowerName}</td>
                <td>{item.typeName}</td>
                <td>{item.harvestDate}</td>
                <td>{item.availableQuantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No stock available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardStock;
