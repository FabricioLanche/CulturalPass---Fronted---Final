'use client';
import { QRCodeSVG } from 'qrcode.react';

export function QrFromText({
    text,
    size = 240,
    className = '',
}: { text: string; size?: number; className?: string }) {
    return (
        <div className={`inline-block p-3 rounded-2xl bg-white ${className}`}>
            <QRCodeSVG
                value={text}   // ← tu string
                size={size}
                level="M"       // L, M, Q, H (más alto = más tolerante a errores)
                includeMargin
            />
        </div>
    );
}
