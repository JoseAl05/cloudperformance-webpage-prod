import { bridgeBaseUrl, createBridge } from '@/lib/bridge';
import { BRIDGE_ALLOWED_PREFIXES } from '@/lib/bridgePaths';

const proxy = createBridge({
  service: 'comparación de nubes',
  baseUrl: bridgeBaseUrl('API_CLOUD_COMPARISON', 'API_CLOUD_COMPARISON_DEV'),
  envName: 'API_CLOUD_COMPARISON',
  allowedPrefixes: BRIDGE_ALLOWED_PREFIXES.comparisonCloud,
});

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as OPTIONS,
};
