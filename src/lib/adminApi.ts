const BASE = "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return res.json();
}

export const adminApi = {
  hero: {
    list: () => request<Record<string, unknown>[]>(`${BASE}/hero`),
    save: (data: Record<string, unknown>) =>
      request(`${BASE}/hero`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: string) =>
      request(`${BASE}/hero`, { method: "DELETE", body: JSON.stringify({ id }) }),
  },
  berita: {
    list: () => request<Record<string, unknown>[]>(`${BASE}/berita`),
    save: (data: Record<string, unknown>) =>
      request(`${BASE}/berita`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: string) =>
      request(`${BASE}/berita`, { method: "DELETE", body: JSON.stringify({ id }) }),
  },
  galeri: {
    list: () => request<Record<string, unknown>[]>(`${BASE}/galeri`),
    save: (data: Record<string, unknown>) =>
      request(`${BASE}/galeri`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: string) =>
      request(`${BASE}/galeri`, { method: "DELETE", body: JSON.stringify({ id }) }),
  },
  agenda: {
    list: () => request<Record<string, unknown>[]>(`${BASE}/agenda`),
    save: (data: Record<string, unknown>) =>
      request(`${BASE}/agenda`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: string) =>
      request(`${BASE}/agenda`, { method: "DELETE", body: JSON.stringify({ id }) }),
  },
  spmb: {
    list: () => request<Record<string, unknown>[]>(`${BASE}/spmb`),
    updateStatus: (id: string, status: string) =>
      request(`${BASE}/spmb`, { method: "PUT", body: JSON.stringify({ id, status }) }),
    remove: (id: string) =>
      request(`${BASE}/spmb`, { method: "DELETE", body: JSON.stringify({ id }) }),
  },
  settings: {
    get: () => request<Record<string, string>>(`${BASE}/settings`),
    save: (settings: Record<string, string>) =>
      request(`${BASE}/settings`, { method: "PUT", body: JSON.stringify({ settings }) }),
  },
  komentar: {
    list: (berita_id: string) =>
      request<Record<string, unknown>[]>(`${BASE}/komentar?berita_id=${berita_id}`),
    remove: (id: string) =>
      request(`${BASE}/komentar`, { method: "DELETE", body: JSON.stringify({ id }) }),
  },
};
