export async function register() {
  console.log('[INSTRUMENTATION] Iniciando verificación de monitoreo...');
  
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    console.log('[INSTRUMENTATION] No está en nodejs runtime, skipping');
    return;
  }

  const newRelicEnabled = process.env.NEW_RELIC_ENABLED === 'true';
  
  console.log(`[INSTRUMENTATION] NEW_RELIC_ENABLED: ${process.env.NEW_RELIC_ENABLED}`);
  console.log(`[INSTRUMENTATION] New Relic será: ${newRelicEnabled ? 'ACTIVADO' : 'DESACTIVADO'}`);

  if (!newRelicEnabled) {
    console.log('[INSTRUMENTATION] New Relic desactivado - Agente NO se cargará');
    return;
  }

  if (!process.env.NEW_RELIC_LICENSE_KEY) {
    console.warn('[INSTRUMENTATION] NEW_RELIC_LICENSE_KEY no configurada - Agente NO se cargará');
    return;
  }

  try {
    console.log('🔄 [INSTRUMENTATION] Cargando agente de New Relic...');
    await import('newrelic');
    console.log('[INSTRUMENTATION] New Relic APM iniciado exitosamente');
  } catch (error) {
    console.error('[INSTRUMENTATION] Error cargando New Relic:', error);
  }
}