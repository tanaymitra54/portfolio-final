import type { Handler } from "@netlify/functions";
import { getClient, ensureSchema, assertAdmin, json, parseJSON } from "./_shared/db";

export const handler: Handler = async (event) => {
  const client = await getClient();
  try {
    await ensureSchema(client);

    const method = event.httpMethod || "GET";
    const path = event.path || "/.netlify/functions/skills";
    const base = "/.netlify/functions/skills";
    const subpath = path.startsWith(base) ? path.slice(base.length) : "";

    if (method === "GET" && (subpath === "" || subpath === "/")) {
      const { rows } = await client.query(
        `SELECT id, name, level, category, created_at, updated_at
         FROM skills
         ORDER BY name ASC`
      );
      return json(200, { skills: rows });
    }

    if (method === "POST" && (subpath === "" || subpath === "/")) {
      const auth = assertAdmin(event.headers);
      if (!auth.ok) return json(401, { error: auth.error });
      const body = parseJSON(event.body);
      const { name, level, category } = body || {};
      const { rows } = await client.query(
        `INSERT INTO skills (name, level, category)
         VALUES ($1,$2,$3)
         RETURNING id, name, level, category, created_at, updated_at`,
        [name, level ?? 0, category ?? null]
      );
      return json(201, rows[0]);
    }

    if ((method === "PUT" || method === "PATCH") && subpath.startsWith("/")) {
      const auth = assertAdmin(event.headers);
      if (!auth.ok) return json(401, { error: auth.error });
      const id = Number(subpath.slice(1));
      if (!id) return json(400, { error: "Invalid id" });
      const body = parseJSON(event.body);
      const { name, level, category } = body || {};
      const { rows } = await client.query(
        `UPDATE skills SET
           name = COALESCE($2, name),
           level = COALESCE($3, level),
           category = COALESCE($4, category),
           updated_at = NOW()
         WHERE id = $1
         RETURNING id, name, level, category, created_at, updated_at`,
        [id, name, level, category]
      );
      if (!rows[0]) return json(404, { error: "Not found" });
      return json(200, rows[0]);
    }

    if (method === "DELETE" && subpath.startsWith("/")) {
      const auth = assertAdmin(event.headers);
      if (!auth.ok) return json(401, { error: auth.error });
      const id = Number(subpath.slice(1));
      if (!id) return json(400, { error: "Invalid id" });
      await client.query(`DELETE FROM skills WHERE id = $1`, [id]);
      return json(204, {});
    }

    return json(405, { error: "Method not allowed" });
  } catch (err: any) {
    console.error("/skills error", err);
    return json(500, { error: err?.message ?? "Internal error" });
  } finally {
    client.release();
  }
};
