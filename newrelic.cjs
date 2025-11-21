// // newrelic.cjs
// 'use strict';

// exports.config = {
//   // Nombre de la aplicación
//   app_name: [process.env.NEW_RELIC_APP_NAME || 'CP'],

//   // License Key
//   license_key: process.env.NEW_RELIC_LICENSE_KEY,

//   // Logging detallado
//   logging: {
//     level: process.env.NEW_RELIC_LOG_LEVEL || 'info',
//     filepath: 'stdout',
//   },

//   // 🔥 IMPORTANTE: Activar el agente (temporalmente en desarrollo para testing)
//   // agent_enabled: true,  // ← Cambiar esto de false o de la condición a true
//   agent_enabled:
//     process.env.NODE_ENV === 'production' ||
//     process.env.NEW_RELIC_ENABLED === 'true',

//   distributed_tracing: {
//     enabled: true,
//   },

//   application_logging: {
//     enabled: true,
//     forwarding: {
//       enabled: true,
//       max_samples_stored: 10000,
//     },
//     metrics: {
//       enabled: true,
//     },
//     local_decorating: {
//       enabled: true,
//     },
//   },

//   transaction_tracer: {
//     enabled: true,
//   },

//   error_collector: {
//     enabled: true,
//     capture_events: true,
//   },
// };

// newrelic.js
'use strict';

exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info',
    // Importante para Vercel: logs a la consola, no a un fichero
    filepath: 'stdout',
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*',
    ],
  },
};
