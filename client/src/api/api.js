// ========================================
// 🌸 EverBloom — API Configuration
// ========================================
import axios from "axios";

const API_URL =
  import.meta.env?.VITE_API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5001";

// 🪴 Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`, // ✅ Add "/api" prefix
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

export default api;
