// Convierte un input "yyyy-MM-ddTHH:mm" (datetime-local) a ISO con offset "-05:00"
export function toOffsetIso(local: string, offset = "-05:00") {
  // Si viene vacío devolvemos cadena vacía
  if (!local) return "";
  // Asegura que tenga segundos
  const normalized = local.length === 16 ? `${local}:00` : local; // "2025-12-11T09:30:00"
  // Agrega offset
  return `${normalized}${offset}`;
}
