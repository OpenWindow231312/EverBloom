// ========================================
// 🌸 EverBloom — Shop Page
// ========================================

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import API from "../api/api";
import "../styles/shop/Shop.css";

function Shop() {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🌸 Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState("");

  // ❤️ Favourites
  const [favourites, setFavourites] = useState(
    JSON.parse(localStorage.getItem("favourites")) || []
  );

  // 📄 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const flowersPerPage = 12;

  const navigate = useNavigate();

  // 🪴 Fetch all flowers
  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const res = await API.get("/shop");
        setFlowers(res.data);
      } catch (err) {
        console.error("Error fetching flowers:", err);
        setError("Could not load flowers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFlowers();
  }, []);

  // ❤️ Toggle favourite
  const toggleFavourite = (flower) => {
    let updatedFavourites;
    const exists = favourites.find((f) => f.flower_id === flower.flower_id);

    if (exists) {
      updatedFavourites = favourites.filter(
        (f) => f.flower_id !== flower.flower_id
      );
    } else {
      updatedFavourites = [...favourites, flower];
    }

    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
  };

  // 🌸 Reset Filters
  const resetFilters = () => {
    setSearch("");
    setTypeFilter("");
    setShowSaleOnly(false);
    setSortBy("");
    setCurrentPage(1);
  };

  // 🌼 Apply filters and search
  const filteredFlowers = flowers
    .filter((flower) => {
      const variety = flower.variety?.toLowerCase() || "";
      const type =
        flower.FlowerType?.type_name?.toLowerCase() ||
        flower.FlowerType?.flowerTypeName?.toLowerCase() ||
        flower.type_name?.toLowerCase() ||
        "";
      const searchTerm = search.toLowerCase();

      const matchesSearch =
        variety.includes(searchTerm) || type.includes(searchTerm);
      const matchesType = !typeFilter || type === typeFilter.toLowerCase();
      const matchesSale = !showSaleOnly || Number(flower.is_on_sale) === 1;

      return matchesSearch && matchesType && matchesSale;
    })
    .sort((a, b) => {
      if (sortBy === "low-high") return a.price_per_stem - b.price_per_stem;
      if (sortBy === "high-low") return b.price_per_stem - a.price_per_stem;
      // Default alphabetical order by variety
      return a.variety.localeCompare(b.variety);
    });

  // 📄 Pagination logic
  const indexOfLast = currentPage * flowersPerPage;
  const indexOfFirst = indexOfLast - flowersPerPage;
  const currentFlowers = filteredFlowers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredFlowers.length / flowersPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="shop-wrapper">
      <NavBar />

      <header className="shop-header">
        <h1 className="shop-title">Shop Fresh Flowers</h1>
        <p className="shop-subtitle">
          Browse our full collection of farm-fresh flowers grown sustainably on
          the EverBloom farm.
        </p>
      </header>

      {/* 🌿 Filter Bar */}
      <div className="filter-barshop">
        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search by flower or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input"
        />

        {/* 🌸 Type Dropdown */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          {[
            ...new Set(
              flowers.map(
                (f) =>
                  f.FlowerType?.type_name ||
                  f.FlowerType?.flowerTypeName ||
                  f.type_name
              )
            ),
          ]
            .filter(Boolean)
            .map((type, i) => (
              <option key={i} value={type}>
                {type}
              </option>
            ))}
        </select>

        {/* 💰 Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="">Sort by Price</option>
          <option value="low-high">Low to High</option>
          <option value="high-low">High to Low</option>
        </select>

        {/* 🔖 Sale */}
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={showSaleOnly}
            onChange={(e) => setShowSaleOnly(e.target.checked)}
          />
          <span>Show On Sale</span>
        </label>

        {/* ♻️ Reset Filters */}
        <button className="reset-btn" onClick={resetFilters}>
          Reset Filters
        </button>

        {/* ❤️ Favourites Button */}
        <button
          className="favourites-btn"
          onClick={() => navigate("/favourites")}
        >
          <FaHeart /> Favourite Flowers
        </button>
      </div>

      {/* 🌼 Loading / Error / Empty States */}
      {loading && (
        <div className="shop-loading">
          <p>Loading flowers...</p>
        </div>
      )}

      {error && (
        <div className="shop-error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && currentFlowers.length === 0 && (
        <div className="shop-empty">
          <p>No flowers available at the moment 🌷</p>
        </div>
      )}

      {/* 🌸 Product Grid */}
      <section className="shop-page">
        <div className="shop-grid">
          {currentFlowers.map((flower) => {
            const isOnSale = Number(flower.is_on_sale) === 1;
            const isFav = favourites.some(
              (f) => f.flower_id === flower.flower_id
            );

            return (
              <div key={flower.flower_id} className="flower-card">
                {isOnSale && <div className="sale-badge">Sale</div>}

                {/* ❤️ Heart Button */}
                <button
                  className={`heart-btn ${isFav ? "active" : ""}`}
                  onClick={() => toggleFavourite(flower)}
                >
                  {isFav ? <FaHeart /> : <FaRegHeart />}
                </button>

                <Link
                  to={`/product/${flower.flower_id}`}
                  className="flower-link"
                >
                  <img
                    src={
                      flower.image_url && flower.image_url.trim() !== ""
                        ? flower.image_url
                        : require("../assets/placeholder-flower.jpg")
                    }
                    alt={flower.variety}
                    className="flower-img"
                  />
                </Link>

                <div className="flower-info">
                  <h3 className="flower-name">{flower.variety}</h3>
                  <p className="flower-type">
                    {flower.FlowerType?.type_name ||
                      flower.FlowerType?.flowerTypeName ||
                      flower.type_name ||
                      "Unknown Type"}
                  </p>

                  {isOnSale ? (
                    <p className="flower-price">
                      <span className="sale-price">
                        R{flower.sale_price_per_stem}
                      </span>
                      <span className="original-price">
                        R{flower.price_per_stem}
                      </span>
                    </p>
                  ) : (
                    <p className="flower-price">R{flower.price_per_stem}</p>
                  )}

                  <Link to={`/product/${flower.flower_id}`}>
                    <button className="btn-view">View Details</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 📄 Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination1">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="page-btn"
          >
            ← Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next →
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Shop;
