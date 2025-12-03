"use client";

import { useEffect, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

type Props = {
  onDecode: (text: string) => void;
  onError?: (err: unknown) => void;
  paused?: boolean;                     // si true, detiene la cámara
  deviceId?: string | null;             // cámara específica (opcional)
  className?: string;
};

export default function ZXingScanner({
  onDecode,
  onError,
  paused = false,
  deviceId = null,
  className,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserQRCodeReader | null>(null);
  const stopFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    readerRef.current = new BrowserQRCodeReader();
    return () => {
      // cleanup al desmontar
      try { stopFnRef.current?.(); } catch {}
      try {
        const stream = videoRef.current?.srcObject as MediaStream | null;
        stream?.getTracks().forEach(t => t.stop());
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    // detener si está en pausa
    if (paused) {
      try { stopFnRef.current?.(); } catch {}
      const stream = videoRef.current.srcObject as MediaStream | null;
      stream?.getTracks().forEach(t => t.stop());
      return;
    }

    const reader = readerRef.current!;
    // función de decodificación continua
    reader.decodeFromVideoDevice(
      deviceId ?? undefined,
      videoRef.current,
      (result, err, controls) => {
        // guardo stop para poder pausar a demanda
        stopFnRef.current = () => controls.stop();

        if (result) {
          onDecode(result.getText());
        }
        // ZXing lanza errores por frames no válidos: los ignoramos
        if (err && onError) onError(err);
      }
    );

    return () => {
      try { stopFnRef.current?.(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, deviceId]);

  return (
    <div className={className}>
      {/* vídeo sin controls */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        autoPlay
      />
    </div>
  );
}
