"use client";


import { EventRegistrationTokenResponse } from "@src/interfaces/event/EventRegistrationTokenResponse";
import { QrFromText } from "@src/components/common/QRGenerator";

export default function InscriptionInfo({ info }: { info: EventRegistrationTokenResponse }) {


    return (
        <section className="w-full max-w-5xl mx-auto p-6 rounded-xl shadow-md bg-bg-alternative text-foreground">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Información de inscripción</h1>
                <p className="text-sm text-gray-700 mt-1">Presenta este código QR en la entrada o comparte tu token.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-1 flex flex-col items-center">
                    <div className="p-4 bg-bg-alternative rounded-lg">
                        <QrFromText text={info.token} size={256} />
                    </div>

                </div>

                <div className="md:col-span-2 bg-white/80 p-4 rounded-lg">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">{info.eventTitle}</h2>
                        <p className="text-sm text-gray-600">Correo registrado: <span className="font-medium">{info.userEmail}</span></p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Ticket para</p>
                            <p className="font-semibold text-lg">{info.userName}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">Estado</p>
                            {info.validated ? (
                                <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Validado</span>
                            ) : (
                                <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">No validado</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
