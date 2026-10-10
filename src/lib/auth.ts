import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { getMigrations } from 'better-auth/db/migration';
import { emailOTP } from 'better-auth/plugins/email-otp';
import Database from 'better-sqlite3';
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

async function sendAuthEmail(email: string, subject: string, html: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;
  if (!apiKey || !from) {
    throw new Error('Email service is not configured. Set RESEND_API_KEY and AUTH_EMAIL_FROM.');
  }

  const { error } = await new Resend(apiKey).emails.send({ from, to: email, subject, html, text });
  if (error) {
    throw new Error(`Could not send email: ${error.message}`);
  }
}

const authOptions = {
  appName: 'Bazar Dor',
  database: new Database(path.join(databaseDirectory, 'auth.sqlite')),
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,
  ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthEmail(
        user.email,
        'Reset your Bazar Dor password',
        `<p>We received a request to reset your password.</p><p><a href="${url}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
        `Reset your Bazar Dor password: ${url}\n\nIf you did not request this, you can ignore this email.`,
      );
    },
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
        if (!process.env.RESEND_API_KEY || !process.env.AUTH_EMAIL_FROM) {
          if (process.env.NODE_ENV === 'development') {
            console.info(`[Bazar Dor] Local password reset code for ${email}: ${otp}`);
            return;
          }
          throw new Error('Email service is not configured. Set RESEND_API_KEY and AUTH_EMAIL_FROM.');
        }
        await sendAuthEmail(
          email,
          'Bazar Dor password reset code',
          `<p>Your Bazar Dor password reset code is:</p><p style="font-size:28px;font-weight:bold;letter-spacing:8px">${otp}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>`,
          `Your Bazar Dor password reset code is ${otp}. It expires in 10 minutes.`,
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
