import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../services/api";
import { logger } from "../services/logger";
import { medirLlamada } from "../services/medirTiempo";

export type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  codigo?: string;
  stock: number;
  stock_minimo: number;
  precio_compra: number;
  precio_venta: number;
  descripcion?: string;
};

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
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
      const cache = await AsyncStorage.getItem("cache_productos");
      if (cache) {
        try {
          const cacheData = JSON.parse(cache);
          if (Array.isArray(cacheData)) setProductos(cacheData);
        } catch {}
      }

      logger.info("Cargando productos...");
      const { data, duracionMs, lenta } = await medirLlamada(() =>
        apiGet<Producto[]>("/productos"),
      );

      setUltimaDuracionMs(duracionMs);
      if (lenta) {
        logger.warn(`Carga de productos lenta (${duracionMs}ms)`);
        setSlowApi(true);
      }

      if (Array.isArray(data)) {
        setProductos(data);
        await AsyncStorage.setItem("cache_productos", JSON.stringify(data));

        const bajoStock = data.filter((p) => p.stock <= p.stock_minimo);
        if (bajoStock.length > 0) {
          logger.warn(`${bajoStock.length} producto(s) con stock bajo`);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Stock bajo",
              body: `Hay ${bajoStock.length} producto(s) con stock bajo o agotado.`,
            },
            trigger: null,
          });
        }

        await AsyncStorage.setItem("cache_productos", JSON.stringify(data));
      }
    } catch (e: any) {
      logger.error("Error al cargar productos", e);
      setError("Sin conexión. Mostrando datos guardados.");
    } finally {
      setLoading(false);
    }
  }

  async function agregar(producto: Omit<Producto, "id">) {
    await apiPost("/productos", producto);
    await cargar();
  }

  return {
    productos,
    loading,
    error,
    slowApi,
    ultimaDuracionMs,
    recargar: cargar,
    agregar,
  };
}
