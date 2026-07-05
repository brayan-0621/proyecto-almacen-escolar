type NivelLog = "INFO" | "WARN" | "ERROR";

interface LogEntry {
  nivel: NivelLog;
  mensaje: string;
  hora: string;
}

const historial: LogEntry[] = [];
const MAX_LOGS = 20;

function guardar(nivel: NivelLog, mensaje: string) {
  const hora = new Date().toLocaleTimeString();
  historial.unshift({ nivel, mensaje, hora });
  if (historial.length > MAX_LOGS) historial.pop();
}

export const logger = {
  info(mensaje: string) {
    console.info(`[INFO] ${mensaje}`);
    guardar("INFO", mensaje);
  },
  warn(mensaje: string) {
    console.warn(`[WARN] ${mensaje}`);
    guardar("WARN", mensaje);
  },
  error(mensaje: string, err?: unknown) {
    const detalle = err instanceof Error ? err.message : String(err ?? "");
    console.error(`[ERROR] ${mensaje}`, detalle);
    guardar("ERROR", `${mensaje} ${detalle}`.trim());
  },
  getHistorial(): LogEntry[] {
    return historial;
  },
};
