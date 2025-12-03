import React from 'react';

export default function ProfileLoading() {
  return (
    <div className="p-6 max-w-3xl mx-auto bg-background rounded-md">
      <div className="flex gap-4 items-center mb-4">
        <div className="h-24 w-24 rounded-full bg-white/20 animate-pulse" />
        <div className="flex-1">
          <div className="h-5 w-1/2 rounded bg-white/20 animate-pulse mb-2" />
          <div className="h-3 w-1/4 rounded bg-white/20 animate-pulse" />
        </div>
      </div>

      <div className="grid gap-3">
        <div className="h-11 rounded bg-white/20 animate-pulse" />
        <div className="h-11 rounded bg-white/20 animate-pulse" />
      </div>
    </div>
  );
}
