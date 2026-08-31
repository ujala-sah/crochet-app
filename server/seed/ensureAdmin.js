import { User } from '../models/User.js';
import { loadEnv } from '../config/env.js';

export async function ensureAdmin() {
  const env = loadEnv();
  const email = env.adminEmail.toLowerCase();
  const existing = await User.findOne({ email }).select('+password');

  if (!existing) {
    await User.create({
      name: env.adminName,
      email,
      password: env.adminPassword,
      role: 'admin',
      emailVerified: true,
    });
    console.log(`Admin account created for ${email}`);
    return;
  }

  existing.role = 'admin';
  existing.emailVerified = true;
  existing.password = env.adminPassword;
  await existing.save();
}
