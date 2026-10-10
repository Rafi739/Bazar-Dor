import { auth, ensureAuthDatabase } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

const handlers = toNextJsHandler(auth);

function withDatabaseReady(handler: typeof handlers.GET) {
  return async (...args: Parameters<typeof handler>) => {
    await ensureAuthDatabase();
    return handler(...args);
  };
}

export const GET = withDatabaseReady(handlers.GET);
export const POST = withDatabaseReady(handlers.POST);
