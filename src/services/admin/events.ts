// src/services/admin/events.ts
import loaderEnv from "@src/utils/loaderEnv";

const BASE = loaderEnv("BACKEND_URL"); // p.ej. http://localhost:8081

async function safeText(res: Response) {
  try { return await res.text(); } catch { return ""; }
}
function tryParse<T = any>(txt: string): T | string {
  try { return JSON.parse(txt) as T; } catch { return txt; }
}
async function throwHttpError(res: Response) {
  const raw = await safeText(res);
  const body = tryParse(raw);
  // eslint-disable-next-line no-console
  console.error(`[events.ts] HTTP ${res.status} ${res.url} ->`, body);
  const msg =
    (typeof body === "object" && body && ("message" in body) && (body as any).message) ||
    (typeof body === "string" ? body : "") ||
    `HTTP ${res.status}`;
  throw new Error(msg);
}

export type EventPayload = {
  title: string;
  description: string;
  imageUrl?: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  location: string;
  type: string;      // "CONCIERTO", ...
  status: string;    // "APERTURADO", ...
  capacity: number;
  costEntry: number;
  tags: string[];
};

/**
 * Endpoints reales del backend (según tu Postman):
 *  - GET  /api/event/all
 *  - POST /api/event/create                          (Bearer admin)
 *  - DELETE /api/event/:eventId/delete               (Bearer admin)
 *  - PUT /api/event/:eventId/update                  (opcional, editar)
 *  - PUT /api/event/:eventId/image/upload            (opcional, imagen)
 *  - GET  /api/event/:eventId/participants           (Bearer admin)
 */

// Listar todos los eventos (no requiere auth)
export async function getAllEvents(_token?: string) {
  const res = await fetch(`${BASE}/api/event/all`, { cache: "no-store" });
  if (!res.ok) await throwHttpError(res);
  return res.json();
}

// Crear evento (ADMIN)
export async function createEvent(token: string, payload: EventPayload) {
  const res = await fetch(`${BASE}/api/event/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await throwHttpError(res);
  return res.json();
}

// Eliminar evento (ADMIN)
export async function deleteEvent(token: string, id: number) {
  const res = await fetch(`${BASE}/api/event/${id}/delete`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await throwHttpError(res);
}

// (Opcional) Actualizar evento (ADMIN)
export async function updateEvent(token: string, id: number, partial: Partial<EventPayload>) {
  const res = await fetch(`${BASE}/api/event/${id}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(partial),
  });
  if (!res.ok) await throwHttpError(res);
  return res.json();
}

// (Opcional) Participantes por evento (ADMIN)
export async function getParticipants(token: string, id: number) {
  const res = await fetch(`${BASE}/api/event/${id}/participants`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) await throwHttpError(res);
  return res.json();
}
