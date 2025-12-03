import React from 'react';

export default function EventLoading() {
  return (
    <div className="p-6 bg-background rounded-md">
      <div className="h-72 rounded-lg bg-white/20 animate-pulse mb-5" />

      <div className="grid gap-3">
        <div className="h-5 w-1/2 rounded bg-white/20 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-white/20 animate-pulse" />
        <div className="h-4 w-11/12 rounded bg-white/20 animate-pulse" />
      </div>
    </div>
  );
}
