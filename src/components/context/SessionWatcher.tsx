"use client";
import { useSession, signOut } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNotification } from './NotificationContext';

export default function SessionWatcher() {
    const { data: session } = useSession();
    const { showNotification } = useNotification();

    useEffect(() => {
        if (!session?.accessToken) return;

        // Decodifica el accessToken del backend
        let decoded: { exp?: number } = {};
        try {
            decoded = jwtDecode(session.accessToken);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            // Si el token no es válido, cierra sesión
            signOut();
            return;
        }

        if (!decoded.exp) return;

        const expMs = decoded.exp * 1000;
        const now = Date.now();
        const timeLeft = expMs - now;
        const notifyTime = timeLeft - 10000;

        let notifyTimeout: NodeJS.Timeout;
        let logoutTimeout: NodeJS.Timeout;

        if (notifyTime > 0) {
            notifyTimeout = setTimeout(() => {
                showNotification({ type: "info", message: "Tu sesión está por expirar en 10 segundos." });
            }, notifyTime);
        }

        if (timeLeft > 0) {
            logoutTimeout = setTimeout(() => {
                signOut();
            }, timeLeft);
        } else {
            // Si ya expiró, cierra sesión inmediatamente
            signOut();
        }

        return () => {
            clearTimeout(notifyTimeout);
            clearTimeout(logoutTimeout);
        };
    }, [session?.accessToken, showNotification]);

    return null;
}