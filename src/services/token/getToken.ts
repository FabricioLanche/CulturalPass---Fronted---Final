import { EventRegistrationTokenResponse } from "@src/interfaces/event/EventRegistrationTokenResponse";
import { getTokenServerAction } from "@src/utils/jwt";
import loaderEnv from "@src/utils/loaderEnv";

const API_URL = loaderEnv("BACKEND_URL") + "/api/token";



export const getTokenOfInscription = async (idEvent: string): Promise<EventRegistrationTokenResponse> => {
    const token = await getTokenServerAction();
    const res = await fetch(`${API_URL}/user/me/event/${idEvent}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!res.ok) {
        console.error("Failed to fetch token of inscription:", res.statusText);
        throw new Error("Error fetching token of inscription");
    }
    const data: EventRegistrationTokenResponse = await res.json();
    return data;

}
