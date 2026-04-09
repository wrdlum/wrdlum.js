import pino from 'pino';

/**
 * Logger instance for the API Gateway.
 * Configured for JSON output and sensitive data redaction.
 */
export const logger = pino({
  level: process.env.WRDLUM_LOG_LEVEL || 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.body.password',
      'res.headers["set-cookie"]',
    ],
    censor: '[REDACTED]',
  },
  // In development, you might want "pino-pretty" for readability
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});
