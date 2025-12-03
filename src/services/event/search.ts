"use server";
import { PaginatedResponse } from "@src/interfaces/common/PaginatedResponse";
import { EventResponse } from "@src/interfaces/event/EventResponse";
import loaderEnv from "@src/utils/loaderEnv"

const API_URL = loaderEnv("BACKEND_URL") + "/api/event"

export const findByTermPaginated = async (term: string, page: number, limit?: number) => {

    const params = new URLSearchParams();
    params.append("term", term);
    params.append("currentPage", page.toString());
    if (limit) {
        params.append("pageSize", limit.toString());
    }


    const res = await fetch(`${API_URL}/filtered?${params.toString()}`, {
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Error fetching events");
    }

    const data: PaginatedResponse<EventResponse> = await res.json();
    return data;
}