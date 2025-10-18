// ========================================
// 🌸 EverBloom — Auth Utilities
// ========================================

export async function fetchCurrentUser(API_URL) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch user");

    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error("❌ Error fetching current user:", err);
    return null;
  }
}

// Optional utility for logout
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login"; // redirect to login page
}
