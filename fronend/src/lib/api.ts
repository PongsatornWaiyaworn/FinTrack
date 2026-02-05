const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth") || "").token
    : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw error || new Error("API Error");
  }

  if (res.status === 204) return null;
  
  return res.json();
}
