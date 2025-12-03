// src/app/dashboard/events/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getAllEvents, deleteEvent } from "@src/services/admin/events";
import type { Event } from "@src/interfaces/event/Event";

export default function AdminEventsPage() {
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const list = await getAllEvents(token);
        setEvents(list);
      } catch (e: any) {
        setErr(e.message ?? "Error cargando eventos");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm("¿Eliminar evento?")) return;
    try {
      await deleteEvent(token, id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (e: any) {
      alert(e.message ?? "No se pudo eliminar");
    }
  };

  if (status === "loading") return <div className="p-6">Cargando…</div>;
  if (!token)
    return <div className="p-6">Debes iniciar sesión como administrador.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-background-secondary">
            Gestión de Eventos
          </h1>
          <p className="text-sm text-background-little-1 mt-1 font-medium">
            Administra y supervisa todos los eventos del centro cultural
          </p>
        </div>

        <Link
          href="/dashboard/events/create"
          className="px-5 py-2.5 rounded-full bg-background-little-1 text-white text-sm font-medium hover:bg-opacity-90 transition-all shadow-lg shadow-background-little-1/20 flex items-center gap-2"
          aria-label="Crear evento"
        >
          <span className="text-lg">+</span> Crear evento
        </Link>
      </div>

      {loading && (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-background-tertiary/50 rounded-xl w-full"></div>
          <div className="h-12 bg-background-tertiary/50 rounded-xl w-full"></div>
          <div className="h-12 bg-background-tertiary/50 rounded-xl w-full"></div>
        </div>
      )}
      {err && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 text-sm">
          {err}
        </div>
      )}

      {!loading && !err && (
        <div className="overflow-hidden rounded-2xl border border-background-little-1/20 bg-background-tertiary/60 backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b border-background-little-1/10 bg-background-tertiary/80">
                  <th className="px-6 py-4 font-semibold text-background-little-1">
                    ID
                  </th>
                  <th className="px-6 py-4 font-semibold text-background-little-1">
                    Título
                  </th>
                  <th className="px-6 py-4 font-semibold text-background-little-1">
                    Tipo
                  </th>
                  <th className="px-6 py-4 font-semibold text-background-little-1">
                    Estado
                  </th>
                  <th className="px-6 py-4 font-semibold text-background-little-1">
                    Fecha Inicio
                  </th>
                  <th className="px-6 py-4 font-semibold text-background-little-1">
                    Entrada
                  </th>
                  <th className="px-6 py-4 font-semibold text-background-little-1 text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background-little-1/10">
                {events.map((ev) => (
                  <tr
                    key={ev.id}
                    className="hover:bg-background-tertiary/80 transition-colors group"
                  >
                    <td className="px-6 py-4 text-background-secondary/70 font-mono">
                      #{ev.id}
                    </td>
                    <td className="px-6 py-4 font-bold text-background-secondary max-w-xs truncate">
                      {ev.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background-little-2/10 text-background-little-2 border border-background-little-2/20">
                        {ev.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ev.status} />
                    </td>
                    <td className="px-6 py-4 text-background-secondary">
                      {new Date(ev.startDate).toLocaleString("es-PE", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-background-secondary">
                      {ev.costEntry > 0
                        ? `S/ ${ev.costEntry.toFixed(2)}`
                        : "Gratis"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/dashboard/events/${ev.id}/details`}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg border border-background-little-1/20 bg-background-tertiary text-xs font-medium text-background-little-1 hover:bg-background-little-1 hover:text-white transition-colors"
                      >
                        Consultar
                      </Link>
                      <button
                        className="inline-flex items-center px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 text-xs font-medium text-red-600 hover:bg-red-500/10 transition-colors"
                        onClick={() => handleDelete(ev.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-background-little-1"
                    >
                      No hay eventos registrados. ¡Crea el primero!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let colors =
    "bg-gray-500/10 text-gray-600 border-gray-500/20";

  switch (status) {
    case "APERTURADO":
      colors = "bg-green-600/10 text-green-700 border-green-600/20";
      break;
    case "EN_CURSO":
      colors = "bg-blue-600/10 text-blue-700 border-blue-600/20";
      break;
    case "CLAUSURADO":
      colors = "bg-purple-600/10 text-purple-700 border-purple-600/20";
      break;
    case "CANCELADO":
      colors = "bg-red-600/10 text-red-700 border-red-600/20";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors}`}
    >
      {status}
    </span>
  );
}
