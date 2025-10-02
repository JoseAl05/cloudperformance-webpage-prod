import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/cookies';

const BASE = (process.env.API_AWS_URL || '').replace(/\/+$/, '');

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
  ctx: { params: Promise<{ path?: string[] }> }
) {
  if (!BASE) {
    return NextResponse.json({ error: 'Misconfig: API_URL' }, { status: 500 });
  }
  const { path } = await ctx.params;
  const subpath = (path ?? []).join('/');

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token)
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const incomingUrl = new URL(req.url);
  const targetUrl = `${BASE}/${subpath}${incomingUrl.search}`;

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);
  for (const [k, v] of req.headers) {
    const key = k.toLowerCase();
    if (FORWARD_HEADER_ALLOWLIST.has(key)) headers.set(k, v);
  }

  const method = req.method.toUpperCase();
  const init: RequestInit = {
    method,
    headers,
    body:
      method === 'GET' || method === 'HEAD' ? undefined : (req.body as unknown),
    // cache: 'no-store',
    duplex: 'half',
  };

  const upstream = await fetch(targetUrl, init);
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
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as OPTIONS,
};
