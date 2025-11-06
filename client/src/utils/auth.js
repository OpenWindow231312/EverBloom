// ========================================
// 🌸 EverBloom — Auth Utility (Final Version)
// ========================================
const API_URL =
  import.meta.env?.VITE_API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5001";

// ✅ Fetch the current logged-in user
export async function fetchCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    // 🧠 Actually store the fetch result in a variable
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
