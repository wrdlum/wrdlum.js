import express, { type NextFunction, Request, Response } from 'express';

import cors from 'cors';
import { rateLimit } from 'express-rate-limit';

import { ALLOWED_HOSTS, PORT } from './consts.js';
import { globalErrorHandler } from './middlewares/error-handler.js';
import { AppError } from './utils/app-error.js';

const app = express();

/**
 * CORS configuration to allow requests from specified origins in ALLOWED_HOSTS.
 */
app.use(cors({ origin: ALLOWED_HOSTS, credentials: true }));

/**
 * Rate limiting middleware to protect against DoS attacks.
 * Applied globally to all incoming requests.
 */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window
    standardHeaders: 'draft-7', // combined RateLimit header
    legacyHeaders: false, // Disable X-RateLimit-* headers
    message: 'Too many requests from this IP, please try again later.',
  })
);

app.get('/', (request: Request, res: Response) => {
  res.send('Gateway is running!');
});

app.all('*', (request: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${request.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`[gateway]: Gateway is running at http://localhost:${PORT}`);
});
