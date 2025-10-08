import axios from "axios";

// 🪴 Base configuration for all API calls
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// 🔹 Dashboard API Endpoints
// ===============================
export const getDashboardOverview = () => API.get("/dashboard/overview");
export const getAllUsers = () => API.get("/dashboard/users");
export const getAllOrders = () => API.get("/dashboard/orders");
export const getAllHarvests = () => API.get("/dashboard/harvests");
export const updateUserRole = (userId, roleId) =>
  API.put(`/dashboard/users/${userId}/role`, { role_id: roleId });
export const updateOrderStatus = (orderId, status) =>
  API.put(`/dashboard/orders/${orderId}/status`, { status });

export default API;
