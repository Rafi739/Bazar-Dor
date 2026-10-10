import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { getMigrations } from 'better-auth/db/migration';
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

const authOptions = {
  appName: 'Bazar Dor',
  database: new Database(path.join(databaseDirectory, 'auth.sqlite')),
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,
  ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      const apiKey = process.env.RESEND_API_KEY;
      const from = process.env.AUTH_EMAIL_FROM;
      if (!apiKey || !from) {
        throw new Error('Set RESEND_API_KEY and AUTH_EMAIL_FROM to send password reset emails.');
      }

      const { error } = await new Resend(apiKey).emails.send({
        from,
        to: user.email,
        subject: 'Reset your Bazar Dor password',
        html: `<p>We received a request to reset your password.</p><p><a href="${url}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
        text: `Reset your Bazar Dor password: ${url}\n\nIf you did not request this, you can ignore this email.`,
      });

      if (error) {
        throw new Error(`Could not send password reset email: ${error.message}`);
      }
    },
  },
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
