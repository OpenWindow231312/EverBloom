// ========================================
// 🌸 EverBloom — Dashboard Stock Management (Clean Layout)
// ========================================
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "../../styles/dashboard/_core.css";
import "../../styles/dashboard/dashboardStock.css";
import { GiFlowerPot } from "react-icons/gi";
import { FaPlus, FaEdit, FaTrashAlt, FaTimes } from "react-icons/fa";

export default function DashboardStock() {
  const [flowers, setFlowers] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingFlower, setEditingFlower] = useState(null);

  // 🌿 Filters & Pagination
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 🌸 Form State
  const [flowerForm, setFlowerForm] = useState({
    type_id: "",
    variety: "",
    color: "",
    stem_length: "",
    shelf_life: "",
    price_per_stem: "",
    sale_price_per_stem: "",
    description: "",
    image_url: "",
  });

  // 🧭 Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, flowersRes] = await Promise.all([
          api.get("/flowers/types"),
          api.get("/flowers"),
        ]);
        setTypes(typesRes.data || []);
        setFlowers(flowersRes.data || []);
      } catch (err) {
        console.error("❌ Error loading stock data:", err);
        setError("Failed to load stock data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🌸 Add Flower
  const handleFlowerChange = (e) => {
    setFlowerForm({ ...flowerForm, [e.target.name]: e.target.value });
  };

  const handleAddFlower = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...flowerForm,
        type_id: Number(flowerForm.type_id),
        stem_length: Number(flowerForm.stem_length) || null,
        shelf_life: Number(flowerForm.shelf_life) || null,
        price_per_stem: Number(flowerForm.price_per_stem),
        sale_price_per_stem: flowerForm.sale_price_per_stem
          ? Number(flowerForm.sale_price_per_stem)
          : null,
      };
      await api.post("/flowers", payload);
      alert("✅ Flower added successfully!");
      setFlowerForm({
        type_id: "",
        variety: "",
        color: "",
        stem_length: "",
        shelf_life: "",
        price_per_stem: "",
        sale_price_per_stem: "",
        description: "",
        image_url: "",
      });
      const res = await api.get("/flowers");
      setFlowers(res.data || []);
    } catch (err) {
      console.error("❌ Error adding flower:", err);
      alert("❌ Failed to add flower.");
    }
  };

  // ✏️ Edit Flower
  const handleEditFlower = (flower) => setEditingFlower({ ...flower });
  const handleEditChange = (e) =>
    setEditingFlower({ ...editingFlower, [e.target.name]: e.target.value });

  const handleSaveFlower = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editingFlower,
        price_per_stem: Number(editingFlower.price_per_stem) || 0,
        sale_price_per_stem: editingFlower.sale_price_per_stem
          ? Number(editingFlower.sale_price_per_stem)
          : null,
      };
      await api.put(`/flowers/${editingFlower.flower_id}`, payload);
      alert("✅ Flower updated!");
      setEditingFlower(null);
      const res = await api.get("/flowers");
      setFlowers(res.data || []);
    } catch (err) {
      console.error("❌ Error updating flower:", err);
      alert("❌ Failed to update flower.");
    }
  };

  // 🧹 Delete Flower
  const handleDeleteFlower = async (id) => {
    if (!window.confirm("Delete this flower?")) return;
    try {
      await api.delete(`/flowers/${id}`);
      setFlowers((prev) => prev.filter((f) => f.flower_id !== id));
    } catch (err) {
      console.error("❌ Error deleting flower:", err);
    }
  };

  // 🟢 Toggle Sale / Listed
  const handleToggle = async (flower, field) => {
    try {
      const updated = { ...flower, [field]: !flower[field] };
      await api.put(`/flowers/${flower.flower_id}`, updated);
      setFlowers((prev) =>
        prev.map((f) => (f.flower_id === flower.flower_id ? updated : f))
      );
    } catch (err) {
      console.error("❌ Error toggling sale/listed:", err);
    }
  };

  // 🌼 Filter Logic
  const filteredFlowers = flowers.filter((f) => {
    const text = filterText.toLowerCase();
    const flowerType = f.FlowerType?.type_name?.toLowerCase() || "";
    const variety = f.variety?.toLowerCase() || "";
    const color = f.color?.toLowerCase() || "";

    const matchesText =
      variety.includes(text) ||
      color.includes(text) ||
      flowerType.includes(text);

    const matchesType = !filterType || flowerType === filterType.toLowerCase();
    const matchesStatus =
      !filterStatus ||
      (filterStatus === "listed" && f.is_listed_for_sale) ||
      (filterStatus === "hidden" && !f.is_listed_for_sale) ||
      (filterStatus === "onSale" && f.is_on_sale) ||
      (filterStatus === "normal" && !f.is_on_sale);

    return matchesText && matchesType && matchesStatus;
  });

  // 📄 Pagination
  const totalPages = Math.ceil(filteredFlowers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFlowers = filteredFlowers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // 🧭 Render
  if (loading) return <p>Loading stock data...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-stock">
      <h2 className="overview-heading">
        <GiFlowerPot
          style={{
            marginRight: "8px",
            color: "#b80315",
            verticalAlign: "middle",
          }}
        />
        Flower Stock Management
      </h2>

      {/* 🌸 Add New Flower */}
      <section className="dashboard-section">
        <h3>Add New Flower</h3>
        <form className="dashboard-form" onSubmit={handleAddFlower}>
          <select
            name="type_id"
            value={flowerForm.type_id}
            onChange={handleFlowerChange}
            required
          >
            <option value="">Select Type</option>
            {types.map((t) => (
              <option key={t.type_id} value={t.type_id}>
                {t.type_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="variety"
            placeholder="Variety"
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
            placeholder="Stem Length (cm)"
            value={flowerForm.stem_length}
            onChange={handleFlowerChange}
          />
          <input
            type="number"
            name="shelf_life"
            placeholder="Shelf Life (days)"
            value={flowerForm.shelf_life}
            onChange={handleFlowerChange}
          />
          <input
            type="number"
            name="price_per_stem"
            placeholder="Price per Stem"
            value={flowerForm.price_per_stem}
            onChange={handleFlowerChange}
            required
          />
          <input
            type="number"
            name="sale_price_per_stem"
            placeholder="Sale Price per Stem (optional)"
            value={flowerForm.sale_price_per_stem}
            onChange={handleFlowerChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={flowerForm.description}
            onChange={handleFlowerChange}
          />
          <input
            type="text"
            name="image_url"
            placeholder="Image URL"
            value={flowerForm.image_url}
            onChange={handleFlowerChange}
          />
          <button type="submit" className="btn-primary">
            <FaPlus style={{ marginRight: "6px" }} /> Add Flower
          </button>
        </form>
      </section>

      {/* 🌸 Filter + Table */}
      <div className="stock-overview">
        <h3>Current Flowers in Store</h3>

        {/* Filter Bar */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by variety, color, or type..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t.type_id} value={t.type_name}>
                {t.type_name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="listed">Listed</option>
            <option value="hidden">Hidden</option>
            <option value="onSale">On Sale</option>
            <option value="normal">Normal</option>
          </select>
        </div>

        {/* Table */}
        <section className="dashboard-section">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Flower</th>
                <th>Variety</th>
                <th>Color</th>
                <th>Stem</th>
                <th>Life</th>
                <th>Price</th>
                <th>Sale Price</th>
                <th>Listed</th>
                <th>On Sale</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentFlowers.map((f) => (
                <tr key={f.flower_id}>
                  <td>{f.FlowerType?.type_name || "-"}</td>
                  <td>{f.variety}</td>
                  <td>{f.color}</td>
                  <td>{f.stem_length} cm</td>
                  <td>{f.shelf_life} days</td>
                  <td>R {f.price_per_stem}</td>
                  <td>
                    {f.sale_price_per_stem ? `R ${f.sale_price_per_stem}` : "-"}
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggle(f, "is_listed_for_sale")}
                      className={
                        f.is_listed_for_sale
                          ? "toggle-btn deactivate"
                          : "toggle-btn activate"
                      }
                    >
                      {f.is_listed_for_sale ? "Listed" : "Hidden"}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggle(f, "is_on_sale")}
                      className={
                        f.is_on_sale
                          ? "toggle-btn deactivate"
                          : "toggle-btn activate"
                      }
                    >
                      {f.is_on_sale ? "On Sale" : "Normal"}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEditFlower(f)}
                        className="edit-btn"
                      >
                        <FaEdit style={{ marginRight: "4px" }} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFlower(f.flower_id)}
                        className="delete-btn"
                      >
                        <FaTrashAlt style={{ marginRight: "4px" }} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
