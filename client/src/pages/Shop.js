// ========================================
// 🌸 EverBloom — Shop Page (with SEO + Mini Cart Summary)
// ========================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import API from "../api/api";
import "../styles/shop/Shop.css";
import "../styles/shop/CartSummaryPopup.css";
import { Helmet } from "react-helmet-async";

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

  // 🛒 Cart
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  // 🪄 Popup summary
  const [showSummary, setShowSummary] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);

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

  // 🛒 Add to cart
  const addToCart = (flower) => {
    const exists = cart.find((item) => item.flower_id === flower.flower_id);
    let updatedCart;

    if (exists) {
      updatedCart = cart.map((item) =>
        item.flower_id === flower.flower_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...flower, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // 🌷 Show summary popup
    setLastAdded(flower);
    setShowSummary(true);
    setTimeout(() => setShowSummary(false), 3000);
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
      return a.variety.localeCompare(b.variety);
    })
    // 🌿 Sort in-stock flowers first
    .sort((a, b) => {
      if (a.isSoldOut === b.isSoldOut) return 0;
      return a.isSoldOut ? 1 : -1;
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

  // 🧮 Cart subtotal
  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.is_on_sale ? item.sale_price_per_stem : item.price_per_stem) *
        (item.quantity || 1),
    0
  );

  return (
    <>
      {/* 🪷 SEO Meta Tags */}
      <Helmet>
        <title>EverBloom | Shop Farm-Fresh Flowers</title>
        <meta
          name="description"
          content="Browse our EverBloom shop for locally grown, sustainable flowers. Perfect for weddings, décor, and gifting — all fresh from the farm."
        />
        <meta
          name="keywords"
          content="flower shop, EverBloom, wedding flowers, farm fresh, South Africa, florist"
        />
        <link rel="canonical" href="https://everbloomshop.co.za/shop" />
      </Helmet>

      <div className="shop-wrapper">
        <NavBar />

        <header className="shop-header">
          <h1 className="shop-title">Shop Fresh Flowers</h1>
          <p className="shop-subtitle">
            Browse our full collection of farm-fresh flowers grown sustainably
            on the EverBloom farm.
          </p>
        </header>

        {/* 🌿 Filter Bar */}
        <div className="filter-barshop">
          <input
            type="text"
            placeholder="Search by flower or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filter-input"
          />

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

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="">Sort by Price</option>
            <option value="low-high">Low to High</option>
            <option value="high-low">High to Low</option>
          </select>

          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showSaleOnly}
              onChange={(e) => setShowSaleOnly(e.target.checked)}
            />
            <span>Show On Sale</span>
          </label>

          <button className="reset-btn" onClick={resetFilters}>
            Reset Filters
          </button>

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
            <p>No flowers available at the moment</p>
          </div>
        )}

        {/* 🌸 Product Grid */}
        <section className="shop-page">
          <div className="shop-grid">
            {currentFlowers.map((flower) => {
              const isFav = favourites.some(
                (f) => f.flower_id === flower.flower_id
              );
              return (
                <ProductCard
                  key={flower.flower_id}
                  flower={flower}
                  isFavourite={isFav}
                  onToggleFavourite={toggleFavourite}
                  onAddToCart={addToCart}
                />
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

        {/* 🛍️ Floating Cart Summary */}
        {showSummary && lastAdded && (
          <div className="cart-summary-popup">
            <img
              src={
                lastAdded.image_url ||
                require("../assets/placeholder-flower.jpg")
              }
              alt={lastAdded.variety}
              className="popup-img"
            />
            <div className="popup-info">
              <h5>{lastAdded.variety}</h5>
              <p>Added to cart</p>
              <span className="popup-subtotal">
                Cart Total: R{subtotal.toFixed(2)}
              </span>
            </div>
            <button className="popup-btn" onClick={() => navigate("/cart")}>
              View Cart
            </button>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}

export default Shop;
