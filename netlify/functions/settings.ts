import type { Handler } from "@netlify/functions";
import { getClient, ensureSchema, assertAdmin, json, parseJSON } from "./_shared/db";

export const handler: Handler = async (event) => {
  const client = await getClient();
  try {
    await ensureSchema(client);

    const method = event.httpMethod || "GET";

    if (method === "GET") {
      const { rows } = await client.query(`SELECT * FROM site_settings LIMIT 1`);
      return json(200, rows[0] ?? {});
    }

    if (method === "PUT" || method === "PATCH") {
      const auth = assertAdmin(event.headers);
      if (!auth.ok) return json(401, { error: auth.error });
      const body = parseJSON(event.body) || {};
      const existing = await client.query(`SELECT * FROM site_settings LIMIT 1`);
      if (!existing.rows[0]) {
        const fields = [
          body.site_title ?? null,
          body.hero_title ?? null,
          body.hero_subtitle ?? null,
          body.about_me ?? null,
          body.github_url ?? null,
          body.linkedin_url ?? null,
          body.twitter_url ?? null,
          body.owner_name ?? null,
          body.contact_email ?? null,
          body.contact_phone ?? null,
          body.theme_color ?? null,
        ];
        const { rows } = await client.query(
          `INSERT INTO site_settings (
            site_title, hero_title, hero_subtitle, about_me, github_url, linkedin_url, twitter_url,
            owner_name, contact_email, contact_phone, theme_color
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
          ) RETURNING *`,
          fields
        );
        return json(200, rows[0]);
      } else {
        const s = existing.rows[0];
        const { rows } = await client.query(
          `UPDATE site_settings SET
            site_title = COALESCE($1, site_title),
            hero_title = COALESCE($2, hero_title),
            hero_subtitle = COALESCE($3, hero_subtitle),
            about_me = COALESCE($4, about_me),
            github_url = COALESCE($5, github_url),
            linkedin_url = COALESCE($6, linkedin_url),
            twitter_url = COALESCE($7, twitter_url),
            owner_name = COALESCE($8, owner_name),
            contact_email = COALESCE($9, contact_email),
            contact_phone = COALESCE($10, contact_phone),
            theme_color = COALESCE($11, theme_color),
            updated_at = NOW()
          WHERE id = $12
          RETURNING *`,
          [
            body.site_title,
            body.hero_title,
            body.hero_subtitle,
            body.about_me,
            body.github_url,
            body.linkedin_url,
            body.twitter_url,
            body.owner_name,
            body.contact_email,
            body.contact_phone,
            body.theme_color,
            s.id,
          ]
        );
        return json(200, rows[0]);
      }
    }

    return json(405, { error: "Method not allowed" });
  } catch (err: any) {
    console.error("/settings error", err);
    return json(500, { error: err?.message ?? "Internal error" });
  } finally {
    client.release();
  }
};
