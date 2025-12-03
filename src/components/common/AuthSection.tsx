// src/components/AuthSection.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export const AuthSection = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (status === "loading") return <div>Loading...</div>;

  if (status === "authenticated") {
    const role = ((session?.user as any)?.role as string) ?? "CLIENTE";
    const firstName = (session?.user as any)?.firstName ?? "";
    const firstLetter = firstName?.[0]?.toUpperCase?.() ?? "U";

    return (
      <div className="flex items-center gap-3">
        {/* Controles solo para ADMIN */}
        {role === "ADMIN" && (
          <div className="flex items-center gap-2">


            <Link
              href="/dashboard/statistics"
              className="min-w-fit mx-1 px-3 py-2 rounded-3xl border-2 border-background-secondary text-background-secondary hover:bg-background-secondary hover:text-white text-sm"
              aria-label="Ver estadísticas"
            >
              Estadísticas
            </Link>

            <Link
              href="/dashboard/events"
              className="min-w-fit mx-1 px-3 py-2 rounded-3xl border-2 border-background-secondary text-background-secondary hover:bg-background-secondary hover:text-white text-sm"
              aria-label="Gestionar eventos"
            >
              Eventos
            </Link>

            {/* Nuevo: Crear evento (formulario) */}
            <Link
              href="/dashboard/events/create"
              className="min-w-fit mx-1 px-3 py-2 rounded-3xl bg-background-little-1 text-white text-sm"
              aria-label="Crear evento"
            >
              Crear evento
            </Link>

            {/* Nuevo: Validador de QR */}
            <Link
              href="/dashboard/tokens/scan"
              className="min-w-fit mx-1 px-3 py-2 rounded-3xl border-2 border-background-secondary text-background-secondary hover:bg-background-secondary hover:text-white text-sm"
              aria-label="Validar QR"
            >
              Validar QR
            </Link>
          </div>
        )}

        {/* Avatar + Perfil */}
        <div className="flex items-center rounded-3xl bg-background px-3 py-2 gap-3">
          <div
            className="bg-background-little-1 rounded-full h-9 w-9 flex items-center justify-center text-white font-bold text-sm"
            aria-hidden
          >
            {firstLetter}
          </div>
          <Link href="/profile" className="flex flex-col truncate" aria-label="Ir a mi perfil">
            <p className="text-background-little-1 text-xs">Bienvenido:</p>
            <p className="text-background-little-1 text-sm font-bold truncate">
              {firstName || "Usuario"}
            </p>
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="min-w-fit mx-1 px-3 py-2 bg-transparent text-background-secondary rounded-3xl border-background-secondary border-2 transition-colors cursor-pointer hover:bg-background-secondary hover:text-white text-sm"
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  // Usuario NO autenticado
  const qs = searchParams?.toString?.() ?? "";
  const currentPathWithQuery = `${pathname}${qs ? `?${qs}` : ""}`;
  const callbackParam =
    pathname !== "/" ? `?callbackUrl=${encodeURIComponent(currentPathWithQuery)}` : "";

  return (
    <div className="flex items-center gap-2 text-background-secondary">
      <div className="p-1 text-sm">
        <Link
          href={`/auth/login${callbackParam}`}
          className="block px-3 py-1 rounded-md hover:bg-bg-alternative"
        >
          Iniciar sesión
        </Link>
      </div>
      <div className="p-1">
        <Link
          href="/auth/register"
          className="block px-3 py-1 rounded-md border border-background-secondary hover:bg-white/10"
        >
          Crear cuenta
        </Link>
      </div>
    </div>
  );
};
