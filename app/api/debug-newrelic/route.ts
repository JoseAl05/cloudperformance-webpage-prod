import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Cargamos new relic dinámicamente en Node
    const { default: newrelic } = await import('newrelic');

    const diagnostics = {
      newrelicLoaded: !!newrelic,
      agentEnabled: newrelic.agent?.config?.agent_enabled || false,
      appName: newrelic.agent?.config?.app_name || 'Not configured',
      licenseKey: newrelic.agent?.config?.license_key
        ? `${newrelic.agent.config.license_key.substring(0, 8)}...`
        : 'Not configured',
      connected: false,
      nodeEnv: process.env.NODE_ENV,
      nextRuntime: process.env.NEXT_RUNTIME,
    };

    try {
      diagnostics.connected = newrelic.agent.collector?.isConnected?.() || false;
    } catch {
      diagnostics.connected = false;
    }

    newrelic.recordCustomEvent('DebugTest', {
      message: 'Test event from debug endpoint',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      status: 'success',
      diagnostics,
      message: 'Evento enviado. Revisa New Relic en 1-2 minutos.'
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        message: 'New Relic no pudo cargarse.'
      },
      { status: 500 }
    );
  }
}
