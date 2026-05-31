import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = "http://192.168.1.104:3000";

async function getHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiGet<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: await getHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error de red");
  return data;
}

export async function apiPost<T = any>(path: string, body: object): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error de red");
  return data;
}
