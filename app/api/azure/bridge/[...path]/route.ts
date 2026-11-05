import { bridgeBaseUrl, createBridge } from '@/lib/bridge';
import { BRIDGE_ALLOWED_PREFIXES } from '@/lib/bridgePaths';

const proxy = createBridge({
  service: 'Azure',
  baseUrl: bridgeBaseUrl('API_AZURE_URL', 'API_AZURE_URL_DEV'),
  envName: 'API_AZURE_URL',
  allowedPrefixes: BRIDGE_ALLOWED_PREFIXES.azure,
});

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as OPTIONS,
};
