// src/app/dashboard/events/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createEvent, type EventPayload } from "@src/services/admin/events";
import { motion, AnimatePresence } from "framer-motion";

/** Convierte "YYYY-MM-DDTHH:mm" (datetime-local) a ISO con offset local */
function toOffsetISO(local: string) {
  if (!local) return "";
  const d = new Date(local);
  const tz = -d.getTimezoneOffset();
  const sign = tz >= 0 ? "+" : "-";
  const hh = String(Math.floor(Math.abs(tz) / 60)).padStart(2, "0");
  const mm = String(Math.abs(tz) % 60).padStart(2, "0");
  const iso = new Date(
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes()
    )
  )
    .toISOString()
    .replace("Z", `${sign}${hh}:${mm}`);
  return iso;
}

const STEPS = [
  { id: 0, title: "Información Básica", icon: "📝" },
  { id: 1, title: "Fecha y Lugar", icon: "📍" },
  { id: 2, title: "Detalles", icon: "⚙️" },
  { id: 3, title: "Resumen", icon: "✅" },
];

export default function CreateEventWizardPage() {
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken as string | undefined;
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<EventPayload>({
    title: "",
    description: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
    location: "",
    type: "CONCIERTO",
    status: "APERTURADO",
    capacity: 0,
    costEntry: 0,
    tags: [],
  });

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "capacity" || name === "costEntry") {
      setForm((f) => ({ ...f, [name]: Number(value) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((c) => c + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((c) => c - 1);
  };

  const submit = async () => {
    if (!token) return;
    try {
      setSaving(true);
      setError(null);
      const payload: EventPayload = {
        ...form,
        startDate: toOffsetISO(form.startDate),
        endDate: toOffsetISO(form.endDate),
      };
      await createEvent(token, payload);
      router.push("/dashboard/events");
    } catch (e: any) {
      setError(e.message ?? "No se pudo crear el evento");
      setSaving(false);
    }
  };

  if (status === "loading") return <div className="p-6">Cargando…</div>;
  if (!token)
    return <div className="p-6">Debes iniciar sesión como administrador.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-[80vh] flex flex-col">
      <h1 className="text-3xl font-bold mb-8 text-center text-background-secondary">
        Crear Nuevo Evento
      </h1>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center w-1/4 cursor-pointer ${step.id <= currentStep ? "opacity-100" : "opacity-60"
                }`}
              onClick={() => {
                if (step.id < currentStep) setCurrentStep(step.id);
              }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-2 transition-all ${step.id === currentStep
                    ? "bg-background-little-1 text-white scale-110 shadow-lg shadow-background-little-1/30"
                    : step.id < currentStep
                      ? "bg-background-secondary/20 text-background-secondary border border-background-secondary/30"
                      : "bg-background-tertiary/50 text-background-secondary/50"
                  }`}
              >
                {step.id < currentStep ? "✓" : step.icon}
              </div>
              <span className="text-xs font-medium text-center hidden sm:block text-background-secondary">
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1 w-full bg-background-tertiary/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-background-little-1"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 bg-background-tertiary/60 backdrop-blur-md border border-background-little-1/20 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 text-sm">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {currentStep === 0 && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-background-secondary">
                  Información Básica
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-background-little-1 mb-1">
                      Título del evento
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={onChange}
                      className="w-full px-4 py-3 rounded-xl bg-background-secondary/10 border border-background-little-1/20 text-background-secondary placeholder-background-secondary/40 focus:border-background-little-1 focus:ring-1 focus:ring-background-little-1 outline-none transition-all"
                      placeholder="Ej: Concierto de Rock 2025"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-background-little-1 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={onChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-background-secondary/10 border border-background-little-1/20 text-background-secondary placeholder-background-secondary/40 focus:border-background-little-1 focus:ring-1 focus:ring-background-little-1 outline-none transition-all resize-none"
                      placeholder="Describe de qué trata el evento..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-background-little-1 mb-1">
                      Tipo de evento
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={onChange}
                      className="w-full px-4 py-3 rounded-xl bg-background-secondary/10 border border-background-little-1/20 text-background-secondary focus:border-background-little-1 outline-none"
                    >
                      <option value="CONFERENCIA">CONFERENCIA</option>
                      <option value="TALLER">TALLER</option>
                      <option value="EXPOSICION">EXPOSICION</option>
                      <option value="CONCIERTO">CONCIERTO</option>
                      <option value="OBRA_DE_TEATRO">OBRA DE TEATRO</option>
                      <option value="PROYECCION">PROYECCION</option>
                      <option value="FERIA">FERIA</option>
                      <option value="OTRO">OTRO</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-background-secondary">
                  Fecha y Lugar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-background-little-1 mb-1">
                      Fecha de Inicio
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={form.startDate}
                      onChange={onChange}
                      className="w-full px-4 py-3 rounded-xl bg-background-secondary/10 border border-background-little-1/20 text-background-secondary focus:border-background-little-1 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-background-little-1 mb-1">
                      Fecha de Fin
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={form.endDate}
                      onChange={onChange}
                      className="w-full px-4 py-3 rounded-xl bg-background-secondary/10 border border-background-little-1/20 text-background-secondary focus:border-background-little-1 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-background-little-1 mb-1">
                      Ubicación
                    </label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={onChange}
                      className="w-full px-4 py-3 rounded-xl bg-background-secondary/10 border border-background-little-1/20 text-background-secondary placeholder-background-secondary/40 focus:border-background-little-1 outline-none"
                      placeholder="Ej: Auditorio Principal"
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-background-secondary">
                  Detalles y Capacidad
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-background-little-1 mb-1">
                      Estado Inicial
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={onChange}
                      className="w-full px-4 py-3 rounded-xl bg-background-secondary/10 border border-background-little-1/20 text-background-secondary focus:border-background-little-1 outline-none"
                    >
                      <option value="APERTURADO">APERTURADO</option>
                      <option value="EN_CURSO">EN CURSO</option>
                      <option value="CLAUSURADO">CLAUSURADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-background-little-1 mb-1">
                      Capacidad Máxima
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={form.capacity}
                      onChange={onChange}
                      min={0}
                      className="w-full px-4 py-3 rounded-xl bg-background-secondary/10 border border-background-little-1/20 text-background-secondary focus:border-background-little-1 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-background-little-1 mb-1">
                      Costo de Entrada (S/)
                    </label>
                    <input
                      type="number"
                      name="costEntry"
                      value={form.costEntry}
                      onChange={onChange}
                      min={0}
                      step="0.01"
                      className="w-full px-4 py-3 rounded-xl bg-background-secondary/10 border border-background-little-1/20 text-background-secondary focus:border-background-little-1 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-background-little-1 mb-1">
                      URL de Imagen (Opcional)
                    </label>
                    <input
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={onChange}
                      className="w-full px-4 py-3 rounded-xl bg-background-secondary/10 border border-background-little-1/20 text-background-secondary placeholder-background-secondary/40 focus:border-background-little-1 outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-background-secondary">
                  Resumen
                </h2>
                <div className="bg-background-secondary/5 rounded-xl p-6 space-y-4 border border-background-little-1/10">
                  <div className="flex justify-between border-b border-background-little-1/10 pb-2">
                    <span className="text-background-secondary/70">
                      Título:
                    </span>
                    <span className="font-medium text-right text-background-secondary">
                      {form.title}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-background-little-1/10 pb-2">
                    <span className="text-background-secondary/70">Tipo:</span>
                    <span className="font-medium text-right text-background-secondary">
                      {form.type}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-background-little-1/10 pb-2">
                    <span className="text-background-secondary/70">
                      Fecha Inicio:
                    </span>
                    <span className="font-medium text-right text-background-secondary">
                      {form.startDate
                        ? new Date(form.startDate).toLocaleString()
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-background-little-1/10 pb-2">
                    <span className="text-background-secondary/70">
                      Ubicación:
                    </span>
                    <span className="font-medium text-right text-background-secondary">
                      {form.location}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-background-little-1/10 pb-2">
                    <span className="text-background-secondary/70">
                      Capacidad:
                    </span>
                    <span className="font-medium text-right text-background-secondary">
                      {form.capacity} personas
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-background-secondary/70">Costo:</span>
                    <span className="font-medium text-right text-green-700">
                      {form.costEntry > 0
                        ? `S/ ${form.costEntry.toFixed(2)}`
                        : "Gratis"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-center text-background-secondary/60 mt-4">
                  Revisa que toda la información sea correcta antes de crear el
                  evento.
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          disabled={currentStep === 0 || saving}
          className={`px-6 py-3 rounded-xl border border-background-little-1/20 font-medium transition-all ${currentStep === 0
              ? "opacity-0 pointer-events-none"
              : "hover:bg-background-little-1/5 text-background-little-1"
            }`}
        >
          Anterior
        </button>

        {currentStep < STEPS.length - 1 ? (
          <button
            onClick={nextStep}
            className="px-8 py-3 rounded-xl bg-background-little-1 text-white font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-background-little-1/20"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-background-little-1 text-white font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-background-little-1/20 flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="animate-spin text-xl">⟳</span> Creando...
              </>
            ) : (
              "Confirmar y Crear"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
