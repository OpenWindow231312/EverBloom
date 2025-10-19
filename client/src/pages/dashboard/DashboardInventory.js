import React, { useEffect, useMemo, useState } from "react";
import { getInventory, getDiscards, discardFromBatch } from "../../api/api";
import "../../styles/dashboard/_core.css";
import "../../styles/dashboard/dashboardInventory.css";

export default function DashboardInventory() {
  const [inventory, setInventory] = useState([]);
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showArchive, setShowArchive] = useState(false);

  // Modal state
  const [discardOpen, setDiscardOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [discardForm, setDiscardForm] = useState({
    quantityDiscarded: "",
    reason: "",
  });

  // ============= Fetch =============
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [invRes, discRes] = await Promise.all([
        getInventory(),
        getDiscards(),
      ]);
      setInventory(invRes.data || []);
      setArchive(discRes.data || []);
      setError("");
    } catch (e) {
      console.error(e);
      setError("Failed to load inventory data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ============= Freshness =============
  const calcFreshness = (row) => {
    const hb = row?.HarvestBatch;
    const flower = hb?.Flower;
    const type = flower?.FlowerType;

    const harvestDate = hb?.harvestDateTime
      ? new Date(hb.harvestDateTime)
      : new Date(row.createdAt);
    const shelfLife = flower?.shelf_life ?? type?.default_shelf_life ?? 7;

    const today = new Date();
    const daysElapsed = Math.floor(
      (today - harvestDate) / (1000 * 60 * 60 * 24)
    );
    const daysLeft = shelfLife - daysElapsed;

    let status = "Fresh";
    if (daysLeft <= 2 && daysLeft > 0) status = "Expiring Soon";
    if (daysLeft <= 0) status = "Expired";

    const expiry = new Date(
      harvestDate.getTime() + shelfLife * 24 * 60 * 60 * 1000
    );
    return { status, daysLeft, expiry };
  };

  const decoratedInventory = useMemo(
    () =>
      (inventory || []).map((row) => {
        const f = calcFreshness(row);
        return { ...row, _fresh: f };
      }),
    [inventory]
  );

  // ============= Modal handlers =============
  const openDiscard = (row) => {
    setSelectedRow(row);
    setDiscardForm({
      quantityDiscarded: Math.min(
        row.stemsInColdroom,
        Math.max(0, row._fresh.daysLeft <= 0 ? row.stemsInColdroom : 0)
      ),
      reason: row._fresh.status === "Expired" ? "Expired" : "",
    });
    setDiscardOpen(true);
  };

  const closeDiscard = () => {
    setDiscardOpen(false);
    setSelectedRow(null);
    setDiscardForm({ quantityDiscarded: "", reason: "" });
  };

  const submitDiscard = async (e) => {
    e.preventDefault();
    if (!selectedRow) return;

    const qty = Number(discardForm.quantityDiscarded || 0);
    if (qty <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }
    if (qty > selectedRow.stemsInColdroom) {
      alert("Quantity exceeds stems in coldroom.");
      return;
    }

    try {
      await discardFromBatch(selectedRow.harvestBatch_id, {
        quantityDiscarded: qty,
        reason: discardForm.reason || null,
      });
      closeDiscard();
      await fetchAll();
    } catch (e) {
      console.error("discard submit error:", e);
      alert(e?.response?.data?.error || "Failed to discard stems.");
    }
  };

  // ============= UI helpers =============
  const StatusBadge = ({ value }) => {
    const map = {
      Fresh: "badge badge--green",
      "Expiring Soon": "badge badge--amber",
      Expired: "badge badge--red",
    };
    return <span className={map[value] || "badge"}>{value}</span>;
  };

  if (loading) return <div className="loading">Loading inventory…</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="inventory-page">
      <div className="page-header">
        <h2>Coldroom Inventory</h2>
        <div className="page-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowArchive((v) => !v)}
          >
            {showArchive ? "Hide Archive" : "Show Archive"}
          </button>
        </div>
      </div>

      {/* Active Inventory */}
      <section className="card">
        <h3>Current Flowers in Coldroom</h3>

        <div className="table-wrapper">
          <table className="table table-sticky">
            <thead>
              <tr>
                <th>Batch</th>
                <th>Flower</th>
                <th>Variety</th>
                <th>Color</th>
                <th>Stem Length</th>
                <th>Qty</th>
                <th>Days Left</th>
                <th>Status</th>
                <th>Harvested</th>
                <th>Expiry</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {decoratedInventory.length === 0 ? (
                <tr>
                  <td colSpan={12} className="no-data">
                    No inventory found.
                  </td>
                </tr>
              ) : (
                decoratedInventory.map((row) => {
                  const hb = row?.HarvestBatch;
                  const flower = hb?.Flower;
                  const type = flower?.FlowerType;
                  return (
                    <tr
                      key={row.inventory_id}
                      className={
                        row._fresh.status === "Expired" ? "row-expired" : ""
                      }
                    >
                      <td>{row.harvestBatch_id}</td>
                      <td>{type?.type_name || "-"}</td>
                      <td>{flower?.variety || "-"}</td>
                      <td>{flower?.color || "-"}</td>
                      <td>{flower?.stem_length || "-"}</td>
                      <td>{row.stemsInColdroom}</td>
                      <td>
                        {row._fresh.daysLeft > 0
                          ? `${row._fresh.daysLeft}d`
                          : "Expired"}
                      </td>
                      <td>
                        <StatusBadge value={row._fresh.status} />
                      </td>
                      <td>
                        {hb?.harvestDateTime
                          ? new Date(hb.harvestDateTime).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        {row._fresh.expiry
                          ? new Date(row._fresh.expiry).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        {row.lastUpdated
                          ? new Date(row.lastUpdated).toLocaleString()
                          : "-"}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => openDiscard(row)}
                          disabled={row.stemsInColdroom <= 0}
                        >
                          Discard
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Archive */}
      {showArchive && (
        <section className="card">
          <h3>Past / Discarded Batches</h3>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Batch</th>
                  <th>Flower</th>
                  <th>Variety</th>
                  <th>Qty Discarded</th>
                  <th>Reason</th>
                  <th>Discarded On</th>
                </tr>
              </thead>
              <tbody>
                {archive.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="no-data">
                      No archived batches.
                    </td>
                  </tr>
                ) : (
                  archive.map((a) => {
                    const hb = a?.HarvestBatch;
                    const flower = hb?.Flower;
                    const type = flower?.FlowerType;
                    return (
                      <tr key={a.discard_id}>
                        <td>{a.harvestBatch_id}</td>
                        <td>{type?.type_name || "-"}</td>
                        <td>{flower?.variety || "-"}</td>
                        <td>{a.quantityDiscarded}</td>
                        <td>{a.reason || "-"}</td>
                        <td>
                          {a.discardDateTime
                            ? new Date(a.discardDateTime).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Discard Modal */}
      {discardOpen && selectedRow && (
        <div className="modal-backdrop" onClick={closeDiscard}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Discard from Batch #{selectedRow.harvestBatch_id}</h4>
              <button
                className="icon-btn"
                onClick={closeDiscard}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-control">
                  <label>Available</label>
                  <input value={selectedRow.stemsInColdroom} disabled />
                </div>
                <div className="form-control">
                  <label>Quantity to discard</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedRow.stemsInColdroom}
                    value={discardForm.quantityDiscarded}
                    onChange={(e) =>
                      setDiscardForm((f) => ({
                        ...f,
                        quantityDiscarded: e.target.value,
                      }))
                    }
                    placeholder="e.g. 10"
                  />
                </div>
                <div className="form-control form-control--full">
                  <label>Reason (optional)</label>
                  <input
                    type="text"
                    value={discardForm.reason}
                    onChange={(e) =>
                      setDiscardForm((f) => ({ ...f, reason: e.target.value }))
                    }
                    placeholder="Expired / Damaged / Trim waste ..."
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeDiscard}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={submitDiscard}>
                Confirm Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
