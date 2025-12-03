"use server";
import { EventResponse } from "@src/interfaces/event/EventResponse";
import loaderEnv from "@src/utils/loaderEnv"

const API_URL = loaderEnv("BACKEND_URL") + "/api/event"

export const getEventById = async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Error fetching event");
    }

    
    
    return response.json() as Promise<EventResponse>;
}