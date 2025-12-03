// src/proxy.ts
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";

type TokenClaims = { role?: string };

const NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ?? "dev-secret-solo-para-local";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
  const pathname = request.nextUrl.pathname;

  // Rutas a proteger
  const adminPaths = [
    "/dashboard",
    "/dashboard/create",
    "/dashboard/events",
    "/dashboard/statistics",
    "/profile",
  ];
  const userPaths = ["/profile", "/myevents", "/tickets", "/payment"];

  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = adminPaths.some((p) => pathname.startsWith(p));
  const isUserPage = userPaths.some((p) => pathname.startsWith(p));

  // Si no hay token y quiere entrar a páginas protegidas → login con callback
  if (!token && (isAdminPage || isUserPage)) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname + request.nextUrl.search
    );
    return NextResponse.redirect(loginUrl);
  }

  // Si hay token, aplicamos reglas por rol (sin hacer loops)
  if (token) {
    let role: string = "CLIENTE";
    try {
      const decoded = jwtDecode<TokenClaims>(token.accessToken as string);
      role = decoded.role ?? "CLIENTE";
    } catch {}

    // Si está en /auth y ya está logueado → redirigir según rol
    if (isAuthPage) {
      const redirectPath = role === "ADMIN" ? "/dashboard" : "/";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // Si es ADMIN y va a rutas de usuario → mándalo al dashboard
    if (role === "ADMIN" && isUserPage && !isAdminPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Si NO es ADMIN e intenta admin → a la home
    if (role !== "ADMIN" && isAdminPage && !isUserPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Importante: no tocar /api ni estáticos
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/payment/:path*",
    "/myevents/:path*",
    "/tickets/:path*",
    "/auth/:path*",
  ],
};
