import nodemailer from 'nodemailer';
import { loadEnv } from '../config/env.js';

function createTransport() {
  const env = loadEnv();
  const user = (env.emailUser || '').trim();
  const pass = (env.emailPass || '').replace(/\s/g, '');
  if (!user || !pass) {
    throw new Error('Email is not configured. Set EMAIL_USER and EMAIL_PASS.');
  }
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

export async function sendOtpEmail(to, code, name) {
  const env = loadEnv();
  const mailer = createTransport();
  const info = await mailer.sendMail({
    from: `"Yarn-Tales" <${env.emailUser.trim()}>`,
    to,
    replyTo: env.emailUser.trim(),
    subject: 'Your Yarn-Tales verification code',
    text: `Hi ${name || 'there'},\n\nYour Yarn-Tales verification code is ${code}.\nIt expires in 10 minutes.\n\nIf you did not create an account, you can ignore this email.`,
    html: `
      <div style="font-family:Georgia,serif;background:#F7F1E8;padding:32px;color:#3F2A22">
        <h1 style="color:#C4785A;margin:0 0 16px">Yarn-Tales</h1>
        <p>Hi ${name || 'there'},</p>
        <p>Use this code to finish creating your account:</p>
        <p style="font-size:32px;letter-spacing:8px;font-weight:700;color:#8A4A35">${code}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
  console.log(`OTP email sent to ${to} (${info.response})`);
}
