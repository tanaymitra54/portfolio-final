import type { Handler } from "@netlify/functions";
import { getClient, ensureSchema, assertAdmin, json, parseJSON } from "./_shared/db";

export const handler: Handler = async (event) => {
  const client = await getClient();
  try {
    await ensureSchema(client);

    const method = event.httpMethod || "GET";
    const path = event.path || "/.netlify/functions/blog";
    const base = "/.netlify/functions/blog";
    const subpath = path.startsWith(base) ? path.slice(base.length) : "";

    if (method === "GET" && (subpath === "" || subpath === "/")) {
      const { rows } = await client.query(
        `SELECT id, title, content, excerpt, slug, published, featured_image_url, tags, created_at, updated_at
         FROM blog_posts
         ORDER BY created_at DESC`
      );
      return json(200, { posts: rows });
    }

    if (method === "GET" && subpath.startsWith("/")) {
      const slug = decodeURIComponent(subpath.slice(1));
      const { rows } = await client.query(
        `SELECT id, title, content, excerpt, slug, published, featured_image_url, tags, created_at, updated_at
         FROM blog_posts WHERE slug = $1 LIMIT 1`,
        [slug]
      );
      if (!rows[0]) return json(404, { error: "Not found" });
      return json(200, { post: rows[0] });
    }

    if (method === "POST" && (subpath === "" || subpath === "/")) {
      const auth = assertAdmin(event.headers);
      if (!auth.ok) return json(401, { error: auth.error });
      const body = parseJSON(event.body);
      const { title, content, excerpt, slug, published, featured_image_url, tags } = body || {};
      const { rows } = await client.query(
        `INSERT INTO blog_posts (title, content, excerpt, slug, published, featured_image_url, tags)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING id, title, content, excerpt, slug, published, featured_image_url, tags, created_at, updated_at`,
        [title, content, excerpt, slug, !!published, featured_image_url ?? null, tags ?? []]
      );
      return json(201, rows[0]);
    }

    if ((method === "PUT" || method === "PATCH") && subpath.startsWith("/")) {
      const auth = assertAdmin(event.headers);
      if (!auth.ok) return json(401, { error: auth.error });
      const id = Number(subpath.slice(1));
      if (!id) return json(400, { error: "Invalid id" });
      const body = parseJSON(event.body);
      const { title, content, excerpt, slug, published, featured_image_url, tags } = body || {};
      const { rows } = await client.query(
        `UPDATE blog_posts SET
           title = COALESCE($2, title),
           content = COALESCE($3, content),
           excerpt = COALESCE($4, excerpt),
           slug = COALESCE($5, slug),
           published = COALESCE($6, published),
           featured_image_url = COALESCE($7, featured_image_url),
           tags = COALESCE($8, tags),
           updated_at = NOW()
         WHERE id = $1
         RETURNING id, title, content, excerpt, slug, published, featured_image_url, tags, created_at, updated_at`,
        [id, title, content, excerpt, slug, published, featured_image_url, tags]
      );
      if (!rows[0]) return json(404, { error: "Not found" });
      return json(200, rows[0]);
    }

    if (method === "DELETE" && subpath.startsWith("/")) {
      const auth = assertAdmin(event.headers);
      if (!auth.ok) return json(401, { error: auth.error });
      const id = Number(subpath.slice(1));
      if (!id) return json(400, { error: "Invalid id" });
      await client.query(`DELETE FROM blog_posts WHERE id = $1`, [id]);
      return json(204, {});
    }

    return json(405, { error: "Method not allowed" });
  } catch (err: any) {
    console.error("/blog error", err);
    return json(500, { error: err?.message ?? "Internal error" });
  } finally {
    client.release();
  }
};
