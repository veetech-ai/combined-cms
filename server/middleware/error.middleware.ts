import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../util/api.error';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    console.error(err);
    return res.status(err.statusCode).json({
      message: err.message
    });
  }
  // Handle unexpected errors
  console.error('Unexpected error:', err);
  return res.status(500).json({
    message: 'Internal server error'
  });
};
