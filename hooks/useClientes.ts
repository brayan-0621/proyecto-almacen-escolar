import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "../services/api";
import { logger } from "../services/logger";

export type Cliente = {
  id: number;
  nombre: string;
  empresa?: string;
  dni: string;
  telefono: string;
};

export type ClienteForm = Omit<Cliente, "id">;

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setLoading(true);
    setError(null);
    try {
      logger.info("Cargando clientes...");
      const data = await apiGet<Cliente[]>("/clientes");
      if (Array.isArray(data)) setClientes(data);
    } catch (e: any) {
      logger.error("Error al cargar clientes", e);
      setError("Sin conexión. No se pudieron cargar los clientes.");
    } finally {
      setLoading(false);
    }
  }

  async function agregar(cliente: ClienteForm) {
    await apiPost("/clientes", cliente);
    await cargar();
  }

  async function actualizar(id: number, cliente: ClienteForm) {
    await apiPut(`/clientes/${id}`, cliente);
    await cargar();
  }

  async function eliminar(id: number) {
    await apiDelete(`/clientes/${id}`);
    await cargar();
  }

  return {
    clientes,
    loading,
    error,
    recargar: cargar,
    agregar,
    actualizar,
    eliminar,
  };
}
