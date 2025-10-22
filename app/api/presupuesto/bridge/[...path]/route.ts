import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/cookies';

const BASE = (process.env.API_PRESUPUESTO || '').replace(/\/+$/, '');
const FORWARD_HEADER_ALLOWLIST = new Set([
  'accept',
  'content-type',
  'if-none-match',
  'if-modified-since',
  'x-request-id',
  'x-trace-id',
]);

async function proxy(
  req: Request,
  ctx: { params: Promise<{ path?: string[] }> } // params ahora es Promise
) {
  if (!BASE) {
    return NextResponse.json({ error: 'Misconfig: API_URL' }, { status: 500 });
  }

  // ✅ await en params
  const params = await ctx.params;
  const pathArray = params.path ?? [];
  const subpath = pathArray.join('/');

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }


  const incomingUrl = new URL(req.url);
  const targetUrl = `${BASE}/${subpath}${incomingUrl.search}`;

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);
  for (const [k, v] of req.headers) {
    if (FORWARD_HEADER_ALLOWLIST.has(k.toLowerCase())) {
      headers.set(k, v);
    }
  }

  let body: BodyInit | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.text();
  }

  try {
    const upstream = await fetch(targetUrl, { method: req.method, headers, body });

    const resHeaders = new Headers();
    const ct = upstream.headers.get('content-type');
    if (ct) resHeaders.set('content-type', ct);
    const cc = upstream.headers.get('cache-control');
    if (cc) resHeaders.set('cache-control', cc);

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: resHeaders,
    });
  } catch (err) {
    console.error('Error en proxy:', err);
    return NextResponse.json({ error: 'Error de conexión con el backend' }, { status: 500 });
  }
}

// 🔹 Métodos HTTP
export async function GET(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, ctx);
}
export async function POST(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, ctx);
}
export async function PUT(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, ctx);
}
export async function PATCH(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, ctx);
}
export async function DELETE(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, ctx);
}
export async function OPTIONS(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, ctx);
}
