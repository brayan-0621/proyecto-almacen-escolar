import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "./logger";
import { medirLlamada } from "./medirTiempo";

export const API_URL =
  "https://almacen-nella-api-hua6bahvave4a8an.mexicocentral-01.azurewebsites.net";

async function getHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiGet<T = any>(path: string): Promise<T> {
  logger.info(`GET ${path}`);
  try {
    const { data, duracionMs, lenta } = await medirLlamada(async () => {
      const res = await fetch(`${API_URL}${path}`, {
        headers: await getHeaders(),
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Error de red");
      return json;
    });

    if (lenta) logger.warn(`GET ${path} tardó ${duracionMs}ms (API lenta)`);
    return data;
  } catch (err) {
    logger.error(`Fallo en GET ${path}`, err);
    throw err;
  }
}

export async function apiPost<T = any>(path: string, body: object): Promise<T> {
  logger.info(`POST ${path}`);

  try {
    const { data, duracionMs, lenta } = await medirLlamada(async () => {
      const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error de red");
      return json;
    });

    if (lenta) logger.warn(`POST ${path} tardó ${duracionMs}ms (API lenta)`);
    return data;
  } catch (err) {
    logger.error(`Fallo en POST ${path}`, err);
    throw err;
  }
}
export async function apiPut<T = any>(path: string, body: object): Promise<T> {
  logger.info(`PUT ${path}`);
  try {
    const { data, duracionMs, lenta } = await medirLlamada(async () => {
      const res = await fetch(`${API_URL}${path}`, {
        method: "PUT",
        headers: await getHeaders(),
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error de red");
      return json;
    });
    if (lenta) logger.warn(`PUT ${path} tardó ${duracionMs}ms (API lenta)`);
    return data;
  } catch (err) {
    logger.error(`Fallo en PUT ${path}`, err);
    throw err;
  }
}

export async function apiDelete<T = any>(path: string): Promise<T> {
  logger.info(`DELETE ${path}`);
  try {
    const { data, duracionMs, lenta } = await medirLlamada(async () => {
      const res = await fetch(`${API_URL}${path}`, {
        method: "DELETE",
        headers: await getHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error de red");
      return json;
    });
    if (lenta) logger.warn(`DELETE ${path} tardó ${duracionMs}ms (API lenta)`);
    return data;
  } catch (err) {
    logger.error(`Fallo en DELETE ${path}`, err);
    throw err;
  }
}
