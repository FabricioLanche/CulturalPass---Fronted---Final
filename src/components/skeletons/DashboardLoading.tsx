import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="p-6 bg-background rounded-md">
      <div className="h-7 w-1/3 rounded bg-white/30 animate-pulse mb-4" />

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-lg bg-white/20 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
