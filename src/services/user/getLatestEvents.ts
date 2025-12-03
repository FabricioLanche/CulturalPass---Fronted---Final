import { EventResponse } from "@src/interfaces/event/EventResponse";
import { getTokenServerAction } from "@src/utils/jwt";
import loaderEnv from "@src/utils/loaderEnv";

const apiUrl = loaderEnv("BACKEND_URL") + "/api/user/me/events/nearest";

export const getLatestEvents = async () => {
    const token = await getTokenServerAction();

    const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        cache: "no-store",
    });
    if (!response.ok) {
        let errorBody;
        try {
            errorBody = await response.json();
        } catch {
            errorBody = await response.text();
        }
        console.error(`Error fetching latest events: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`Error fetching latest events: ${response.status}`);
    }
    const data = await response.json();
    console.log("Latest events data:", data);
    return data as Promise<EventResponse[]>;

}
