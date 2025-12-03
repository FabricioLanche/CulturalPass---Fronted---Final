import { EventStatus, EventType } from "./enums";

export interface EventResponse { 
    id: number,
    title: string,
    description: string,
    imageUrl: string,
    startDate: string, // ISO 8601
    endDate: string, // ISO 8601
    location: string,
    type: EventType,
    status: EventStatus,
    tags: string[]
    costEntry: number,
    capacity: number,
    currentEnrollments: number
}