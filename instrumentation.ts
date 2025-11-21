// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Solo importar en el servidor
    await import('newrelic');
    console.log('✅ New Relic APM iniciado');
  }
}