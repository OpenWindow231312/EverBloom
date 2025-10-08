import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { getAllHarvests } from "../../api/api";

export default function DashboardInventory() {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHarvests = async () => {
    try {
      const res = await getAllHarvests();
      setHarvests(res.data);
    } catch (error) {
      console.error("Error loading inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHarvests();
  }, []);

  if (loading) return <p className="loading">Loading inventory...</p>;

  return (
    <div className="dashboard-inventory">
      <h2>Inventory Overview</h2>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Batch ID</th>
            <th>Flower</th>
            <th>Color</th>
            <th>Stems in Coldroom</th>
            <th>Harvest Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {harvests.length > 0 ? (
            harvests.map((batch) => (
              <tr key={batch.harvestBatch_id}>
                <td>{batch.harvestBatch_id}</td>
                <td>{batch.Flower?.variety || "N/A"}</td>
                <td>{batch.Flower?.color || "-"}</td>
                <td>
                  {batch.Inventory
                    ? batch.Inventory.stemsInColdroom
                    : "Not tracked"}
                </td>
                <td>
                  {batch.harvestDateTime
                    ? new Date(batch.harvestDateTime).toLocaleDateString()
                    : "-"}
                </td>
                <td>{batch.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No harvest data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
