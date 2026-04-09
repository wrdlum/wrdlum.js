import type { Request, Response } from 'express';

import { logger } from '../utils/logger.js';

interface GatewayError extends Error {
  statusCode?: number;
  status?: string;
  code?: string;
}

/**
 * Global error handling middleware using Pino.
 */
export const globalErrorHandler = (
  error: GatewayError,
  request: Request,
  res: Response
) => {
  const statusCode = error.statusCode || 500;

  logger.error(
    {
      err: error,
      request: {
        method: request.method,
        url: request.url,
        ip: request.ip,
      },
    },
    'Request failed'
  );

  res.status(statusCode).json({
    status: statusCode >= 400 && statusCode < 500 ? 'fail' : 'error',
    message: statusCode === 500 ? 'Internal Server Error' : error.message,
  });
};
