import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configuración recomendada para Next.js 15
  serverExternalPackages: [
    'newrelic',
    '@newrelic/security-agent',
    '@grpc/grpc-js',
  ],

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Asegurar que newrelic no sea empaquetado por webpack
      if (!config.externals) {
        config.externals = [];
      }

      // Si externals es un array
      if (Array.isArray(config.externals)) {
        config.externals.push('newrelic');
        config.externals.push('@newrelic/security-agent');
        config.externals.push('@grpc/grpc-js');
      }
    } else {
      // En el cliente, asegurar que newrelic nunca se incluya
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};

      // Reemplazar newrelic con un módulo vacío en el cliente
      config.resolve.alias['newrelic'] = false;
      config.resolve.alias['@newrelic/security-agent'] = false;
      config.resolve.alias['@grpc/grpc-js'] = false;
    }

    return config;
  },
};

export default nextConfig;

//------- ** Usar TURBOPACK debido a nueva version de Nextjs 16.* lo usará por defecto y no WebPack ** -----------//

// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },

//   // Se mantiene igual: Turbopack también usa esta opción
//   serverExternalPackages: [
//     'newrelic',
//     '@newrelic/security-agent',
//     '@grpc/grpc-js',
//   ],

//   turbopack: {
//     resolveAlias: {
//       // En Turbopack esto es equivalente a: config.resolve.alias[...] = false;
//       'newrelic': 'newrelic',
//       '@newrelic/security-agent': '@newrelic/security-agent',
//       '@grpc/grpc-js': '@grpc/grpc-js',
//     },
//   },
// };

// export default nextConfig;
