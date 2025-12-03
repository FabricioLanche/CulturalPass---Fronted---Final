// src/components/qr/ClientQrScanner.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

type Props = {
  onDecode: (text: string) => void;
  onError?: (msg: string) => void;
  facingMode?: "environment" | "user";
  className?: string;
  intervalMs?: number;
  /** Fuerza el modo software (jsQR) aunque exista BarcodeDetector */
  softwareOnly?: boolean;
};

export default function ClientQrScanner({
  onDecode,
  onError,
  facingMode = "environment",
  className,
  intervalMs = 220,
  softwareOnly = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const lastDecodedRef = useRef<string>("");
  const [compatNote, setCompatNote] = useState<string | null>(null);
  const [fatalErr, setFatalErr] = useState<string | null>(null);

  // Detección robusta
  const hasBarcodeDetector = (() => {
    const w = globalThis as any;
    return (
      !softwareOnly &&
      typeof w !== "undefined" &&
      "BarcodeDetector" in w &&
      typeof w.BarcodeDetector === "function"
    );
  })();

  useEffect(() => {
    let mounted = true;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode } },
          audio: false,
        });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        if (hasBarcodeDetector) {
          // Intento con API nativa
          try {
            // @ts-ignore
            const detector = new window.BarcodeDetector({ formats: ["qr_code"] });

            const loop = async () => {
              if (!mounted || !videoRef.current) return;
              try {
                const bitmap = await createImageBitmap(videoRef.current);
                const codes = await detector.detect(bitmap);
                const raw =
                  (codes?.[0]?.rawValue as string | undefined)?.trim?.() ?? "";
                if (raw && raw !== lastDecodedRef.current) {
                  lastDecodedRef.current = raw;
                  onDecode(raw);
                }
              } catch {
                // ignorar errores transitorios del detector
              }
              rafRef.current = requestAnimationFrame(loop);
            };
            rafRef.current = requestAnimationFrame(loop);
            setCompatNote(null); // usando nativo
            return;
          } catch {
            // Si “no es constructor” u otro fallo, caemos a jsQR sin error fatal
          }
        }

        // Fallback jsQR (no mostrar error, sólo nota informativa)
        setCompatNote("Modo compatibilidad (jsQR)");
        if (!canvasRef.current) canvasRef.current = document.createElement("canvas");
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          const m = "No se pudo crear el contexto de canvas para jsQR.";
          setFatalErr(m);
          onError?.(m);
          return;
        }

        const tick = () => {
          if (!mounted || !videoRef.current) return;

          const vw = videoRef.current.videoWidth || 1280;
          const vh = videoRef.current.videoHeight || 720;

          const targetW = 640;
          const targetH = Math.max(360, Math.floor((vh / vw) * targetW));

          canvas.width = targetW;
          canvas.height = targetH;
          ctx.drawImage(videoRef.current, 0, 0, targetW, targetH);

          const imageData = ctx.getImageData(0, 0, targetW, targetH);
          const code = jsQR(imageData.data, targetW, targetH, {
            inversionAttempts: "attemptBoth",
          });

          const raw = code?.data?.trim?.() ?? "";
          if (raw && raw !== lastDecodedRef.current) {
            lastDecodedRef.current = raw;
            onDecode(raw);
          }
        };

        timerRef.current = setInterval(tick, intervalMs);
      } catch (e: any) {
        const msg =
          e?.name === "NotAllowedError"
            ? "Permiso de cámara denegado. Habilítalo en el navegador."
            : e?.message ?? "No se pudo acceder a la cámara.";
        setFatalErr(msg);
        onError?.(msg);
      }
    }

    start();

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [facingMode, intervalMs, onDecode, onError, hasBarcodeDetector]);

  return (
    <div className={className ?? "relative w-full h-full"}>
      <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

      {/* Marco de guía */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-2/3 max-w-sm aspect-square border-2 border-white/70 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
      </div>

      {/* Notas / errores */}
      {compatNote && !fatalErr && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-500/90 text-black text-xs px-3 py-2 rounded-lg">
          {compatNote}
        </div>
      )}
      {fatalErr && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-500/90 text-white text-xs px-3 py-2 rounded-lg">
          {fatalErr}
        </div>
      )}
    </div>
  );
}
