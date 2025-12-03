// src/interfaces/event/Event.ts
import { EventStatus, EventType } from "./enums";

export interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  startDate: string; // ISO
  endDate: string;   // ISO
  location: string;
  type: EventType;
  status: EventStatus;
  capacity: number;
  costEntry: number;
  tags: string[];
}
