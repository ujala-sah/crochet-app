import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loadEnv } from '../config/env.js';
import { sendOtpEmail } from '../utils/mailer.js';

const env = loadEnv();

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

function makeOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function assignOtp(user) {
  const code = makeOtp();
  user.otpHash = await bcrypt.hash(code, 10);
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  user.emailVerified = false;
  await user.save();
  try {
    await sendOtpEmail(user.email, code, user.name);
  } catch (error) {
    console.error('OTP email failed:', error.message);
    throw new ApiError(
      502,
      'We could not send the verification email. Check the email address and try again. If this continues, wait a minute and resend the code.'
    );
  }
  return code;
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalized = email.toLowerCase();
  let user = await User.findOne({ email: normalized }).select('+otpHash');

  if (user && user.emailVerified !== false) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  if (user) {
    user.name = name;
    user.password = password;
  } else {
    user = new User({ name, email: normalized, password, role: 'user', emailVerified: false });
  }

  await assignOtp(user);

  res.status(201).json({
    message: 'We sent a 6-digit code to your email. Enter it to finish signing up.',
    needsVerification: true,
    email: user.email,
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').toLowerCase();
  const code = String(req.body.code || '').trim();
  const user = await User.findOne({ email }).select('+password +otpHash');
  if (!user) throw new ApiError(404, 'Account not found. Please register again.');
  if (user.emailVerified !== false) {
    return res.json({
      message: 'This email is already verified. Please log in.',
      needsLogin: true,
      email: user.email,
    });
  }
  if (!user.otpHash || !user.otpExpires || user.otpExpires < new Date()) {
    throw new ApiError(400, 'That code has expired. Request a new one.');
  }
  const ok = await bcrypt.compare(code, user.otpHash);
  if (!ok) throw new ApiError(400, 'That code is incorrect.');

  user.emailVerified = true;
  user.otpHash = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({
    message: 'Email verified. Please log in to continue.',
    needsLogin: true,
    email: user.email,
  });
});

export const resendOtp = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').toLowerCase();
  const user = await User.findOne({ email }).select('+otpHash');
  if (!user) throw new ApiError(404, 'Account not found. Please register first.');
  if (user.emailVerified !== false) throw new ApiError(400, 'This email is already verified.');
  await assignOtp(user);
  res.json({
    message: 'A new code was sent to your email.',
    needsVerification: true,
    email: user.email,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }
  if (user.emailVerified === false) {
    throw new ApiError(403, 'Please verify the code we sent to your email.', {
      needsVerification: true,
      email: user.email,
    });
  }

  const token = signToken(user);
  res.json({
    message: 'Logged in successfully.',
    token,
    user: user.toSafeJSON(),
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});
