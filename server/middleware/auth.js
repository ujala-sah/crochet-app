import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loadEnv } from '../config/env.js';

const env = loadEnv();

function getToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

export const authenticateUser = asyncHandler(async (req, res, next) => {
  const token = getToken(req);
  if (!token) throw new ApiError(401, 'Please log in to continue.');

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.id);
    if (!user) throw new ApiError(401, 'Account not found. Please log in again.');
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, 'Session expired or invalid. Please log in again.');
  }
});

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = getToken(req);
  if (!token) return next();
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.id);
    if (user) req.user = user;
  } catch {
    // Ignore invalid tokens on public routes.
  }
  next();
});

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Administrator access is required.');
  }
  next();
}

export function forbidAdminShopper(req, res, next) {
  if (req.user?.role === 'admin') {
    throw new ApiError(403, 'Administrators cannot add products to the cart or wishlist.');
  }
  next();
}
