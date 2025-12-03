import React from 'react';

export default function OverviewLoading() {
    return (
        <div className="p-6 bg-background rounded-md">
            <div className="h-7 w-2/5 rounded-md bg-white/30 animate-pulse mb-4" />

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-36 rounded-lg bg-white/20 animate-pulse" />
                ))}
            </div>
        </div>
    );
}
