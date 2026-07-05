import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { apiGet } from "../services/api";
import { logger } from "../services/logger";
import { medirLlamada } from "../services/medirTiempo";

export type Movimiento = {
  id: number;
  tipo: "entrada" | "salida";
  descripcion: string;
  monto: number;
  fecha: string;
  cliente_nombre?: string;
  proveedor_nombre?: string;
};

export function useMovimientos() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
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
      const cache = await AsyncStorage.getItem("cache_movimientos");
      if (cache) {
        try {
          const cacheData = JSON.parse(cache);
          if (Array.isArray(cacheData)) setMovimientos(cacheData);
        } catch {}
      }

      logger.info("Cargando movimientos...");
      const { data, duracionMs, lenta } = await medirLlamada(() =>
        apiGet<Movimiento[]>("/movimientos"),
      );

      setUltimaDuracionMs(duracionMs);
      if (lenta) {
        logger.warn(`Carga de movimientos lenta (${duracionMs}ms)`);
        setSlowApi(true);
      }

      if (Array.isArray(data)) {
        setMovimientos(data);
        await AsyncStorage.setItem("cache_movimientos", JSON.stringify(data));
      }
    } catch (e: any) {
      logger.error("Error al cargar movimientos", e);
      setError("Sin conexión. Mostrando datos guardados.");
    } finally {
      setLoading(false);
    }
  }

  return {
    movimientos,
    loading,
    error,
    slowApi,
    ultimaDuracionMs,
    recargar: cargar,
  };
}
