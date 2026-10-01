import type { Handler } from '@netlify/functions';
import { ensureSchema } from './_shared/db';

export const handler: Handler = async (event) => {
  try {
    await ensureSchema();
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const body = event.body ? JSON.parse(event.body) : {};
    const password = (body.password || '').trim();

    const admin = process.env.ADMIN_PASSWORD;
    if (!admin) return { statusCode: 500, body: 'ADMIN_PASSWORD not configured' };
    if (!password) return { statusCode: 400, body: 'password is required' };
    if (password !== admin) return { statusCode: 401, body: 'invalid password' };

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    const cookie = `admin_password=${encodeURIComponent(admin)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${7*24*60*60}; Expires=${expires}`;

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': cookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ok: true })
    };
  } catch (e: any) {
    console.error(e);
    return { statusCode: e.statusCode || 500, body: e.message || 'Internal Error' };
  }
};
