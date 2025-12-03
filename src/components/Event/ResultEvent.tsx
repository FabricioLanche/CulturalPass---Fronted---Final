import { PaginatedResponse } from "@src/interfaces/common/PaginatedResponse";
import { EventResponse } from "@src/interfaces/event/EventResponse";

import { EventCard } from "../common/Cards";
import PaginationNavegation from "../common/PaginationNavegation";

export default function ResultEvent({ event }: { event: PaginatedResponse<EventResponse> }) {
    

    return (
        <div className="w-11/12 p-4 mx-auto">
            <h1 className="text-2xl font-bold mb-4 my-3">Search Results</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
                {event.content.length === 0 ? (
                <p>No events found.</p>
            ) : (
                event.content.map((item) => (
                    <EventCard key={item.id} data={item} />
                ))
            )}
            </div>
            <PaginationNavegation page={event.currentPage} size={event.size} totalPages={event.totalPages} />
        </div>
    )
}