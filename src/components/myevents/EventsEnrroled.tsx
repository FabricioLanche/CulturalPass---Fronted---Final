import { EventResponse } from "@src/interfaces/event/EventResponse";
import { SmallEventItem } from "../common/Cards";


export default function EventsEnrolled({events}: {events: EventResponse[]}) {
    return (
        <div className="w-full">
            <h2 className="text-center text-2xl text-background-secondary font-bold">Eventos de los que formas parte</h2>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-6 mt-6 px-4">
                {events.length > 0 ? events.map(event => (
                    <SmallEventItem key={event.id} data={event} />
                )) : (
                    <p className="text-center col-span-2">No estás inscrito en ningún evento.</p>
                )}
            </div>
        </div>
    );
}
