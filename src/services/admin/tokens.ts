import loaderEnv from "@src/utils/loaderEnv";

const BASE = loaderEnv("BACKEND_URL"); // ej: http://localhost:8081

async function safeJson(res: Response) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

function throwHttpError(res: Response, body: any) {
  // eslint-disable-next-line no-console
  console.error(`[tokens.ts] HTTP ${res.status} ->`, body);
  const msg =
    (typeof body === "object" && body && ("message" in body) && (body as any).message) ||
    (typeof body === "string" ? body : "") ||
    "Error en la solicitud";
  throw new Error(msg);
}

/** GET /api/token/info/:tokenString */
export async function getTokenInfo(token: string, tokenString: string) {
  const res = await fetch(`${BASE}/api/token/info/${encodeURIComponent(tokenString)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throwHttpError(res, await safeJson(res));
  return res.json();
}

/** PUT /api/token/validate/:tokenString */
export async function validateToken(token: string, tokenString: string) {
  const res = await fetch(`${BASE}/api/token/validate/${encodeURIComponent(tokenString)}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throwHttpError(res, await safeJson(res));
}

/** PUT /api/token/validate-manual  (Body: { email, firstName, eventId }) */
export async function validateManual(token: string, payload: { email: string; firstName: string; eventId: number }) {
  const res = await fetch(`${BASE}/api/token/validate-manual`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throwHttpError(res, await safeJson(res));
}
