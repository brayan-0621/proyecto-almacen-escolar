import { useEffect, useState } from "react";
import { apiGet } from "../services/api";
import { logger } from "../services/logger";
import { medirLlamada } from "../services/medirTiempo";

type KpiData = {
  total_productos: number;
  bajo_stock: number;
  mov_hoy: number;
  vendido_hoy: number;
};

export function useDashboard() {
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slowApi, setSlowApi] = useState(false);
  const [ultimaDuracionMs, setUltimaDuracionMs] = useState<number | null>(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setLoading(true);
    setError(null);
    setSlowApi(false);
    try {
      logger.info("Cargando KPIs del dashboard...");
      const { data, duracionMs, lenta } = await medirLlamada(() =>
        apiGet<KpiData>("/dashboard/kpis"),
      );

      setUltimaDuracionMs(duracionMs);
      if (lenta) {
        logger.warn(`Carga de KPIs lenta (${duracionMs}ms)`);
        setSlowApi(true);
      }

      if (data && typeof data === "object") {
        setKpis(data);
      }
    } catch (e: any) {
      logger.error("Error al cargar KPIs", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return { kpis, loading, error, slowApi, ultimaDuracionMs, recargar: cargar };
}
