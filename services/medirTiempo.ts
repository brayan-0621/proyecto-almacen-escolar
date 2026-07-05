export const UMBRAL_LENTO_MS = 2000;

export async function medirLlamada<T>(
  fn: () => Promise<T>,
): Promise<{ data: T; duracionMs: number; lenta: boolean }> {
  const inicio = Date.now();
  const data = await fn();
  const duracionMs = Date.now() - inicio;
  return { data, duracionMs, lenta: duracionMs > UMBRAL_LENTO_MS };
}
