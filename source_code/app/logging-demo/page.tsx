'use client';

import React, { useEffect, useState } from 'react';
import {
  ConsoleLoggerAdapter,
  Logger,
  LogEntry,
} from '../../src/generic/logging/loggingModule';

export default function LoggingDemoPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const adapter = new ConsoleLoggerAdapter();
    const logger = new Logger(adapter);

    // Use the logger in ANY way
    logger.info('User visited the Logging Demo page.', 'ui');
    logger.warn('This is a test warning.', 'ui');
    logger.error('Simulated error occurred.', 'ui');

    // Save the logs to UI state
    setLogs(adapter.logs);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Logging Demo Page</h1>
      <p>This page uses the same Generic Logging Subdomain as the payment system.</p>

      <h2>Log Entries</h2>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            <strong>[{log.level}]</strong> {log.message} ({log.context}) —{' '}
            {log.timestamp.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
