import React from 'react';

export default function MyEventsLoading() {
  return (
    <div className="p-6 bg-background rounded-md">
      <div className="h-7 w-2/5 rounded bg-white/30 animate-pulse mb-4" />

      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-lg bg-white/20 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
