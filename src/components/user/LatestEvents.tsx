import { EventResponse } from "@src/interfaces/event/EventResponse";
import { getLatestEvents } from "@src/services/user/getLatestEvents";
import { TypeMiniCard, TimeLeftCounterNoSSR, TimeToCloseEventNoSSR } from '@src/components/common/Cards';
import { RightArrowIcon } from "@src/components/lib/icons";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/app/api/auth/[...nextauth]/route";


const MiniItem = ({ event }: { event: EventResponse }) => {
    const isEventStarted = new Date(event.startDate).getTime() <= Date.now();
    const isEventEnded = new Date(event.endDate).getTime() < Date.now();

    return (
        <div className="border-2 border-background-secondary p-3 rounded-2xl flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3">
            <div className="flex-shrink-0">
                <TypeMiniCard type={event.type} />
            </div>

            <div className="flex flex-row gap-8 sm:gap-0 sm:flex-col items-center">
                <p className="text-base sm:text-lg font-medium">{event.title}</p>
                <div className="mt-2 mx-auto">
                    {isEventEnded ? (
                        <span className="text-red-600 font-semibold">Evento finalizado</span>
                    ) : isEventStarted ? (
                        <TimeToCloseEventNoSSR endDate={event.endDate} className="text-sm" />
                    ) : (
                        <TimeLeftCounterNoSSR startDate={event.startDate} className="text-sm" />
                    )}
                </div>
            </div>

            <div className="flex flex-col mx-auto sm:mx-0">
                <Link href={`/myevents/${event.id}`} className="inline-flex items-center justify-center p-2">
                    <RightArrowIcon className=" w-8 h-8 text-background-secondary" />
                </Link>
            </div>
        </div>
    )
}

export default async function LatestEvents() {
    const session = await getServerSession(authOptions);
    const role = (session as any)?.user?.role;

    let events: EventResponse[] = [];

    // Si es admin, no intentamos fetchear eventos de usuario
    if (role === 'ADMIN') {
        events = [];
    } else {
        try {
            events = await getLatestEvents();
        } catch (error) {
            console.error("Failed to load latest events:", error);
            // Fallback: events remains []
        }
    }
    return (
        <div className="w-full max-w-xl mx-auto p-4 sm:p-6 bg-background-tertiary shadow-md rounded-2xl">

            <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">Eventos Recientes</h2>

            <div className="space-y-3">
                {events.length === 0 ? (
                    <p className="text-center my-5">No hay eventos recientes.</p>
                ) : (
                    events.map((event) => (
                        <MiniItem event={event} key={event.id} />
                    ))
                )}
            </div>


            <div className="text-center my-4">
                <Link href="/myevents" className="inline-block bg-background-secondary px-4 py-2 text-white rounded-xl">
                    Ver todos los eventos
                </Link>
            </div>
        </div>
    )
}
