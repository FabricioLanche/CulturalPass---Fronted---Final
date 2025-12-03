// src/services/admin/api.ts
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

async function request<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Admin API error:", res.status, text);
    throw new Error(`Admin API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export default { request };
