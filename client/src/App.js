// ========================================
// 🌸 EverBloom — Frontend Routes Setup
// ========================================
import React from "react";
import { Routes, Route } from "react-router-dom";

// 🏡 Public pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Rewards from "./pages/Rewards";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Favourites from "./pages/Favourites";
import Account from "./pages/Account";

// 🔒 Protected route wrapper
import ProtectedRoute from "./components/ProtectedRoute";

// 🌼 Dashboard pages
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardStock from "./pages/dashboard/DashboardStock";
import DashboardOrders from "./pages/dashboard/DashboardOrders";
import DashboardInventory from "./pages/dashboard/DashboardInventory";
import DashboardUsers from "./pages/dashboard/DashboardUsers";
import DashboardHarvest from "./pages/dashboard/dashboardHarvest";

function App() {
  return (
    <Routes>
      {/* ===========================
          🌷 Public Routes
      =========================== */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductPage />} />{" "}
      {/* ✅ dynamic route */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/favourites" element={<Favourites />} />
      <Route path="/account" element={<Account />} />
      {/* ===========================
          🌸 Protected Dashboard
      =========================== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["Admin", "Employee"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="stock" element={<DashboardStock />} />
        <Route path="orders" element={<DashboardOrders />} />
        <Route path="inventory" element={<DashboardInventory />} />
        <Route path="users" element={<DashboardUsers />} />
        <Route path="harvest" element={<DashboardHarvest />} />
      </Route>
      {/* ===========================
          ❌ 404 Fallback
      =========================== */}
      <Route
        path="*"
        element={
          <div
            style={{
              textAlign: "center",
              padding: "50px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            <h1>404 — Page Not Found 🌸</h1>
            <p>
              The page you’re looking for doesn’t exist.{" "}
              <a href="/" style={{ color: "#de0d22", textDecoration: "none" }}>
                Go back home
              </a>
              .
            </p>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
