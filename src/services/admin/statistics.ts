// src/services/admin/statistics.ts
import loaderEnv from "@src/utils/loaderEnv";
const BASE_URL = loaderEnv("BACKEND_URL");

function auth(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function getMonthlyUsersEnrolled(
  token: string,
  month: number,
  year: number
) {
  const res = await fetch(
    `${BASE_URL}/api/statistics/monthly-users-enrolled?month=${month}&year=${year}`,
    { headers: auth(token), cache: "no-store" }
  );
  if (!res.ok) throw new Error("No se pudo obtener usuarios inscritos del mes");
  return res.json(); // { totalUsers: number, ... }
}

export async function getPendingEvents(token: string) {
  const res = await fetch(`${BASE_URL}/api/statistics/pending-events`, {
    headers: auth(token),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudo obtener eventos pendientes");
  return res.json(); // { totalPending: number, ... }
}

export async function getYearlyEvents(token: string, year: number) {
  const res = await fetch(
    `${BASE_URL}/api/statistics/yearly-events?year=${year}`,
    { headers: auth(token), cache: "no-store" }
  );
  if (!res.ok) throw new Error("No se pudo obtener eventos del año");
  return res.json(); // { totalEvents: number, ... }
}

export async function getMonthlyRevenue(
  token: string,
  month: number,
  year: number
) {
  const res = await fetch(
    `${BASE_URL}/api/statistics/monthly-revenue?month=${month}&year=${year}`,
    { headers: auth(token), cache: "no-store" }
  );
  if (!res.ok) throw new Error("No se pudo obtener la recaudación mensual");
  return res.json(); // { totalRevenue: number, ... }
}

export async function getMonthlyEnrollmentRecord(
  token: string,
  month: number,
  year: number
) {
  const res = await fetch(
    `${BASE_URL}/api/statistics/monthly-enrollment-record?month=${month}&year=${year}`,
    { headers: auth(token), cache: "no-store" }
  );
  if (!res.ok) throw new Error("No se pudo obtener el récord de inscripciones");
  return res.json(); // { maxEnrollmentsInADay: number, dateOfRecord: string, ... }
}
