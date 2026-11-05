import { NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { createBridge } from '@/lib/bridge';
import { BRIDGE_ALLOWED_PREFIXES } from '@/lib/bridgePaths';

const proxy = createBridge({
  service: 'Open IA',
  baseUrl: (process.env.API_OPENAI_URL || process.env.API_OPENIA_URL || '').replace(/\/+$/, ''),
  envName: 'API_OPENAI_URL',
  allowedPrefixes: BRIDGE_ALLOWED_PREFIXES.openai,
  authorize: async (token) => {
    const payload = await verifyAuthToken(token);
    if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    if (payload.is_openai !== true) {
      return NextResponse.json({ error: 'Open IA no habilitado para este perfil' }, { status: 403 });
    }
    return null;
  },
});

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as OPTIONS,
};
