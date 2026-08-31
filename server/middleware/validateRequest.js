import { validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError.js';

export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((item) => item.msg);
    throw new ApiError(400, details[0] || 'Invalid input', details);
  }
  next();
}
