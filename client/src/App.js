import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Rewards from "./pages/Rewards";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";

// Dashboard pages
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardStock from "./pages/dashboard/DashboardStock";
import DashboardOrders from "./pages/dashboard/DashboardOrders";
import DashboardInventory from "./pages/dashboard/DashboardInventory";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={<Cart />} />

      {/* Protected dashboard routes */}
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
      </Route>
    </Routes>
  );
}

export default App;
