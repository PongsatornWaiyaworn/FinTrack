export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}
