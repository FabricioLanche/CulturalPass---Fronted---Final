// src/app/dashboard/events/[id]/details/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getAllEvents, getParticipants } from "@src/services/admin/events";
import type { Event } from "@src/interfaces/event/Event";

export default function EventDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const token = (session as any)?.accessToken as string | undefined;

    const [event, setEvent] = useState<Event | null>(null);
    const [participants, setParticipants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        if (!token || !id) return;
        (async () => {
            try {
                setLoading(true);
                setErr(null);
                const eventId = Number(id);

                // 1. Fetch event details (using getAllEvents since getById is not available)
                const allEvents = await getAllEvents(token);
                const found = allEvents.find((e: Event) => e.id === eventId);
                if (!found) throw new Error("Evento no encontrado");
                setEvent(found);

                // 2. Fetch participants
                const parts = await getParticipants(token, eventId);
                setParticipants(parts);
            } catch (e: any) {
                setErr(e.message ?? "Error cargando detalles");
            } finally {
                setLoading(false);
            }
        })();
    }, [token, id]);

    if (status === "loading") return <div className="p-6">Cargando…</div>;
    if (!token)
        return <div className="p-6">Debes iniciar sesión como administrador.</div>;

    const revenue = (participants.length * (event?.costEntry ?? 0));

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <button
                onClick={() => router.back()}
                className="text-sm font-medium text-background-little-1 hover:underline flex items-center gap-1"
            >
                ← Volver a eventos
            </button>

            {loading && (
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-background-tertiary/50 rounded w-1/3"></div>
                    <div className="h-32 bg-background-tertiary/50 rounded-xl w-full"></div>
                </div>
            )}

            {err && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 text-sm">
                    {err}
                </div>
            )}

            {event && !loading && (
                <>
                    <header>
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-background-secondary">
                                    {event.title}
                                </h1>
                                <p className="text-background-secondary/70 mt-1 max-w-2xl">
                                    {event.description}
                                </p>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-background-little-1/10 text-background-little-1 text-sm font-medium border border-background-little-1/20">
                                {event.status}
                            </span>
                        </div>
                    </header>

                    {/* KPIs */}
                    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-background-tertiary/60 backdrop-blur-md p-6 border border-background-little-1/20 shadow-lg">
                            <p className="text-sm font-medium text-background-little-1 mb-1">
                                Participantes
                            </p>
                            <p className="text-3xl font-bold text-background-secondary">
                                {participants.length}
                            </p>
                            <p className="text-xs text-background-secondary/60 mt-1">
                                Inscritos totales
                            </p>
                        </div>
                        <div className="rounded-2xl bg-background-tertiary/60 backdrop-blur-md p-6 border border-background-little-1/20 shadow-lg">
                            <p className="text-sm font-medium text-background-little-1 mb-1">
                                Recaudación Estimada
                            </p>
                            <p className="text-3xl font-bold text-background-secondary">
                                {revenue.toLocaleString("es-PE", {
                                    style: "currency",
                                    currency: "PEN",
                                })}
                            </p>
                            <p className="text-xs text-background-secondary/60 mt-1">
                                {participants.length} x S/ {event.costEntry.toFixed(2)}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-background-tertiary/60 backdrop-blur-md p-6 border border-background-little-1/20 shadow-lg">
                            <p className="text-sm font-medium text-background-little-1 mb-1">
                                Aforo
                            </p>
                            <div className="flex items-baseline gap-1">
                                <p className="text-3xl font-bold text-background-secondary">
                                    {Math.round((participants.length / event.capacity) * 100)}%
                                </p>
                                <span className="text-sm text-background-secondary/60">
                                    ocupado
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-background-secondary/10 rounded-full mt-3 overflow-hidden">
                                <div
                                    className="h-full bg-background-little-1"
                                    style={{
                                        width: `${Math.min(
                                            (participants.length / event.capacity) * 100,
                                            100
                                        )}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </section>

                    {/* Detalles adicionales */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <section className="lg:col-span-2 rounded-2xl border border-background-little-1/20 bg-background-tertiary/60 backdrop-blur-md p-6 shadow-xl">
                            <h2 className="text-lg font-semibold mb-4 text-background-secondary">
                                Lista de Participantes
                            </h2>
                            {participants.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="border-b border-background-little-1/10 text-background-little-1">
                                                <th className="pb-3 font-medium">Nombre</th>
                                                <th className="pb-3 font-medium">Email</th>
                                                <th className="pb-3 font-medium text-right">
                                                    Fecha Inscripción
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-background-little-1/10">
                                            {participants.map((p: any, i: number) => (
                                                <tr key={i} className="group hover:bg-white/5">
                                                    <td className="py-3 text-background-secondary font-medium">
                                                        {p.firstName} {p.lastName}
                                                    </td>
                                                    <td className="py-3 text-background-secondary/70">
                                                        {p.email}
                                                    </td>
                                                    <td className="py-3 text-right text-background-secondary/70">
                                                        {p.enrollmentDate
                                                            ? new Date(p.enrollmentDate).toLocaleDateString()
                                                            : "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-background-secondary/60 text-center py-8">
                                    Aún no hay participantes inscritos.
                                </p>
                            )}
                        </section>

                        <section className="space-y-6">
                            <div className="rounded-2xl border border-background-little-1/20 bg-background-tertiary/60 backdrop-blur-md p-6 shadow-xl">
                                <h2 className="text-lg font-semibold mb-4 text-background-secondary">
                                    Información
                                </h2>
                                <dl className="space-y-4 text-sm">
                                    <div>
                                        <dt className="text-background-little-1 font-medium">
                                            Ubicación
                                        </dt>
                                        <dd className="text-background-secondary mt-1">
                                            {event.location}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-background-little-1 font-medium">
                                            Horario
                                        </dt>
                                        <dd className="text-background-secondary mt-1">
                                            {new Date(event.startDate).toLocaleString("es-PE", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                            <br />
                                            <span className="text-xs opacity-70">hasta</span>
                                            <br />
                                            {new Date(event.endDate).toLocaleString("es-PE", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-background-little-1 font-medium">
                                            Costo Entrada
                                        </dt>
                                        <dd className="text-background-secondary mt-1 font-bold">
                                            {event.costEntry > 0
                                                ? `S/ ${event.costEntry.toFixed(2)}`
                                                : "Gratis"}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </section>
                    </div>
                </>
            )}
        </div>
    );
}
