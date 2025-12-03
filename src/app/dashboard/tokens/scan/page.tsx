// src/app/dashboard/tokens/scan/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import loaderEnv from "@src/utils/loaderEnv";

const API_BASE = loaderEnv("BACKEND_URL");

const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((m) => m.Scanner),
  { ssr: false }
);

export default function ScanTokensPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  const [scanning, setScanning] = useState(true);
  const [locked, setLocked] = useState(false);
  const [info, setInfo] = useState<any | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);

  const [errors, setErrors] = useState<string[]>([]);
  const [frames, setFrames] = useState(0);
  const t0 = useRef<number>(0);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);

  const COOLDOWN_MS = 1500;

  // Descubrir cámaras
  useEffect(() => {
    let mounted = true;
    (async () => {
      let stream: MediaStream | null = null;
      try {
        // Pedir permisos y cerrar el stream inmediatamente para apagar el led
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((t) => t.stop());
      } catch { }

      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        const cams = list.filter((d) => d.kind === "videoinput");
        if (!mounted) return;
        setDevices(cams);
        const back = cams.find((d) => /back|rear|environment/i.test(d.label));
        setDeviceId(back?.deviceId ?? cams[0]?.deviceId);
      } catch {
        setErrors((p) => p.concat("No se pudieron enumerar cámaras."));
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Límites “soft” para evitar OverconstrainedError
  const softVideoLimits: MediaTrackConstraints = {
    width: { min: 320, ideal: 640, max: 1920 },
    height: { min: 240, ideal: 480, max: 1080 },
    frameRate: { ideal: 24, max: 30 },
  };

  const getConstraints = (): MediaTrackConstraints =>
    deviceId
      ? { ...softVideoLimits, deviceId: { exact: deviceId } as any }
      : { ...softVideoLimits, facingMode: { ideal: "environment" } as any };

  // Backend
  const validateToken = async (raw: string) => {
    if (!token) {
      setBanner("No hay sesión de admin.");
      return;
    }
    try {
      setBanner(null);
      const res = await fetch(
        `${API_BASE}/api/token/validate/${encodeURIComponent(raw)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        if (res.status === 409) {
          setBanner(
            "⚠️ Este código QR ya fue validado anteriormente. No se puede escanear de nuevo."
          );
        } else {
          const txt = await res.text();
          setBanner(`HTTP ${res.status}${txt ? `: ${txt}` : ""}`);
        }
        setInfo(null);
        return;
      }
      const json = await res.json();
      setInfo(json);
      setScanning(false); // pausa en éxito para que no siga leyendo
    } catch (e: any) {
      setBanner(e?.message ?? "Error validando token");
    }
  };

  const handleDecode = (raw: string) => {
    if (locked) return;
    setLocked(true);
    validateToken(raw).finally(() =>
      setTimeout(() => setLocked(false), COOLDOWN_MS)
    );
  };

  // API nueva: onScan -> array de códigos detectados
  const onScan = (codes: { rawValue: string }[]) => {
    setFrames((f) => f + 1);
    const text = codes?.[0]?.rawValue ?? "";
    if (text) handleDecode(text);
  };

  // Manejo de errores del scanner
  const onError = (err?: unknown) => {
    const name =
      (err as any)?.name ||
      (err as any)?.toString?.() ||
      (err instanceof Error ? err.name : "");
    const msg =
      typeof err === "string"
        ? err
        : err instanceof Error
          ? err.message
          : "Error desconocido del lector";

    // Ignorar AbortError (interrupción de play() al desmontar/pausar)
    if (
      name === "AbortError" ||
      msg.toLowerCase().includes("interrupted") ||
      msg.toLowerCase().includes("media was removed") ||
      msg.toLowerCase().includes("play()")
    )
      return;

    setErrors((prev) =>
      (prev.length > 10 ? prev.slice(-10) : prev).concat(
        `${name || "Error"}: ${msg}`
      )
    );

    // Si es Overconstrained, intenta ‘facingMode’ genérico y re-montar
    if (
      String(name).includes("Overconstrained") ||
      /overconstrained/i.test(msg)
    ) {
      setScanning(false);
      setDeviceId(undefined); // quita exact deviceId
      setTimeout(() => setScanning(true), 150);
    }
  };

  const CameraSelector = useMemo(
    () => (
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-background-little-1 font-medium">Cámara:</span>
        <select
          className="px-2 py-1 rounded-md border border-background-little-1/20 bg-background-tertiary text-background-secondary focus:outline-none focus:ring-1 focus:ring-background-little-1"
          value={deviceId ?? ""}
          onChange={(e) => {
            setDeviceId(e.target.value || undefined);
            setScanning(false);
            setTimeout(() => setScanning(true), 300);
          }}
        >
          {devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || `Cam ${d.deviceId.slice(0, 6)}…`}
            </option>
          ))}
        </select>
        <button
          className="px-3 py-1 rounded-md border border-background-little-1/20 text-background-little-1 hover:bg-background-little-1/10 transition-colors"
          onClick={async () => {
            try {
              const list = await navigator.mediaDevices.enumerateDevices();
              const cams = list.filter((d) => d.kind === "videoinput");
              setDevices(cams);
              if (!cams.find((c) => c.deviceId === deviceId)) {
                setDeviceId(cams[0]?.deviceId);
              }
              setScanning(false);
              setTimeout(() => setScanning(true), 300);
            } catch { }
          }}
        >
          Refrescar
        </button>
        <span className="text-background-little-1/70">
          {frames > 0 && t0.current
            ? `${Math.round(
              (frames * 1000) / (performance.now() - t0.current)
            )} fps`
            : ""}
        </span>
      </div>
    ),
    [devices, deviceId, frames]
  );

  useEffect(() => {
    if (scanning) {
      t0.current = performance.now();
      setFrames(0);
    }
  }, [scanning]);

  const forceKey = `${deviceId ?? "none"}-${scanning}`;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-background-secondary">
        Validación de entradas (QR)
      </h1>

      <div className="flex items-center justify-between text-sm bg-background-tertiary/50 p-3 rounded-xl border border-background-little-1/10">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${scanning ? "bg-green-600 animate-pulse" : "bg-background-little-1"
              }`}
          ></span>
          <span
            className={
              scanning
                ? "text-green-700 font-medium"
                : "text-background-little-1 font-medium"
            }
          >
            {scanning ? "Cámara activa" : "Cámara pausada"}
          </span>
        </div>
        {CameraSelector}
      </div>

      {banner && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 px-4 py-3 text-sm font-medium">
          {banner}
        </div>
      )}

      <div
        ref={videoWrapRef}
        className="rounded-2xl overflow-hidden border border-background-little-1/20 bg-background-tertiary shadow-xl relative group"
      >
        <div className="w-full aspect-video relative">
          {scanning && (
            <Scanner
              key={forceKey}
              constraints={getConstraints()}
              formats={["qr_code"] as any}
              paused={false}
              allowMultiple={false}
              scanDelay={130}
              onScan={onScan}
              onError={onError}
              components={{
                finder: true,
                torch: true,
                zoom: true,
              }}
              styles={{
                container: { width: "100%", height: "100%" },
                video: { width: "100%", height: "100%", objectFit: "cover" },
              }}
            />
          )}
          {!scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background-secondary/5 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full bg-background-little-1/10 flex items-center justify-center mb-4">
                <span className="text-3xl text-background-little-1">⏸</span>
              </div>
              <p className="text-background-secondary font-medium">
                Escáner en pausa
              </p>
              <button
                onClick={() => setScanning(true)}
                className="mt-4 px-6 py-2 rounded-full bg-background-little-1 text-white text-sm font-medium hover:bg-opacity-90 transition-all shadow-lg shadow-background-little-1/20"
              >
                Reanudar cámara
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <div className="rounded-2xl bg-background-tertiary/60 backdrop-blur-md border border-background-little-1/20 p-6 shadow-lg transition-all">
          {info ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-background-little-1/10 pb-6">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner ${info.validated
                      ? "bg-green-600/10 text-green-600 border border-green-600/20"
                      : "bg-background-little-2/10 text-background-little-2 border border-background-little-2/20"
                    }`}
                >
                  {info.validated ? "✓" : "!"}
                </div>
                <div>
                  <h3
                    className={`font-bold text-xl ${info.validated
                        ? "text-green-700"
                        : "text-background-little-2"
                      }`}
                  >
                    {info.validated
                      ? "Entrada Validada"
                      : "Validación Pendiente"}
                  </h3>
                  <p className="text-xs text-background-secondary/60 mt-1">
                    {info.validatedAt
                      ? new Date(info.validatedAt).toLocaleString()
                      : "Recién escaneado"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="group">
                  <span className="text-background-little-1 text-[10px] uppercase tracking-wider font-bold block mb-1">
                    Asistente
                  </span>
                  <span className="font-semibold text-background-secondary text-lg block group-hover:text-background-little-1 transition-colors">
                    {info.userName}
                  </span>
                </div>
                <div className="group">
                  <span className="text-background-little-1 text-[10px] uppercase tracking-wider font-bold block mb-1">
                    Correo Electrónico
                  </span>
                  <span className="font-medium text-background-secondary/80 text-base block">
                    {info.userEmail}
                  </span>
                </div>
                <div className="group">
                  <span className="text-background-little-1 text-[10px] uppercase tracking-wider font-bold block mb-1">
                    Evento
                  </span>
                  <span className="font-medium text-background-secondary/80 text-base block">
                    {info.eventTitle}
                  </span>
                </div>
              </div>

              <button
                className="w-full py-3 rounded-xl bg-background-little-1 text-white font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-background-little-1/20 mt-2"
                onClick={() => {
                  setInfo(null);
                  setBanner(null);
                  setScanning(true);
                }}
              >
                Escanear siguiente
              </button>
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center justify-center opacity-60">
              <span className="text-4xl mb-3 grayscale opacity-50">📷</span>
              <p className="text-background-secondary font-medium">
                Apunta el código QR a la cámara
              </p>
              <p className="text-xs text-background-little-1 mt-1">
                El resultado aparecerá aquí automáticamente
              </p>
            </div>
          )}
        </div>
      </div>

      {scanning && (
        <div className="flex justify-center">
          <button
            className="px-6 py-2 rounded-full border border-background-little-1/30 text-background-little-1 text-sm font-medium hover:bg-background-little-1/5 transition-colors"
            onClick={() => setScanning(false)}
          >
            Pausar escáner
          </button>
        </div>
      )}

      {errors.length > 0 && (
        <div className="text-xs text-red-600/70 space-y-1 text-center bg-red-50 p-2 rounded-lg border border-red-100 max-w-md mx-auto">
          {errors.slice(-6).map((e, i) => (
            <div key={`${e}-${i}`}>• {e}</div>
          ))}
        </div>
      )}
    </div>
  );
}
