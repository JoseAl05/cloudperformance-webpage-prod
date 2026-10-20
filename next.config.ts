import type { NextConfig } from 'next';

const LEGACY_CLOUD_BASES = ['aws', 'azure', 'gcp'];

const ROUTE_REDIRECTS: [string, string][] = [
  ['/cloud-aws/advisor', '/cloud-aws/recomendaciones'],
  ['/cloud-aws/saving-plan', '/cloud-aws/compromisos/saving-plans'],
  ['/cloud-azure/advisor', '/cloud-azure/recomendaciones'],
  ['/cloud-azure/saving-plan', '/cloud-azure/compromisos/saving-plans'],
  ['/cloud-azure/consumo-vm', '/cloud-azure/consumos/vm'],
  ['/cloud-azure/consumo-db', '/cloud-azure/consumos/db'],
  ['/cloud-azure/consumo-nodos', '/cloud-azure/consumos/nodos'],
  ['/cloud-azure/consumo-apps-gateway', '/cloud-azure/consumos/apps-gateway'],
  ['/cloud-azure/recursos-vm', '/cloud-azure/recursos/vm'],
  ['/cloud-azure/recursos-nodos', '/cloud-azure/recursos/nodos'],
  ['/cloud-azure/recursos-db-mysql', '/cloud-azure/recursos/db-mysql'],
  ['/cloud-azure/recursos-db-postgresql', '/cloud-azure/recursos/db-postgresql'],
  ['/cloud-azure/recursos-traffic-manager', '/cloud-azure/recursos/traffic-manager'],
  ['/cloud-azure/vista-facturacion/top-dolares-facturados', '/cloud-azure/facturacion/top-dolares-facturados'],
  ['/cloud-azure/vista-recursos/top-recursos-general', '/cloud-azure/recursos/top-recursos-general'],
  ['/cloud-gcp/recommender', '/cloud-gcp/recomendaciones'],
  ['/cloud-gcp/cuds', '/cloud-gcp/compromisos'],
  ['/cloud-gcp/recursos/filestore-sin-uso', '/cloud-gcp/funciones/unused-resources/filestore'],
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',

  async redirects() {
    const legacyBases = LEGACY_CLOUD_BASES.flatMap((cloud) => [
      { source: `/${cloud}`, destination: `/cloud-${cloud}`, permanent: false },
      { source: `/${cloud}/:path+`, destination: `/cloud-${cloud}/:path+`, permanent: false },
    ]);
    const moved = ROUTE_REDIRECTS.flatMap(([from, to]) => [
      { source: from, destination: to, permanent: false },
      { source: `${from}/:path+`, destination: `${to}/:path+`, permanent: false },
    ]);
    return [...legacyBases, ...moved];
  },

  serverExternalPackages: [
    'newrelic',
    '@newrelic/security-agent',
    '@grpc/grpc-js',
  ],

  webpack: (config, { isServer }) => {
    if (isServer) {
      if (!config.externals) {
        config.externals = [];
      }

      if (Array.isArray(config.externals)) {
        config.externals.push('newrelic');
        config.externals.push('@newrelic/security-agent');
        config.externals.push('@grpc/grpc-js');
      }
    } else {
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};

      config.resolve.alias['newrelic'] = false;
      config.resolve.alias['@newrelic/security-agent'] = false;
      config.resolve.alias['@grpc/grpc-js'] = false;
    }

    return config;
  },
};

export default nextConfig;
