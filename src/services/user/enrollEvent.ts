"use server";

import { getTokenServerAction } from "@src/utils/jwt";
import loaderEnv from "@src/utils/loaderEnv";

const API_URL = loaderEnv("BACKEND_URL");

export const enrollEvent = async (eventId: string): Promise<void> => {
    const token = await getTokenServerAction();
    const res = await fetch(`${API_URL}/api/user/me/enroll/${eventId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al inscribirse en el evento:", errorData);
        throw new Error("Failed to enroll in event");
    }
    console.log("Inscripción exitosa en el evento:", res);
};
