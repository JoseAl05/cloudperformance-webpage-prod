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

  private async write(level: LogLevel, message: string, metadata?: LogMetadata) {
    if (!this.shouldLog(level)) return;

    const logEntry = this.formatLog(level, message, metadata);

    if (process.env.NODE_ENV === 'development') {
      const color = {
        info: '\x1b[36m',
        warn: '\x1b[33m',
        error: '\x1b[31m',
        debug: '\x1b[90m',
      }[level];

      console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
        `${color}[${logEntry.timestamp}] [${logEntry.level}] [${logEntry.context}] \x1b[0m ${message}`,
        metadata ?? ''
      );
    } else {
      console.log(JSON.stringify(logEntry));
    }

    await this.sendToNewRelic(level, message, metadata);
  }

  private async sendToNewRelic(level: LogLevel, message: string, metadata?: LogMetadata) {
    try {
      if (typeof window === 'undefined') {
        // Import dinámico (no require)
        const newrelic = await import('newrelic');

        if (metadata) {
          Object.entries(metadata).forEach(([key, value]) => {
            if (value === undefined) return; // evita mandar undefined

            newrelic.addCustomAttribute(
              key,
              typeof value === 'object' ? JSON.stringify(value) : (value as string | number | boolean)
            );
          });

        }

        if (level === 'error' && metadata?.error instanceof Error) {
          newrelic.noticeError(metadata.error, {
            context: this.context,
            customMessage: message,
            ...metadata
          });
        }

        newrelic.recordCustomEvent('ApplicationLog', {
          level: level.toUpperCase(),
          context: this.context,
          message,
          timestamp: new Date().toISOString(),
          ...metadata
        });
      }
    } catch (err: unknown) {
      console.error('Error enviando log a New Relic:', err);
    }
  }

  info(message: string, metadata?: LogMetadata) {
    this.write('info', message, metadata);
  }

  warn(message: string, metadata?: LogMetadata) {
    this.write('warn', message, metadata);
  }

  error(message: string, error?: Error | LogMetadata, metadata?: LogMetadata) {
    const errorMetadata: LogMetadata = {};

    if (error instanceof Error) {
      errorMetadata.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
      if (metadata) Object.assign(errorMetadata, metadata);
    } else if (error) {
      Object.assign(errorMetadata, error);
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
    } catch (error: unknown) {
      const duration = Date.now() - start;
      this.error(`${label} - fallido`, { error, duration: `${duration}ms` });
      throw error;
    }
  }
}

export const createLogger = (context: string) => new Logger(context);
export const logger = createLogger('App');
