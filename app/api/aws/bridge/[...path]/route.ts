import { bridgeBaseUrl, createBridge } from '@/lib/bridge';
import { BRIDGE_ALLOWED_PREFIXES } from '@/lib/bridgePaths';

const proxy = createBridge({
  service: 'AWS',
  baseUrl: bridgeBaseUrl('API_AWS_URL', 'API_AWS_URL_DEV'),
  envName: 'API_AWS_URL',
  allowedPrefixes: BRIDGE_ALLOWED_PREFIXES.aws,
});

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as OPTIONS,
};
