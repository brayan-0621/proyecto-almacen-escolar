import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { apiGet } from "../services/api";

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

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setLoading(true);
    setError(null);
    try {
      const cache = await AsyncStorage.getItem("cache_movimientos");
      if (cache) setMovimientos(JSON.parse(cache));

      const data = await apiGet<Movimiento[]>("/movimientos");
      setMovimientos(data);
      await AsyncStorage.setItem("cache_movimientos", JSON.stringify(data));
    } catch (e: any) {
      setError("Sin conexión. Mostrando datos guardados.");
    } finally {
      setLoading(false);
    }
  }

  return { movimientos, loading, error, recargar: cargar };
}
