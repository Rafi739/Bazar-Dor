import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { getMigrations } from 'better-auth/db/migration';
import { emailOTP } from 'better-auth/plugins/email-otp';
import Database from 'better-sqlite3';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import fs from 'node:fs';
import path from 'node:path';

const databaseDirectory = path.join(process.cwd(), '.local');
fs.mkdirSync(databaseDirectory, { recursive: true });

const socialProviders = {
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),
  ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      }
    : {}),
};

const baseURL =
  process.env.BETTER_AUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const authSecret = process.env.BETTER_AUTH_SECRET || 'development-secret-for-bazar-dor-change-me';

async function sendAuthEmail(email: string, subject: string, html: string, text: string) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');

  if (gmailUser && gmailAppPassword) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    await transporter.sendMail({
      from: {
        name: 'Bazar Dor',
        address: gmailUser,
      },
      to: email,
      subject,
      html,
      text,
    });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;
  if (apiKey && from) {
    const { error } = await new Resend(apiKey).emails.send({ from, to: email, subject, html, text });
    if (error) {
      throw new Error(`Could not send email: ${error.message}`);
    }
    return;
  }

  throw new Error(
    'Email is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD, or set RESEND_API_KEY and AUTH_EMAIL_FROM.',
  );
}

const authOptions = {
  appName: 'Bazar Dor',
  database: new Database(path.join(databaseDirectory, 'auth.sqlite')),
  baseURL,
  secret: authSecret,
  ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    revokeSessionsOnPasswordReset: true,
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 600,
      allowedAttempts: 5,
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type !== 'forget-password') {
          throw new Error(`Unsupported email code type: ${type}`);
        }
        await sendAuthEmail(
          email,
          'বাজার দর — পাসওয়ার্ড রিসেট কোড',
          `<div style="font-family:Arial,sans-serif;color:#1f2937"><h2>পাসওয়ার্ড রিসেট কোড</h2><p>আপনার পাসওয়ার্ড পরিবর্তন করতে নিচের কোডটি অ্যাপে লিখুন:</p><p style="font-size:32px;font-weight:bold;letter-spacing:10px;color:#047857">${otp}</p><p>কোডটি ১০ মিনিটের মধ্যে ব্যবহার করুন। আপনি অনুরোধ না করলে এই ইমেইলটি উপেক্ষা করুন।</p></div>`,
          `আপনার Bazar Dor পাসওয়ার্ড রিসেট কোড: ${otp}\n\nকোডটি ১০ মিনিটের মধ্যে ব্যবহার করুন।`,
        );
      },
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth(authOptions);

let migrationPromise: Promise<void> | undefined;

export function ensureAuthDatabase() {
  if (!migrationPromise) {
    migrationPromise = getMigrations(authOptions)
      .then(({ runMigrations }) => runMigrations())
      .catch((error: unknown) => {
        migrationPromise = undefined;
        throw error;
      });
  }

  return migrationPromise;
}
