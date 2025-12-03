"use server"

import { getToken } from "next-auth/jwt"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { NEXTAUTH_SECRET } from "@src/config/auth"

export async function getTokenServerAction() {
    const cookieStore = await cookies()
    const req = new NextRequest("http://localhost", {
        headers: { cookie: cookieStore.toString() },
    })

    const token = await getToken({
        req,
        secret: NEXTAUTH_SECRET,
    })

    console.log("DEBUG: getTokenServerAction - Cookies present:", cookieStore.getAll().map(c => c.name));
    console.log("DEBUG: getTokenServerAction - Token found:", !!token);
    if (token) {
        console.log("DEBUG: getTokenServerAction - Token keys:", Object.keys(token));
    }

    if (!token?.accessToken) {
        throw new Error("No hay token de autenticación disponible")
    }

    return token.accessToken as string
}
