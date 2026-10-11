import fs from 'node:fs';
import path from 'node:path';

const logPath = path.join(process.cwd(), '.local', 'mock-email-log.json');

function readLog() {
  if (!fs.existsSync(logPath)) {
    return [] as Array<Record<string, unknown>>;
  }

  try {
    const content = fs.readFileSync(logPath, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as Array<Record<string, unknown>>;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = (searchParams.get('email') ?? '').trim().toLowerCase();

  const entries = readLog();
  const entry = email
    ? entries.filter((item) => String(item.email ?? '').toLowerCase() === email).at(-1)
    : entries.at(-1);

  return Response.json({ email: entry ?? null });
}
