import React from 'react';

export default function AuthLoading() {
  return (
    <div className="p-6 max-w-md mx-auto bg-background rounded-lg">
      <div className="h-9 w-3/5 rounded bg-white/30 animate-pulse mb-5" />

      <div className="flex flex-col gap-3">
        <div className="h-11 rounded bg-white/20 animate-pulse" />
        <div className="h-11 rounded bg-white/20 animate-pulse" />
        <div className="h-11 rounded bg-white/20 animate-pulse" />
      </div>
    </div>
  );
}
