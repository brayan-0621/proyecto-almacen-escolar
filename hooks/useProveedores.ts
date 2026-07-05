import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "../services/api";
import { logger } from "../services/logger";

export type Proveedor = {
  id: number;
  nombre: string;
  razon_social: string;
  ruc: string;
  telefono: string;
  direccion: string;
  email: string;
};

export type ProveedorForm = Omit<Proveedor, "id">;

export function useProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setLoading(true);
    setError(null);
    try {
      logger.info("Cargando proveedores...");
      const data = await apiGet<Proveedor[]>("/proveedores");
      if (Array.isArray(data)) setProveedores(data);
    } catch (e: any) {
      logger.error("Error al cargar proveedores", e);
      setError("Sin conexión. No se pudieron cargar los proveedores.");
    } finally {
      setLoading(false);
    }
  }

  async function agregar(proveedor: ProveedorForm) {
    await apiPost("/proveedores", proveedor);
    await cargar();
  }

  async function actualizar(id: number, proveedor: ProveedorForm) {
    await apiPut(`/proveedores/${id}`, proveedor);
    await cargar();
  }

  async function eliminar(id: number) {
    await apiDelete(`/proveedores/${id}`);
    await cargar();
  }

  return {
    proveedores,
    loading,
    error,
    recargar: cargar,
    agregar,
    actualizar,
    eliminar,
  };
}
