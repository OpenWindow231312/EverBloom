// ========================================
// 🌸 EverBloom — API Configuration (Render + Vercel Safe)
// ========================================
import axios from "axios";

// ✅ Detect environment and assign proper backend URL
const isLocal = window.location.hostname.includes("localhost");

const API_URL = isLocal
  ? "http://localhost:5001" // local dev backend
  : "https://everbloom-backend.onrender.com"; // Render backend (live)

// 🪴 Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`, // ✅ Includes "/api" prefix
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧠 Automatically attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===============================
// 🔹 Dashboard API Endpoints
// ===============================
export const getDashboardOverview = () => api.get("/dashboard/overview");
export const getAllUsers = () => api.get("/dashboard/users");
export const getAllOrders = () => api.get("/dashboard/orders");
export const getAllHarvests = () => api.get("/dashboard/harvests");
export const updateUserRole = (userId, roleId) =>
  api.put(`/dashboard/users/${userId}/role`, { role_id: roleId });
export const updateOrderStatus = (orderId, status) =>
  api.put(`/dashboard/orders/${orderId}/status`, { status });

// ===============================
// ❄️ Inventory & Discards
// ===============================
export const getAllInventory = () => api.get("/dashboard/inventory");
export const getAllDiscards = () => api.get("/dashboard/discards");
export const discardBatch = (data) => api.post("/dashboard/discards", data);

export default api;
