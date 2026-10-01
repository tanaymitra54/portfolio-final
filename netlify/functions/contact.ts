import type { Handler } from "@netlify/functions";
import { getClient, ensureSchema, json, parseJSON, assertAdmin } from "./_shared/db";

export const handler: Handler = async (event) => {
  const client = await getClient();
  try {
    await ensureSchema(client);

    const method = event.httpMethod || "POST";

    if (method === "POST") {
      const body = parseJSON(event.body);
      const { name, email, message } = body || {};
      if (!name || !email || !message) return json(400, { error: "Missing fields" });
      await client.query(
        `INSERT INTO contact_messages (name, email, message) VALUES ($1,$2,$3)`,
        [name, email, message]
      );
      return json(200, { ok: true });
    }

    if (method === "GET") {
      const auth = assertAdmin(event.headers);
      if (!auth.ok) return json(401, { error: auth.error });
      const { rows } = await client.query(
        `SELECT id, name, email, message, created_at FROM contact_messages ORDER BY created_at DESC`
      );
      return json(200, { messages: rows });
    }

    return json(405, { error: "Method not allowed" });
  } catch (err: any) {
    console.error("/contact error", err);
    return json(500, { error: err?.message ?? "Internal error" });
  } finally {
    client.release();
  }
};
