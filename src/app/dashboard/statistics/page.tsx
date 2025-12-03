// src/app/dashboard/statistics/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getMonthlyUsersEnrolled,
  getPendingEvents,
  getYearlyEvents,
  getMonthlyRevenue,
  getMonthlyEnrollmentRecord,
} from "@src/services/admin/statistics";

// Recharts
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type DailyRec = { date: string; enrollments: number };

export default function AdminStatisticsPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    users: { totalUsers: number };
    pending: { totalPendingEvents: number };
    yearly: { totalEvents: number };
    revenue: { totalRevenue: number; totalEnrollments: number };
    record: {
      month: number;
      year: number;
      totalEnrollments: number;
      dailyRecords: DailyRec[];
    };
  } | null>(null);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const [users, pending, yearly, revenue, record] = await Promise.all([
          getMonthlyUsersEnrolled(token, month, year),
          getPendingEvents(token),
          getYearlyEvents(token, year),
          getMonthlyRevenue(token, month, year),
          getMonthlyEnrollmentRecord(token, month, year),
        ]);
        setStats({ users, pending, yearly, revenue, record });
      } catch (e: any) {
        setErr(e.message ?? "No se pudo cargar la analítica");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, month, year]);

  // Normaliza datos para la gráfica
  const dailyData = useMemo(() => {
    if (!stats?.record?.dailyRecords) return [];
    return stats.record.dailyRecords.map((d: any) => ({
      key: d.date,
      dateLabel: new Date(d.date).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
      }),
      enrollments: Number(d.enrollments ?? 0),
    }));
  }, [stats]);

  const currency = (n: number | undefined) =>
    (Number(n ?? 0)).toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-background-secondary">
            Estadísticas
          </h1>
          <p className="text-sm text-background-little-1 mt-1 font-medium">
            Resumen del mes {month.toString().padStart(2, "0")}/{year}
          </p>
        </div>
      </header>

      {/* Estados */}
      {loading && (
        <div className="rounded-xl bg-background-tertiary/50 p-8 animate-pulse text-center text-background-little-1">
          Cargando estadísticas...
        </div>
      )}
      {err && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700">
          {err}
        </div>
      )}

      {/* KPIs */}
      {!!stats && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Usuarios inscritos"
            value={stats.users?.totalUsers ?? 0}
            hint="Este mes"
            icon="👥"
          />
          <KpiCard
            label="Eventos pendientes"
            value={stats.pending?.totalPendingEvents ?? 0}
            hint="Próximos a realizarse"
            icon="📅"
          />
          <KpiCard
            label="Eventos anuales"
            value={stats.yearly?.totalEvents ?? 0}
            hint={`Total año ${year}`}
            icon="📊"
          />
          <KpiCard
            label="Recaudación"
            value={currency(stats.revenue?.totalRevenue)}
            hint={`${stats.revenue?.totalEnrollments ?? 0} inscripciones`}
            icon="💰"
          />
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfica */}
        {!!stats && dailyData.length > 0 && (
          <section className="lg:col-span-2 rounded-2xl border border-background-little-1/20 bg-background-tertiary/60 backdrop-blur-md p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-background-secondary">
              <span className="w-2 h-2 rounded-full bg-background-little-1"></span>
              Tendencia de Inscripciones
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyData}
                  margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorEnrollments"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ba7c3f" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ba7c3f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.1}
                    vertical={false}
                    stroke="#8B4513"
                  />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fontSize: 12, fill: "#8B4513" }}
                    tickMargin={10}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    width={32}
                    tick={{ fontSize: 12, fill: "#8B4513" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#f5eccf",
                      border: "1px solid #ba7c3f",
                      borderRadius: 12,
                      boxShadow: "0 10px 15px -3px rgba(139, 69, 19, 0.1)",
                      color: "#8B4513",
                    }}
                    itemStyle={{ color: "#ba7c3f", fontWeight: "bold" }}
                    labelStyle={{ color: "#8B4513", marginBottom: "0.25rem" }}
                    labelFormatter={(l) => `Fecha: ${l}`}
                    formatter={(v) => [`${v} inscripciones`, "Total"]}
                    cursor={{ stroke: "#ba7c3f", strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="enrollments"
                    stroke="#ba7c3f"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorEnrollments)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Tabla Resumen (Top días) */}
        {!!stats && dailyData.length > 0 && (
          <section className="rounded-2xl border border-background-little-1/20 bg-background-tertiary/60 backdrop-blur-md p-6 shadow-xl flex flex-col">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-background-secondary">
              <span className="w-2 h-2 rounded-full bg-background-little-2"></span>
              Mejores días
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-background-little-1 border-b border-background-little-1/10">
                    <th className="pb-3 font-medium">Fecha</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background-little-1/10">
                  {[...dailyData]
                    .sort((a, b) => b.enrollments - a.enrollments)
                    .slice(0, 8) // Top 8
                    .map((row, i) => (
                      <tr key={row.key} className="group">
                        <td className="py-3 text-background-secondary group-hover:text-background-little-1 transition-colors">
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-[10px] w-5 h-5 flex items-center justify-center rounded-full ${i < 3
                                  ? "bg-background-little-2/20 text-background-little-2 border border-background-little-2/30"
                                  : "bg-background-secondary/5 text-background-secondary/70"
                                }`}
                            >
                              {i + 1}
                            </span>
                            {row.dateLabel}
                          </div>
                        </td>
                        <td className="py-3 text-right font-bold text-background-secondary">
                          {row.enrollments}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function KpiCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon?: string;
}) {
  return (
    <div className="rounded-2xl bg-background-tertiary/60 backdrop-blur-md p-5 shadow-lg border border-background-little-1/20 hover:bg-background-tertiary/80 transition-all group">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-background-little-1 group-hover:text-background-secondary transition-colors">
          {label}
        </p>
        {icon && (
          <span className="text-xl opacity-70 grayscale group-hover:grayscale-0 transition-all text-background-little-1">
            {icon}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-background-secondary tracking-tight tabular-nums">
        {value}
      </p>
      {hint && (
        <p className="text-xs text-background-secondary/60 mt-1 group-hover:text-background-secondary/80 transition-colors">
          {hint}
        </p>
      )}
    </div>
  );
}
