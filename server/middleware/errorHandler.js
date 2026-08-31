import { ApiError } from '../utils/apiError.js';

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  void next;

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((item) => item.message);
    return res.status(400).json({ message: 'Validation failed', details });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({ message: `A record with that ${field} already exists.` });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid identifier provided.' });
  }

  const status = err instanceof ApiError ? err.statusCode : err.statusCode || 500;
  const message =
    status >= 500 && process.env.NODE_ENV === 'production'
      ? 'Something went wrong. Please try again later.'
      : err.message || 'Server error';

  const payload = { message };
  if (err.details) {
    payload.details = err.details;
    if (typeof err.details === 'object' && !Array.isArray(err.details)) {
      Object.assign(payload, err.details);
    }
  }
  if (process.env.NODE_ENV !== 'production' && status >= 500) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}
