import { bridgeBaseUrl, createBridge } from '@/lib/bridge';
import { BRIDGE_ALLOWED_PREFIXES } from '@/lib/bridgePaths';

const proxy = createBridge({
  service: 'GCP',
  baseUrl: bridgeBaseUrl('API_GCP_URL', 'API_GCP_URL_DEV'),
  envName: 'API_GCP_URL',
  allowedPrefixes: BRIDGE_ALLOWED_PREFIXES.gcp,
});

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as OPTIONS,
};
