import React from 'react';

export default function PaymentLoading() {
  return (
    <div className="p-6 max-w-3xl mx-auto bg-background rounded-md">
      <div className="h-7 w-2/5 rounded bg-white/30 animate-pulse mb-4" />

      <div className="grid gap-3">
        <div className="h-14 rounded bg-white/20 animate-pulse" />
        <div className="h-60 rounded bg-white/20 animate-pulse" />
      </div>
    </div>
  );
}
