import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn('DATABASE_URL is not set. Functions will fail until it is configured.');
}

let pool: Pool | null = null;

export function getPool() {
  if (!pool) {
    pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  }
  return pool;
}

export async function getClient() {
  return await getPool().connect();
}

export async function ensureSchema(clientOpt?: import('pg').PoolClient) {
  // Create tables if they don't exist. Idempotent.
  const client = clientOpt ?? (await getPool().connect());
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id BIGSERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        demo_url TEXT,
        github_url TEXT,
        technologies TEXT[],
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        level INTEGER NOT NULL DEFAULT 0,
        category TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id BIGSERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        slug TEXT NOT NULL UNIQUE,
        published BOOLEAN NOT NULL DEFAULT FALSE,
        featured_image_url TEXT,
        tags TEXT[],
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        read BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id BIGSERIAL PRIMARY KEY,
        site_title TEXT,
        hero_title TEXT,
        hero_subtitle TEXT,
        about_me TEXT,
        github_url TEXT,
        linkedin_url TEXT,
        twitter_url TEXT,
        owner_name TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        theme_color TEXT,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    if (!clientOpt) client.release();
  }
}

export function requireAdmin(headers: Record<string, string | string[] | undefined>) {
  const provided = (headers['x-admin-password'] ?? headers['X-Admin-Password']) as string | undefined;
  const cookie = (headers['cookie'] as string | undefined) || '';
  const cookieMatch = /admin_password=([^;]+)/.exec(cookie);
  const cookieVal = cookieMatch?.[1];
  const admin = process.env.ADMIN_PASSWORD;
  if (!admin) throw new Error('ADMIN_PASSWORD not configured');
  if (provided && provided === admin) return true;
  if (cookieVal && cookieVal === admin) return true;
  const err = new Error('unauthenticated');
  // @ts-ignore attach status for netlify to use
  (err as any).statusCode = 401;
  throw err;
}

export function assertAdmin(headers: Record<string, string | string[] | undefined>) {
  try {
    requireAdmin(headers);
    return { ok: true as const };
  } catch (e: any) {
    return { ok: false as const, error: e?.message ?? 'unauthenticated' };
  }
}

export function json(statusCode: number, body: any, headers?: Record<string, string>) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...(headers || {}) },
    body: JSON.stringify(body),
  } as const;
}

export function parseJSON(body: string | null | undefined) {
  if (!body) return {} as any;
  try {
    return JSON.parse(body);
  } catch {
    return {} as any;
  }
}
