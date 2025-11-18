// ========================================
// 🌸 EverBloom — API Configuration (Render + Local Final Version)
// ========================================
import axios from "axios";

// ✅ Detect environment
const isLocal = window.location.hostname.includes("localhost");

// ✅ Correct backend URLs for both environments
const API_URL = isLocal
  ? "http://localhost:5001" // Local dev backend
  : "https://everbloom-backend.onrender.com"; // ✅ Your actual Render backend

// 🪴 Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`, // ✅ Always include "/api" once here
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧠 Automatically attach JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========================================
// 🔹 DASHBOARD ENDPOINTS
// ========================================
export const getDashboardOverview = () => api.get("/dashboard/overview");
export const getAllUsers = () => api.get("/dashboard/users");
export const getAllOrders = () => api.get("/dashboard/orders");
export const getAllHarvests = () => api.get("/dashboard/harvests");
export const updateUserRole = (userId, roleId) =>
  api.put(`/dashboard/users/${userId}/role`, { role_id: roleId });
export const updateOrderStatus = (orderId, status) =>
  api.put(`/dashboard/orders/${orderId}/status`, { status });

// ========================================
// ❄️ INVENTORY & DISCARDS
// ========================================
export const getAllInventory = () => api.get("/dashboard/inventory");
export const getAllDiscards = () => api.get("/dashboard/discards");
export const discardBatch = (data) => api.post("/dashboard/discards", data);

export default api;
