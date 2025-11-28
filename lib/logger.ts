// lib/logger.ts
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMetadata {
  [key: string]: unknown;
}

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatLog(level: LogLevel, message: string, metadata?: LogMetadata) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level: level.toUpperCase(),
      context: this.context,
      message,
      ...(metadata && { metadata }),
      env: process.env.NODE_ENV,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (process.env.NODE_ENV === 'development') return true;
    if (level === 'debug' && process.env.NODE_ENV === 'production') return false;
    return true;
  }

  private write(level: LogLevel, message: string, metadata?: LogMetadata) {
    if (!this.shouldLog(level)) return;

    const logEntry = this.formatLog(level, message, metadata);

    if (process.env.NODE_ENV === 'development') {
      const color = {
        info: '\x1b[36m',
        warn: '\x1b[33m',
        error: '\x1b[31m',
        debug: '\x1b[90m',
      }[level];

      const reset = '\x1b[0m';

      console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
        `${color}[${logEntry.timestamp}] [${logEntry.level}] [${logEntry.context}]${reset} ${message}`,
        metadata ?? ''
      );
    } else {
      console.log(JSON.stringify(logEntry));
    }

    this.sendToNewRelic(level, message, metadata);
  }

  private sendToNewRelic(level: LogLevel, message: string, metadata?: LogMetadata) {
    if (process.env.NEW_RELIC_ENABLED !== 'true') return;

    // Solo en entorno server (Next.js evita Webpack bundle)
    if (typeof window !== 'undefined') return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const newrelic = require('newrelic') as {
        agent?: { config?: { agent_enabled?: boolean } };
        addCustomAttribute: (k: string, v: unknown) => void;
        noticeError: (err: Error, meta?: Record<string, unknown>) => void;
        recordCustomEvent: (name: string, data: Record<string, unknown>) => void;
      };

      if (!newrelic?.agent?.config?.agent_enabled) {
        if (process.env.NODE_ENV === 'development') {
          console.debug('New Relic cargado pero el agente no está activo');
        }
        return;
      }

      // Agregar metadata personalizada
      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          try {
            newrelic.addCustomAttribute(
              key,
              typeof value === 'object' ? JSON.stringify(value) : value
            );
          } catch {
            /* ignorado */
          }
        });
      }

      // Registrar errores
      const metadataError = metadata as { error?: Error };

      if (level === 'error' && metadataError?.error instanceof Error) {
        newrelic.noticeError(metadataError.error, {
          context: this.context,
          customMessage: message,
          ...(metadata ?? {})
        });
      }

      // Crear evento personalizado
      const eventData: Record<string, unknown> = {
        level: level.toUpperCase(),
        context: this.context,
        message,
        timestamp: new Date().toISOString(),
        ...(metadata ?? {})
      };

      newrelic.recordCustomEvent('ApplicationLog', eventData);

      if (process.env.NODE_ENV === 'development') {
        console.log('Evento enviado a New Relic:', {
          type: 'ApplicationLog',
          data: eventData,
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('New Relic no disponible:', error);
      }
    }
  }

  info(message: string, metadata?: LogMetadata) {
    this.write('info', message, metadata);
  }

  warn(message: string, metadata?: LogMetadata) {
    this.write('warn', message, metadata);
  }

  error(message: string, errorOrMeta?: Error | LogMetadata, metadata?: LogMetadata) {
    const errorMetadata: LogMetadata = {};

    if (errorOrMeta instanceof Error) {
      errorMetadata.error = {
        name: errorOrMeta.name,
        message: errorOrMeta.message,
        stack: errorOrMeta.stack,
      };

      if (metadata) Object.assign(errorMetadata, metadata);
    } else if (errorOrMeta) {
      Object.assign(errorMetadata, errorOrMeta);
    }

    this.write('error', message, errorMetadata);
  }

  debug(message: string, metadata?: LogMetadata) {
    this.write('debug', message, metadata);
  }

  async time<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    this.debug(`${label} - iniciado`);

    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.info(`${label} - completado`, { duration: `${duration}ms` });
      return result;
    } catch (err) {
      const duration = Date.now() - start;
      this.error(`${label} - fallido`, err as Error, { duration: `${duration}ms` });
      throw err;
    }
  }
}

export const createLogger = (context: string) => new Logger(context);

export const logger = createLogger('App');
