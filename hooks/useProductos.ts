import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../services/api";

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

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setLoading(true);
    setError(null);
    try {
      const cache = await AsyncStorage.getItem("cache_productos");
      if (cache) setProductos(JSON.parse(cache));

      const data = await apiGet<Producto[]>("/productos");
      setProductos(data);
      await AsyncStorage.setItem("cache_productos", JSON.stringify(data));
    } catch (e: any) {
      setError("Sin conexión. Mostrando datos guardados.");
    } finally {
      setLoading(false);
    }
  }

  async function agregar(producto: Omit<Producto, "id">) {
    await apiPost("/productos", producto);
    await cargar();
  }

  return { productos, loading, error, recargar: cargar, agregar };
}
