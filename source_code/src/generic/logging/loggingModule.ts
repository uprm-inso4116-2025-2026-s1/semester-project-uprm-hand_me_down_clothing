// src/generic/logging/loggingModule.ts

export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  context?: string;   // e.g. "payment", "listings"
  timestamp: Date;
}

export interface LoggerPort {
  write(entry: LogEntry): void | Promise<void>;
}

// Core generic logger
export class Logger {
  constructor(private readonly writer: LoggerPort) {}

  info(message: string, context?: string) {
    this.log('INFO', message, context);
  }

  warn(message: string, context?: string) {
    this.log('WARN', message, context);
  }

  error(message: string, context?: string) {
    this.log('ERROR', message, context);
  }

  private log(level: LogLevel, message: string, context?: string) {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      level,
      message,
      context,
      timestamp: new Date(),
    };

    this.writer.write(entry);
  }
}

// Simple adapter for dev/tests
export class ConsoleLoggerAdapter implements LoggerPort {
  public logs: LogEntry[] = [];

  write(entry: LogEntry) {
    this.logs.push(entry);
    console.log(`[${entry.level}] [${entry.context ?? 'general'}] ${entry.message}`);
  }
}
