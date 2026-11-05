import { bridgeBaseUrl, createBridge } from '@/lib/bridge';
import { BRIDGE_ALLOWED_PREFIXES } from '@/lib/bridgePaths';

const proxy = createBridge({
  service: 'presupuestos',
  baseUrl: bridgeBaseUrl('API_PRESUPUESTO', 'API_PRESUPUESTO_DEV'),
  envName: 'API_PRESUPUESTO',
  allowedPrefixes: BRIDGE_ALLOWED_PREFIXES.presupuesto,
  bufferBody: true,
});

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as OPTIONS,
};
