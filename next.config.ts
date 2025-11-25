// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   // eslint: {
//   //   // Dangerously allow production builds to successfully complete even if
//   //   // your project has ESLint errors.
//   //   ignoreDuringBuilds: true,
//   // },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   serverExternalPackages: ['newrelic'],

//   webpack: (config, { isServer }) => {
//     if (isServer) {
//       // Asegurar que newrelic no sea empaquetado por webpack
//       config.externals = config.externals || [];
//       config.externals.push('newrelic');
//     }
//     return config;
//   },

// };

// export default nextConfig;


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