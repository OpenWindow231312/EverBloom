import React from "react";
import { Routes, Route } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Rewards from "./pages/Rewards";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";

// Protected route wrapper
import ProtectedRoute from "./components/ProtectedRoute";

// Dashboard pages
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardStock from "./pages/dashboard/DashboardStock";
import DashboardOrders from "./pages/dashboard/DashboardOrders";
import DashboardInventory from "./pages/dashboard/DashboardInventory";
import DashboardUsers from "./pages/dashboard/DashboardUsers"; // ✅ new import

function App() {
  return (
    <Routes>
      {/* ===========================
          🌸 Public Routes
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
          🌼 Protected Dashboard Routes
      =========================== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["Admin", "Employee"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Sub-routes (rendered inside DashboardLayout via <Outlet />) */}
        <Route index element={<DashboardOverview />} />
        <Route path="stock" element={<DashboardStock />} />
        <Route path="orders" element={<DashboardOrders />} />
        <Route path="inventory" element={<DashboardInventory />} />
        <Route path="users" element={<DashboardUsers />} /> {/* ✅ new route */}
      </Route>
    </Routes>
  );
}

export default App;
