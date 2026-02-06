// Simple structured logger
type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  error?: Error | unknown
}

class Logger {
  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    }

    if (error instanceof Error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    } else if (error) {
      entry.error = error
    }

    // In production, this would send to a service like Datadog, Sentry, or CloudWatch
    console[level](JSON.stringify(entry))
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context)
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    this.log('error', message, context, error)
  }

  debug(message: string, context?: Record<string, unknown>) {
    // Only log debug in development
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, context)
    }
  }
}

export const logger = new Logger()
