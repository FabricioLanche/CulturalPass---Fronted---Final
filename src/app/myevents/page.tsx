import EventsEnrolled from "@src/components/myevents/EventsEnrroled";
import { getEvents } from "@src/services/user/getEvents";

export default async function MyEventsPage() {
    const events = await getEvents();


    return (
        <EventsEnrolled events={events.content} />
    );
}