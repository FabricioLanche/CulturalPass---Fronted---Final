"use client";

import { EventResponse } from "@src/interfaces/event/EventResponse";
import { TimeLeftCounterNoSSR, TimeToCloseEventNoSSR,  TypeMiniCard } from "../common/Cards";
import Image from 'next/image';

export const EventSection = ({event} : {event: EventResponse}) => {
    const isEventStarted = new Date(event.startDate).getTime() <= Date.now();
    const isEventEnded = new Date(event.endDate).getTime() < Date.now();
    return (
        <section aria-labelledby={`event-${event.id}-title`} className="max-w-4xl mx-auto p-6 bg-background rounded-2xl shadow-md">
            <div className="flex flex-col ">
                <div className="w-full rounded-lg overflow-hidden bg-gradient-to-br from-[var(--background)] to-[var(--background-tertiary)]">
                    <Image
                        width={500}
                        height={295}
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full mx-auto"
                    />
                </div>

                <div className=" w-full  flex flex-col justify-between">
                    <div className="my-5">
                        <div className="flex items-center justify-between">
                            <h2 id={`event-${event.id}-title`} className="text-xl md:text-2xl font-bold text-[var(--foreground)]">{event.title}</h2>
                            <div className="ml-3">
                                <TypeMiniCard type={event.type} />
                            </div>
                        </div>

                        <div className=" text-sm text-gray-700">
                            {isEventEnded ? (
                                <span className="text-red-600 font-semibold my-7">Evento finalizado</span>
                            ) : isEventStarted ? (
                                <TimeToCloseEventNoSSR endDate={event.endDate} />
                            ) : (
                                <TimeLeftCounterNoSSR startDate={event.startDate} />
                            )}
                        </div>
                        <div className="mt-4">
                            <div className="flex flex-wrap gap-2">
                                {/* TagsList no se importa aquí para mantener foco visual; si quieres, lo añadimos */}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 p-4 rounded-xl border border-[var(--background-secondary)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="block text-sm text-gray-600">Precio</span>
                                <span className="text-xl font-extrabold text-[var(--background-secondary)]">
                                    {event.costEntry && event.costEntry > 0 ? `S/${event.costEntry.toFixed(2)}` : "Gratis"}
                                </span>
                            </div>

                            <div className="text-right">
                                <span className="block text-sm text-gray-600">Cupos</span>
                                <span className="text-lg font-medium">{Math.max(0, event.capacity - event.currentEnrollments)} / {event.capacity}</span>
                            </div>
                        </div>

                        <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-2 bg-[var(--background-secondary)]"
                                    style={{ width: `${Math.min(100, (event.currentEnrollments / Math.max(1, event.capacity)) * 100)}%` }}
                                    aria-hidden
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-3">

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
