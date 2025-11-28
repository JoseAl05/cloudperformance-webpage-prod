// // instrumentation.ts
// export async function register() {
//   if (process.env.NEXT_RUNTIME === 'nodejs') {
//     // Solo importar en el servidor
//     await import('newrelic');
//     console.log('✅ New Relic APM iniciado');
//   }
// }

export async function register() {
  console.log('[INSTRUMENTATION] Iniciando verificación de monitoreo...');
  
  // Solo proceder si estamos en Node.js runtime
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    console.log('[INSTRUMENTATION] No está en nodejs runtime, skipping');
    return;
  }

  // Verificar si New Relic debe estar habilitado
  const newRelicEnabled = process.env.NEW_RELIC_ENABLED === 'true';
  
  console.log(`[INSTRUMENTATION] NEW_RELIC_ENABLED: ${process.env.NEW_RELIC_ENABLED}`);
  console.log(`[INSTRUMENTATION] New Relic será: ${newRelicEnabled ? 'ACTIVADO' : 'DESACTIVADO'}`);

  if (!newRelicEnabled) {
    console.log('[INSTRUMENTATION] New Relic desactivado - Agente NO se cargará');
    return; // ← Salir sin cargar New Relic
  }

  // Verificar que tenemos la license key
  if (!process.env.NEW_RELIC_LICENSE_KEY) {
    console.warn('[INSTRUMENTATION] NEW_RELIC_LICENSE_KEY no configurada - Agente NO se cargará');
    return;
  }

  // Solo cargar New Relic si está habilitado y configurado
  try {
    console.log('🔄 [INSTRUMENTATION] Cargando agente de New Relic...');
    await import('newrelic');
    console.log('[INSTRUMENTATION] New Relic APM iniciado exitosamente');
  } catch (error) {
    console.error('[INSTRUMENTATION] Error cargando New Relic:', error);
  }
}