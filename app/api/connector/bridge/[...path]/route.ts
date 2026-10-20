import { bridgeBaseUrl, createBridge } from '@/lib/bridge';
import { BRIDGE_ALLOWED_PREFIXES } from '@/lib/bridgePaths';

const proxy = createBridge({
  service: 'conectores',
  baseUrl: bridgeBaseUrl('API_CONNECTORS', 'API_CONNECTORS_DEV'),
  envName: 'API_CONNECTORS',
  allowedPrefixes: BRIDGE_ALLOWED_PREFIXES.connector,
});

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as OPTIONS,
};
