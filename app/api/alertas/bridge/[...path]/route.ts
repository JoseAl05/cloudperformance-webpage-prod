import { bridgeBaseUrl, createBridge } from '@/lib/bridge';
import { BRIDGE_ALLOWED_PREFIXES } from '@/lib/bridgePaths';

const ENV_URL = bridgeBaseUrl('API_ALERTAS_URL', 'API_ALERTAS_URL_DEV');
const BASE = !ENV_URL || ENV_URL.endsWith('/alerts') ? ENV_URL : `${ENV_URL}/alerts`;

const proxy = createBridge({
  service: 'alertas',
  baseUrl: BASE,
  envName: 'API_ALERTAS_URL',
  allowedPrefixes: BRIDGE_ALLOWED_PREFIXES.alertas,
});

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as OPTIONS,
};
