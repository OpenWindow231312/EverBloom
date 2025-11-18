// ========================================
// 🌸 EverBloom — Auth Utility (Final Version)
// ========================================

// ✅ Detect environment and use correct backend URL
const isLocal = window.location.hostname.includes("localhost");
const API_URL = isLocal
  ? "http://localhost:5001" // Local dev backend
  : "https://everbloom-backend.onrender.com"; // Production backend

// ✅ Check if user is authenticated
export function isAuthenticated() {
  const token = localStorage.getItem("token");
  return !!token;
}

// ✅ Get stored token
export function getToken() {
  return localStorage.getItem("token");
}

// ✅ Fetch the current logged-in user
export async function fetchCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    // Return null immediately if no token - don't make API call
    if (!token) {
      return null;
    }

    // 🧠 Actually store the fetch result in a variable
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      // If token is invalid, clear it
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      // Only log warning if we actually had a token (not expected 401)
      if (token) {
        console.warn("⚠️ Token is invalid or expired");
      }
      return null;
    }

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
