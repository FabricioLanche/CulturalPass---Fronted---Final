// src/app/dashboard/tokens/manual/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { validateManual } from "@src/services/admin/tokens";

export default function ManualValidationPage() {
  const { data: session, status } = useSession();
  const adminJwt = (session as any)?.accessToken as string | undefined;

  const [form, setForm] = useState({ email: "", firstName: "", eventId: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (status === "loading") return <div className="p-6">Cargando…</div>;
  if (!adminJwt) return <div className="p-6">Debes iniciar sesión como administrador.</div>;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null);
    try {
      setLoading(true);
      const res = await validateManual(adminJwt, {
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        eventId: Number(form.eventId),
      });
      setMsg("Validación manual registrada correctamente.");
    } catch (e: any) {
      setErr(e.message ?? "No se pudo validar manualmente");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Validación manual</h1>
      <form onSubmit={submit} className="rounded-2xl bg-background-secondary p-4 space-y-3">
        <div>
          <label className="block text-sm mb-1">Correo del usuario</label>
          <input
            className="w-full px-3 py-2 rounded-xl bg-black/10"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            type="email" required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            className="w-full px-3 py-2 rounded-xl bg-black/10"
            value={form.firstName}
            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">ID del evento</label>
          <input
            className="w-full px-3 py-2 rounded-xl bg-black/10"
            value={form.eventId}
            onChange={e => setForm(f => ({ ...f, eventId: e.target.value }))}
            type="number" min={1} required
          />
        </div>

        <div className="flex gap-2">
          <button
            disabled={loading}
            className="px-4 py-2 rounded-2xl bg-background-little-1 text-white text-sm disabled:opacity-60"
          >
            {loading ? "Validando..." : "Validar"}
          </button>
        </div>

        {msg && <div className="text-emerald-300 text-sm">{msg}</div>}
        {err && <div className="text-rose-300 text-sm">{err}</div>}
      </form>
    </div>
  );
}
