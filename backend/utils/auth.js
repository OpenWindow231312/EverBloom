// ========================================
// 🌸 EverBloom — Auth Utility
// ========================================
const API_URL =
  import.meta.env?.VITE_API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5001";

export async function fetchCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null; // No token = not logged in

    const res = await fetch(`${API_URL}/auth/current-user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.warn("⚠️ Backend responded:", res.status);
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
