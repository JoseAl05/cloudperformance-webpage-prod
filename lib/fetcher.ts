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

export const FETCH_TIMEOUT_MS = 130_000;

const TIMEOUT_MESSAGE =
  'La consulta tardó demasiado y se canceló. Intenta con un rango de fechas más corto o con menos filtros.';

export const isTimeoutError = (error: unknown): error is FetchError =>
  error instanceof FetchError && error.status === 504;

export async function fetchJson<T = unknown>(input: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, FETCH_TIMEOUT_MS);
  const callerSignal = init?.signal;
  const onCallerAbort = () => controller.abort();
  callerSignal?.addEventListener('abort', onCallerAbort, { once: true });

  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    if (!res.ok) {
      throw new FetchError(res.status, await readErrorDetail(res), input);
    }
    return await res.json();
  } catch (error) {
    if (timedOut) throw new FetchError(504, TIMEOUT_MESSAGE, input);
    throw error;
  } finally {
    clearTimeout(timer);
    callerSignal?.removeEventListener('abort', onCallerAbort);
  }
}

export const fetcher = <T = unknown>(url: string): Promise<T> =>
  fetchJson<T>(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
