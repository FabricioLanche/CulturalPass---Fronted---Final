import { PaginatedResponse } from "@src/interfaces/common/PaginatedResponse"
import { EventResponse } from "@src/interfaces/event/EventResponse"
import { getTokenServerAction } from "@src/utils/jwt"
import loaderEnv from "@src/utils/loaderEnv"


const API_URL = loaderEnv("BACKEND_URL") + "/api/user"


export const getEvents = async (): Promise<PaginatedResponse<EventResponse>> => {
    const token = await getTokenServerAction()

    const res = await fetch(`${API_URL}/me/events`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Application-Type': 'application/json'
        }
    })
    if (!res.ok) {
        throw new Error('Failed to fetch user events')
    }
    const data = await res.json() as PaginatedResponse<EventResponse>
    return data
}