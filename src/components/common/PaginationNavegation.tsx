"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

type Props = {
    page: number; // zero-based
    size: number;
    totalPages: number; // total number of pages (>= 1)
    onPageChange?: (newPage: number) => void; // optional callback
};

export default function PaginationNavegation({ page, size, totalPages, onPageChange }: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();

    // guard and normalize inputs
    const safeTotal = Math.max(1, Math.floor(totalPages));
    const safePage = Math.min(Math.max(0, Math.floor(page)), Math.max(0, safeTotal - 1));
    const safeSize = Math.max(1, Math.floor(size));

    const buildQueryAndNavigate = useCallback(
        (targetPage: number) => {
            const clamped = Math.min(Math.max(0, Math.floor(targetPage)), safeTotal - 1);
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", clamped.toString());
            params.set("size", safeSize.toString());
            const queryString = params.toString();
            // update router
            router.push(`?${queryString}`);
            // optional callback
            if (onPageChange) onPageChange(clamped);
        },
        [router, searchParams, safeSize, safeTotal, onPageChange]
    );

    const handleFirst = useCallback(() => buildQueryAndNavigate(0), [buildQueryAndNavigate]);
    const handlePrev = useCallback(() => buildQueryAndNavigate(safePage - 1), [buildQueryAndNavigate, safePage]);
    const handleNext = useCallback(() => buildQueryAndNavigate(safePage + 1), [buildQueryAndNavigate, safePage]);
    const handleLast = useCallback(() => buildQueryAndNavigate(safeTotal - 1), [buildQueryAndNavigate, safeTotal]);

        const infoText = useMemo(() => `Página ${safePage + 1} de ${safeTotal} — ${safeSize} por página`, [safePage, safeTotal, safeSize]);

        return (
            <nav aria-label="Paginación" className="flex gap-3 items-center flex-wrap text-sm w-full justify-center px-6 py-12">
                <div className="flex gap-2 items-center">
                    <button
                        aria-label="Primera página"
                        onClick={handleFirst}
                        disabled={safePage <= 0}
                        className={`px-3 py-2 rounded-md border bg-white text-gray-700 border-gray-200 transition ${safePage <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                        « Primero
                    </button>

                    <button
                        aria-label="Página anterior"
                        onClick={handlePrev}
                        disabled={safePage <= 0}
                        className={`px-3 py-2 rounded-md border bg-white text-gray-700 border-gray-200 transition ${safePage <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                        ‹ Anterior
                    </button>
                </div>

                <div className="text-gray-800" aria-live="polite">{infoText}</div>

                <div className="flex gap-2 items-center">
                    <button
                        aria-label="Página siguiente"
                        onClick={handleNext}
                        disabled={safePage + 1 >= safeTotal}
                        className={`px-3 py-2 rounded-md border bg-white text-gray-700 border-gray-200 transition ${safePage + 1 >= safeTotal ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                        Siguiente ›
                    </button>

                    <button
                        aria-label="Última página"
                        onClick={handleLast}
                        disabled={safePage + 1 >= safeTotal}
                        className={`px-3 py-2 rounded-md border bg-white text-gray-700 border-gray-200 transition ${safePage + 1 >= safeTotal ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                        Última »
                    </button>
                </div>
            </nav>
        );
}