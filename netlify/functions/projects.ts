import type { Handler } from '@netlify/functions';
import { ensureSchema, getPool, requireAdmin } from './_shared/db';

function parseId(path: string) {
  const m = path.match(/\/projects\/(\d+)$/);
  return m ? Number(m[1]) : null;
}

export const handler: Handler = async (event) => {
  try {
    await ensureSchema();
    const pool = getPool();

    // Route by method and path
    const path = event.path.replace(/^\/\.netlify\/functions\//, '/');

    if (event.httpMethod === 'GET' && path === '/projects') {
      const { rows } = await pool.query(`SELECT id, title, description, image_url, demo_url, github_url, technologies, featured, created_at, updated_at FROM projects ORDER BY created_at DESC`);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: rows.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description,
          imageUrl: r.image_url,
          demoUrl: r.demo_url,
          githubUrl: r.github_url,
          technologies: r.technologies || [],
          featured: r.featured,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        })) })
      };
    }

    if (event.httpMethod === 'POST' && path === '/projects') {
      requireAdmin(event.headers as any);
      const body = event.body ? JSON.parse(event.body) : {};
      const { title, description, imageUrl, demoUrl, githubUrl, technologies, featured } = body;
      if (!title) return { statusCode: 400, body: 'title is required' };
      const { rows } = await pool.query(
        `INSERT INTO projects (title, description, image_url, demo_url, github_url, technologies, featured)
         VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, false))
         RETURNING id, title, description, image_url, demo_url, github_url, technologies, featured, created_at, updated_at`,
        [title, description ?? null, imageUrl ?? null, demoUrl ?? null, githubUrl ?? null, technologies ?? [], featured]
      );
      const r = rows[0];
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        id: r.id,
        title: r.title,
        description: r.description,
        imageUrl: r.image_url,
        demoUrl: r.demo_url,
        githubUrl: r.github_url,
        technologies: r.technologies || [],
        featured: r.featured,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }) };
    }

    if ((event.httpMethod === 'PUT' || event.httpMethod === 'PATCH') && path.startsWith('/projects/')) {
      requireAdmin(event.headers as any);
      const id = parseId(path);
      if (!id) return { statusCode: 400, body: 'invalid id' };
      const body = event.body ? JSON.parse(event.body) : {};
      const { title, description, imageUrl, demoUrl, githubUrl, technologies, featured } = body;
      const { rows } = await getPool().query(
        `UPDATE projects SET 
           title = COALESCE($2, title),
           description = COALESCE($3, description),
           image_url = COALESCE($4, image_url),
           demo_url = COALESCE($5, demo_url),
           github_url = COALESCE($6, github_url),
           technologies = COALESCE($7, technologies),
           featured = COALESCE($8, featured),
           updated_at = NOW()
         WHERE id = $1
         RETURNING id, title, description, image_url, demo_url, github_url, technologies, featured, created_at, updated_at`,
        [id, title ?? null, description ?? null, imageUrl ?? null, demoUrl ?? null, githubUrl ?? null, technologies ?? null, featured ?? null]
      );
      if (!rows[0]) return { statusCode: 404, body: 'not found' };
      const r = rows[0];
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        id: r.id,
        title: r.title,
        description: r.description,
        imageUrl: r.image_url,
        demoUrl: r.demo_url,
        githubUrl: r.github_url,
        technologies: r.technologies || [],
        featured: r.featured,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }) };
    }

    if (event.httpMethod === 'DELETE' && path.startsWith('/projects/')) {
      requireAdmin(event.headers as any);
      const id = parseId(path);
      if (!id) return { statusCode: 400, body: 'invalid id' };
      await pool.query(`DELETE FROM projects WHERE id = $1`, [id]);
      return { statusCode: 204, body: '' };
    }

    return { statusCode: 404, body: 'Not Found' };
  } catch (e: any) {
    console.error(e);
    return { statusCode: e.statusCode || 500, body: e.message || 'Internal Error' };
  }
};
