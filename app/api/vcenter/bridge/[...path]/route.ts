import { bridgeBaseUrl, createBridge } from '@/lib/bridge';
import { BRIDGE_ALLOWED_PREFIXES } from '@/lib/bridgePaths';

const proxy = createBridge({
  service: 'vCenter',
  baseUrl: bridgeBaseUrl('API_VCENTER_URL', 'API_VCENTER_URL_DEV'),
  envName: 'API_VCENTER_URL',
  allowedPrefixes: BRIDGE_ALLOWED_PREFIXES.vcenter,
});

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as OPTIONS,
};
