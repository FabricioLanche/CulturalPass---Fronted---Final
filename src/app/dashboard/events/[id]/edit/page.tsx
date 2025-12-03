"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  getTokenInfo,
  validateToken,
  validateManual,
} from "@src/services/admin/tokens";

// Cargar el lector solo en cliente
const QrScanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then(m => m.Scanner),
  { ssr: false }
);

type TokenInfo = {
  tokenString: string;
  data: any; // estructura devuelta por /api/token/info/:tokenString
};

export default function ScanTokensPage() {
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  const [last, setLast] = useState<string | null>(null);
  const [info, setInfo] = useState<TokenInfo | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (status === "loading") return <div className="p-6">Cargando…</div>;
  if (!token) return <div className="p-6">Debes iniciar sesión como administrador.</div>;

  // Se llama cuando el lector encuentra un QR
  async function onDecode(text: string) {
    const tokenString = String(text || "").trim();
    if (!tokenString || tokenString === last) return; // evita duplicados
    setLast(tokenString);
    setErr(null);
    setInfo(null);
    try {
      const data = await getTokenInfo(token!, tokenString); // GET /api/token/info/:token
      setInfo({ tokenString, data });
    } catch (e: any) {
      setErr(e?.message ?? "No se pudo obtener la información del token");
    }
  }

  async function onValidate() {
    if (!info?.tokenString) return;
    try {
      setBusy(true);
      await validateToken(token!, info.tokenString); // PUT /api/token/validate/:token
      // Marca como usado en UI (si tu API devuelve más campos, puedes refrescar llamando getTokenInfo)
      setInfo(prev => prev ? ({ ...prev, data: { ...prev.data, status: "USADO" } }) : prev);
    } catch (e: any) {
      setErr(e?.message ?? "No se pudo validar el token");
    } finally {
      setBusy(false);
    }
  }

  // Respaldo: validación manual (si no hay cámara o el QR está dañado)
  async function onManualValidate(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = new FormData(ev.currentTarget);
    const email = String(form.get("email") || "").trim();
    const firstName = String(form.get("firstName") || "").trim();
    const eventId = Number(form.get("eventId") || 0);
    if (!email || !firstName || !eventId) {
      setErr("Completa email, nombre y evento.");
      return;
    }
    try {
      setBusy(true);
      await validateManual(token!, { email, firstName, eventId });
      setErr(null);
      alert("Validación manual registrada");
      (ev.currentTarget as HTMLFormElement).reset();
    } catch (e: any) {
      setErr(e?.message ?? "No se pudo validar manualmente");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Validación de QR</h1>

      {/* Cámara / Escáner */}
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-background-secondary/70">
        <div className="w-full aspect-video">
          <QrScanner
            onScan={(res) => onDecode(res?.[0]?.rawValue ?? "")}
            onError={(e: any) => setErr(e?.message ?? "Error de cámara / permisos")}
            constraints={{ facingMode: "environment" }} // trasera en móviles
          // showTorchButton // descomenta si quieres botón de linterna
          />
        </div>
      </div>

      {err && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300">
          {err}
        </div>
      )}

      {/* Resultado del QR leído */}
      {info && (
        <div className="rounded-2xl bg-background-secondary p-4 space-y-3">
          <p className="text-sm opacity-70">Token detectado:</p>
          <code className="block text-xs break-all">{info.tokenString}</code>

          {/* Render simple de la info del token */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-black/10 p-3">
              <p className="opacity-70">Estado</p>
              <p className="font-semibold">{String(info.data?.status ?? "DESCONOCIDO")}</p>
            </div>
            <div className="rounded-lg bg-black/10 p-3">
              <p className="opacity-70">Usuario</p>
              <p className="font-semibold">
                {info.data?.user?.firstName} {info.data?.user?.lastName} ({info.data?.user?.email})
              </p>
            </div>
            <div className="rounded-lg bg-black/10 p-3">
              <p className="opacity-70">Evento</p>
              <p className="font-semibold">
                #{info.data?.event?.id} — {info.data?.event?.title}
              </p>
            </div>
            <div className="rounded-lg bg-black/10 p-3">
              <p className="opacity-70">Creado</p>
              <p className="font-semibold">
                {info.data?.createdAt && new Date(info.data.createdAt).toLocaleString("es-PE")}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              disabled={busy || info.data?.status === "USADO"}
              onClick={onValidate}
              className="px-4 py-2 rounded-2xl bg-background-little-1 text-white text-sm disabled:opacity-60"
            >
              {busy ? "Validando..." : "Validar ingreso"}
            </button>
            <button
              onClick={() => { setInfo(null); setLast(null); }}
              className="px-4 py-2 rounded-2xl border border-white/25 text-sm"
            >
              Escanear otro
            </button>
          </div>
        </div>
      )}

      {/* Respaldo: Validación manual */}
      <div className="rounded-2xl bg-background-secondary p-4">
        <h2 className="text-lg font-semibold mb-2">Validación manual</h2>
        <p className="text-xs opacity-70 mb-3">
          Úsalo si la cámara falla o el QR no es legible. Se registrará como validación manual.
        </p>
        <form onSubmit={onManualValidate} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input name="email" placeholder="Email" className="px-3 py-2 rounded-xl bg-black/10" />
          <input name="firstName" placeholder="Nombre" className="px-3 py-2 rounded-xl bg-black/10" />
          <input name="eventId" type="number" placeholder="ID de evento" className="px-3 py-2 rounded-xl bg-black/10" />
          <div className="sm:col-span-3">
            <button
              disabled={busy}
              className="px-4 py-2 rounded-2xl bg-background-little-1 text-white text-sm disabled:opacity-60"
            >
              {busy ? "Validando..." : "Validar manualmente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
