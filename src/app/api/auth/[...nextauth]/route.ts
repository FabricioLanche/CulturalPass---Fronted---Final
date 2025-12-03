import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

import { login } from "@src/services/auth/login";
import { getUserProfile } from "@src/services/user/me";
import type { UserRoles, TokenClaims } from "@src/interfaces/auth/tokenClaims";

const NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ?? "dev-secret-solo-para-local";

export const authOptions: NextAuthOptions = {
  // JWT para exponer accessToken fácilmente en session
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,       // 1 día
    updateAge: 60 * 60 * 24 * 7 // refresco del JWT en cliente (opcional)
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null;
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          // 1) Login en tu backend → retorna { token }
          const { token } = await login({ email, password });
          if (!token) return null;

          // 2) Perfil (si falla no rompemos)
          let profile: any = null;
          try {
            profile = await getUserProfile(token);
          } catch {
            /* noop */
          }

          // 3) Claims del JWT para obtener el rol
          let role: UserRoles = "CLIENTE";
          try {
            const claims = jwtDecode<TokenClaims>(token);
            // tolerante a backends que usen "role" o "rol"
            role =
              ((claims as any)?.role as UserRoles) ||
              ((claims as any)?.rol as UserRoles) ||
              "CLIENTE";
          } catch {
            /* noop */
          }

          return {
            id: profile?.id ?? email,
            email: profile?.email ?? email,
            firstName: profile?.firstName ?? (role === "ADMIN" ? "Admin" : ""),
            lastName: profile?.lastName ?? "",
            role,
            accessToken: token,
          } as any;
        } catch {
          // En credenciales inválidas o error de red, devolver null para 401
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // Se ejecuta en login y en cada refresh de token del lado del servidor
    async jwt({ token, user }) {
      if (user) {
        // Primer paso (tras authorize)
        token.id = (user as any).id ?? token.id ?? "";
        token.email = (user as any).email ?? token.email ?? "";
        token.firstName = (user as any).firstName ?? "";
        token.lastName = (user as any).lastName ?? "";
        token.role = (user as any).role ?? "CLIENTE";
        token.accessToken = (user as any).accessToken ?? "";
        console.log("DEBUG: jwt callback - User logged in, token updated");
      }
      console.log("DEBUG: jwt callback - Token state:", { id: token.id, hasAccessToken: !!token.accessToken });
      return token;
    },

    // Lo que expones al cliente con useSession()
    async session({ session, token }) {
      // session.user puede ser tipado a tu interfaz propia si lo deseas
      (session as any).user = {
        id: (token.id as string) || "",
        email: (token.email as string) || "",
        firstName: (token.firstName as string) || "",
        lastName: (token.lastName as string) || "",
        role: ((token.role as string) as UserRoles) || "CLIENTE",
      };

      (session as any).accessToken = (token.accessToken as string) || "";
      console.log("DEBUG: session callback - Session created for user:", (session as any).user?.email);
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },

  // @ts-ignore
  trustHost: true,
  secret: NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
