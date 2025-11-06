// ========================================
// 🌸 EverBloom — Auth Utility (Render + Local Safe Final Version)
// ========================================

// 🔍 Detect environment
const isLocal = window.location.hostname.includes("localhost");

// ✅ Correct backend URLs for both dev & live
const API_URL = isLocal
  ? "http://localhost:5001" // Local backend
  : "https://everbloom.onrender.com"; // Render backend

// ✅ Fetch the current logged-in user
export async function fetchCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    // 🧠 Call backend with Authorization header
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.warn("⚠️ Failed to fetch user:", res.status);
      return null;
    }

    // Handle raw text before parsing JSON
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return data.user;
    } catch {
      console.error("❌ Non-JSON response:", text.slice(0, 200));
      return null;
    }
  } catch (err) {
    console.error("❌ Error fetching current user:", err);
    return null;
  }
}

// ✅ Logout helper
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}
