// ========================================
// 🌸 EverBloom — Frontend Routes Setup
// ========================================
import React from "react";
import { Routes, Route } from "react-router-dom";

// 🏡 Public pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Rewards from "./pages/Rewards";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";

// 🔒 Protected route wrapper
import ProtectedRoute from "./components/ProtectedRoute";

// 🌼 Dashboard pages
import DashboardLayout from "./pages/dashboard/dashboardLayout";
import DashboardOverview from "./pages/dashboard/dashboardOverview";
import DashboardStock from "./pages/dashboard/dashboardStock";
import DashboardOrders from "./pages/dashboard/dashboardOrders";
import DashboardInventory from "./pages/dashboard/dashboardInventory";
import DashboardUsers from "./pages/dashboard/dashboardUsers";
import DashboardHarvest from "./pages/dashboard/dashboardHarvest";

// ===============================
// 🚀 Application Routes
// ===============================
function App() {
  return (
    <Routes>
      {/* ===========================
          🌷 Public Routes
      =========================== */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={<Cart />} />

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
        {/* Nested routes render inside <Outlet /> in DashboardLayout */}
        <Route index element={<DashboardOverview />} />
        <Route path="stock" element={<DashboardStock />} />
        <Route path="orders" element={<DashboardOrders />} />
        <Route path="inventory" element={<DashboardInventory />} />
        <Route path="users" element={<DashboardUsers />} />
        <Route path="harvests" element={<DashboardHarvest />} />{" "}
        {/* optional */}
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
              <a href="/" style={{ color: "#d84e55", textDecoration: "none" }}>
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
