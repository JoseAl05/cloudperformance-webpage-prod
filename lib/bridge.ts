import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/cookies';
import { isAllowedBridgePath } from '@/lib/bridgePaths';

export const BRIDGE_TIMEOUT_MS = Number(process.env.BRIDGE_TIMEOUT_MS) || 120_000;

const FORWARD_REQUEST_HEADERS = new Set([
  'accept',
  'content-type',
  'if-none-match',
  'if-modified-since',
  'x-request-id',
  'x-trace-id',
]);

const FORWARD_RESPONSE_HEADERS = ['content-type', 'cache-control', 'content-disposition', 'etag', 'last-modified'];

type RouteContext = { params: Promise<{ path?: string[] }> };

interface BridgeOptions {
  service: string;
  baseUrl: string;
  envName: string;
  allowedPrefixes: readonly string[];
  authorize?: (token: string) => Promise<Response | null>;
  bufferBody?: boolean;
  timeoutMs?: number;
}

export const bridgeBaseUrl = (envName: string, devEnvName?: string): string => {
  const devUrl = process.env.NODE_ENV === 'development' && devEnvName ? process.env[devEnvName] : undefined;
  return (devUrl || process.env[envName] || '').replace(/\/+$/, '');
};

const bridgeError = (status: number, error: string, message: string) =>
  NextResponse.json({ error, message }, { status });

export function createBridge(options: BridgeOptions) {
  const { service, baseUrl, envName, allowedPrefixes, authorize, bufferBody = false } = options;
  const timeoutMs = options.timeoutMs ?? BRIDGE_TIMEOUT_MS;

  return async function proxy(req: Request, ctx: RouteContext): Promise<Response> {
    if (!baseUrl) {
      return NextResponse.json({ error: `Misconfig: ${envName}` }, { status: 500 });
    }
    const { path } = await ctx.params;
    const segments = path ?? [];
    if (!isAllowedBridgePath(segments, allowedPrefixes)) {
      return NextResponse.json({ error: 'Ruta no permitida' }, { status: 404 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    if (authorize) {
      const denied = await authorize(token);
      if (denied) return denied;
    }

    const subpath = segments.join('/');
    const targetUrl = `${baseUrl}/${subpath}${new URL(req.url).search}`;

    const headers = new Headers();
    headers.set('Authorization', `Bearer ${token}`);
    for (const [key, value] of req.headers) {
      if (FORWARD_REQUEST_HEADERS.has(key.toLowerCase())) headers.set(key, value);
    }

    const method = req.method.toUpperCase();
    const init: RequestInit & { duplex?: 'half' } = { method, headers };
    if (method !== 'GET' && method !== 'HEAD') {
      if (bufferBody) {
        init.body = await req.arrayBuffer();
      } else {
        init.body = req.body;
        init.duplex = 'half';
      }
    }

    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    const onClientAbort = () => controller.abort();
    req.signal.addEventListener('abort', onClientAbort, { once: true });

    let upstream: Response;
    try {
      upstream = await fetch(targetUrl, { ...init, signal: controller.signal });
    } catch (error) {
      if (timedOut) {
        console.error(`[bridge ${service}] Timeout de ${timeoutMs} ms en /${subpath}`);
        return bridgeError(
          504,
          'upstream_timeout',
          `La API de ${service} tardó más de ${Math.round(timeoutMs / 1000)} s en responder. ` +
            'Intenta con un rango de fechas más corto o con menos filtros.'
        );
      }
      if (req.signal.aborted) {
        return new Response(null, { status: 499 });
      }
      console.error(`[bridge ${service}] No se pudo conectar con ${baseUrl}:`, error);
      return bridgeError(502, 'upstream_unavailable', `No se pudo conectar con la API de ${service}.`);
    } finally {
      clearTimeout(timer);
      req.signal.removeEventListener('abort', onClientAbort);
    }

    const resHeaders = new Headers();
    for (const name of FORWARD_RESPONSE_HEADERS) {
      const value = upstream.headers.get(name);
      if (value) resHeaders.set(name, value);
    }
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: resHeaders,
    });
  };
}
