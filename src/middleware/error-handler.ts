import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import pino from 'pino';

const logger = pino();

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 1. Log the full error for internal tracking
  logger.error({ err, url: req.url }, 'An unhandled error occurred');

  // 2. Catch Zod validation errors specifically
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'fail',
      message: 'Validation error',
      errors: err.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      })),
    });
    return;
  }

  // 3. Fallback for generic server errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message,
    // Only reveal stack traces in development mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
