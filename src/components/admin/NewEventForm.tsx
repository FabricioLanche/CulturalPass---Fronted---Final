"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toOffsetIso } from "@src/utils/datetime";
import { createEvent } from "@src/services/admin/events";
import type { EventType, EventStatus } from "@src/interfaces/event/enums";

type FormState = {
  title: string;
  description: string;
  imageUrl: string;
  startDateLocal: string; // datetime-local
  endDateLocal: string;   // datetime-local
  location: string;
  type: EventType;
  status: EventStatus;
  capacity: number;
  costEntry: number;
  tagInput: string;
  tags: string[];
};

const EVENT_TYPES: EventType[] = [
  "CONCIERTO",
  "OBRA_DE_TEATRO",
  "EXPOSICION",
  "TALLER",
  "PROYECCION",
  "CONFERENCIA",
  "FERIA",
];

const EVENT_STATUS: EventStatus[] = [
  "APERTURADO",
  "EN_CURSO",
  "FINALIZADO",
  "CANCELADO",
];

export default function NewEventForm() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const [f, setF] = useState<FormState>({
    title: "",
    description: "",
    imageUrl: "",
    startDateLocal: "",
    endDateLocal: "",
    location: "",
    type: "CONCIERTO",
    status: "APERTURADO",
    capacity: 0,
    costEntry: 0,
    tagInput: "",
    tags: [],
  });

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setF(prev => ({ ...prev, [k]: v }));
  }

  function addTag() {
    const t = f.tagInput.trim();
    if (!t) return;
    if (f.tags.includes(t)) return;
    setF(prev => ({ ...prev, tags: [...prev.tags, t], tagInput: "" }));
  }

  function removeTag(t: string) {
    setF(prev => ({ ...prev, tags: prev.tags.filter(x => x !== t) }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setError("No hay token de administrador.");
      return;
    }
    setSaving(true);
    setError(null);
    setOkMsg(null);

    // Validaciones mínimas
    if (!f.title.trim()) { setError("Título requerido"); setSaving(false); return; }
    if (!f.description.trim()) { setError("Descripción requerida"); setSaving(false); return; }
    if (!f.location.trim()) { setError("Ubicación requerida"); setSaving(false); return; }
    if (!f.startDateLocal || !f.endDateLocal) { setError("Fechas requeridas"); setSaving(false); return; }

    // Convertimos a OffsetDateTime ISO
    const startDate = toOffsetIso(f.startDateLocal);
    const endDate = toOffsetIso(f.endDateLocal);

    try {
      const payload = {
        title: f.title.trim(),
        description: f.description.trim(),
        imageUrl: f.imageUrl.trim() || undefined,
        startDate,
        endDate,
        location: f.location.trim(),
        type: f.type,
        status: f.status,
        capacity: Number.isFinite(f.capacity) ? f.capacity : 0,
        costEntry: Number.isFinite(f.costEntry) ? f.costEntry : 0,
        tags: f.tags,
      };

      const created = await createEvent(token, payload);
      setOkMsg(`Evento creado con ID ${created?.id ?? ""}`);
      // Limpia rápido (si quieres quedarte en la página)
      // setF(prev => ({ ...prev, title: "", description: "", imageUrl: "", startDateLocal: "", endDateLocal: "", location: "", capacity: 0, costEntry: 0, tags: [], tagInput: "" }));
    } catch (err: any) {
      setError(err?.message ?? "No se pudo crear el evento");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">Crear evento</h1>

      {error && <div className="rounded-lg bg-red-500/20 border border-red-400 px-4 py-2 text-red-200 text-sm">{error}</div>}
      {okMsg && <div className="rounded-lg bg-emerald-500/20 border border-emerald-400 px-4 py-2 text-emerald-200 text-sm">{okMsg}</div>}

      <div className="grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm opacity-80">Título *</span>
          <input
            className="rounded-xl bg-background-secondary px-3 py-2 outline-none"
            value={f.title}
            onChange={e => set("title", e.target.value)}
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm opacity-80">Descripción *</span>
          <textarea
            className="rounded-xl bg-background-secondary px-3 py-2 outline-none min-h-28"
            value={f.description}
            onChange={e => set("description", e.target.value)}
            required
          />
        </label>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm opacity-80">Imagen (URL)</span>
            <input
              className="rounded-xl bg-background-secondary px-3 py-2 outline-none"
              value={f.imageUrl}
              onChange={e => set("imageUrl", e.target.value)}
              placeholder="https://..."
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm opacity-80">Ubicación *</span>
            <input
              className="rounded-xl bg-background-secondary px-3 py-2 outline-none"
              value={f.location}
              onChange={e => set("location", e.target.value)}
              required
            />
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm opacity-80">Inicio (fecha y hora) *</span>
            <input
              type="datetime-local"
              className="rounded-xl bg-background-secondary px-3 py-2 outline-none"
              value={f.startDateLocal}
              onChange={e => set("startDateLocal", e.target.value)}
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm opacity-80">Fin (fecha y hora) *</span>
            <input
              type="datetime-local"
              className="rounded-xl bg-background-secondary px-3 py-2 outline-none"
              value={f.endDateLocal}
              onChange={e => set("endDateLocal", e.target.value)}
              required
            />
          </label>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <label className="grid gap-1">
            <span className="text-sm opacity-80">Tipo *</span>
            <select
              className="rounded-xl bg-background-secondary px-3 py-2 outline-none"
              value={f.type}
              onChange={e => set("type", e.target.value as any)}
              required
            >
              {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm opacity-80">Estado *</span>
            <select
              className="rounded-xl bg-background-secondary px-3 py-2 outline-none"
              value={f.status}
              onChange={e => set("status", e.target.value as any)}
              required
            >
              {EVENT_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm opacity-80">Capacidad *</span>
            <input
              type="number"
              min={0}
              className="rounded-xl bg-background-secondary px-3 py-2 outline-none"
              value={f.capacity}
              onChange={e => set("capacity", Number(e.target.value))}
              required
            />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm opacity-80">Entrada (S/)</span>
          <input
            type="number"
            step="0.01"
            min={0}
            className="rounded-xl bg-background-secondary px-3 py-2 outline-none"
            value={f.costEntry}
            onChange={e => set("costEntry", Number(e.target.value))}
          />
        </label>

        {/* Tags */}
        <div className="grid gap-2">
          <span className="text-sm opacity-80">Etiquetas</span>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl bg-background-secondary px-3 py-2 outline-none"
              value={f.tagInput}
              onChange={e => set("tagInput", e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Escribe y presiona Enter para añadir"
            />
            <button type="button" className="rounded-xl border px-3" onClick={addTag}>Añadir</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {f.tags.map(t => (
              <span key={t} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                {t}
                <button type="button" onClick={() => removeTag(t)} className="opacity-70 hover:opacity-100">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            disabled={saving}
            className="px-4 py-2 rounded-2xl bg-background-little-1 text-white text-sm disabled:opacity-60"
          >
            {saving ? "Creando..." : "Crear evento"}
          </button>
        </div>
      </div>
    </form>
  );
}
