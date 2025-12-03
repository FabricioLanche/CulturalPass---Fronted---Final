"use client";

import Link from "next/link";

export default function FinalResult({ idEvent }: { idEvent: string }) {
    return (
        <div className="w-full flex items-center justify-center py-8">
            <div className="max-w-md w-full bg-white/90 rounded-2xl shadow-md p-8 text-center">
                <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center rounded-full bg-green-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Registro exitoso</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Te has registrado oficialmente para el evento. ¡Nos vemos allí!
                </p>

                <div className="flex gap-3 justify-center flex-col sm:flex-row">
                    <Link href={`/myevents/${idEvent}`} className="inline-flex items-center justify-center px-5 py-2 bg-background-secondary text-white rounded-md hover:bg-background-secondary/90 transition-all">
                        Ver mi entrada
                    </Link>
                    <Link href="/" className="inline-flex items-center justify-center px-5 py-2 border border-background rounded-md text-gray-700 hover:bg-background-secondary/80 hover:text-white transition-all ">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
