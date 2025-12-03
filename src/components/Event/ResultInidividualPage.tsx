"use client";
import { EventResponse } from "@src/interfaces/event/EventResponse";
import { TypeMiniCard, TagsList } from '../common/Cards';
import { LocationIcon } from '../lib/icons';
import { EnrollButton } from '../common/Buttons';
import { ServerActionResponse } from "@src/interfaces/common/ServerActionResponse";
import Link from "next/link";


export default function ResultIndividualPage({ data, dataEnrollment }: { data: EventResponse, dataEnrollment: ServerActionResponse<boolean> }) {
    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-bg-alternative rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row gap-6">

            <div className="md:w-8/12 w-full p-4 md:p-8 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-4 md:gap-6">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-background-secondary leading-tight">{data.title}</h1>
                    <div className="flex items-center">
                        <TypeMiniCard type={data.type} />
                    </div>
                </div>



                <p className="text-sm sm:text-base md:text-lg text-background-secondary my-4 leading-7">{data.description}</p>

                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        <TagsList tags={data.tags} />
                    </div>
                </div>

                <div className="bg-background rounded-4xl p-5 mt-2">
                    <div className="text-center">
                        <h2 className="text-lg md:text-xl text-background-secondary font-bold my-3">Detalles del evento</h2>
                    </div>
                    <div className="flex items-start md:items-center gap-3 mb-4 flex-col sm:flex-row">
                        <div className="flex-shrink-0">
                            <LocationIcon className="text-background-secondary w-5 h-5" />
                        </div>
                        <span className="text-sm md:text-lg text-background-secondary break-words">{data.location}</span>
                    </div>
                    <div className="mb-3">
                        <p className="capitalize text-sm md:text-lg text-background-secondary">📅 {new Date(data.startDate).toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                    <div>
                        <p className="text-sm md:text-lg text-background-secondary">⏰ {new Date(data.startDate).toLocaleTimeString("es-ES", { hour: "numeric", minute: "numeric", hour12: true })}</p>
                    </div>
                </div>


            </div>

            <aside className="md:w-4/12 w-full p-4 md:p-6 flex flex-col items-center md:items-stretch justify-start">
                <div className="w-full rounded-2xl overflow-hidden shadow-inner">
                    {/*eslint-disable-next-line @next/next/no-img-element  */}
                    <img
                        src={data.imageUrl}
                        alt={data.title}
                        className="w-full h-64 sm:h-72 md:h-60 lg:h-72 object-cover"
                    />
                </div>

                {/*Section for enroll button */}
                <div className="w-full flex flex-col items-center justify-center my-6 md:my-10">
                    {!dataEnrollment.data ? (
                        <EnrollButton idEvent={data.id.toString()} >
                            Inscribirse {data.costEntry > 0 ? `- S/${data.costEntry}` : "(Gratis)"}
                        </EnrollButton>
                    ) : (
                        <Link href={`/myevents/${data.id}`} className="w-full text-center md:w-auto rounded-3xl px-4 py-3 bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300">
                            Ir al panel del evento
                        </Link>
                    )}
                </div>

            </aside>

        </div>
    );
}