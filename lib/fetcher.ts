/**
 * Fetcher común para SWR y llamadas a los bridges.
 *
 * A diferencia de `fetch(url).then(r => r.json())`, lanza un `FetchError` cuando la respuesta
 * no es 2xx. Así SWR expone `error` (y la vista puede mostrar "Error al cargar datos") en vez
 * de tratar un body `{ detail: "..." }` de un 4xx/5xx como si fueran datos.
 */
export class FetchError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, detail: unknown, url: string) {
    const detailText = typeof detail === 'string' ? detail : '';
    super(detailText || `Error ${status} al consultar ${url}`);
    this.name = 'FetchError';
    this.status = status;
    this.detail = detail;
  }
}

const readErrorDetail = async (res: Response): Promise<unknown> => {
  const text = await res.text().catch(() => '');
  if (!text) return null;
  try {
    const body = JSON.parse(text);
    return body?.detail ?? body?.message ?? body?.error ?? body;
  } catch {
    return text;
  }
};

/** Igual que `fetch(input, init)` + `.json()`, pero lanza `FetchError` si `!res.ok`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchJson<T = any>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    throw new FetchError(res.status, await readErrorDetail(res), input);
  }
  return res.json();
}

/**
 * Fetcher GET estándar para `useSWR(url, fetcher)`.
 * Devuelve `any` (igual que el `res.json()` de los fetchers locales que reemplaza) para que
 * cada vista siga tipando su `data` como lo hacía.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetcher = (url: string): Promise<any> =>
  fetchJson(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
