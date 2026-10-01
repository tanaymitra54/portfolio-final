import { api } from "encore.dev/api";
import { portfolioDB } from "./db";
import type { SiteSettings, GetSiteSettingsResponse } from "./get_site_settings";
import { assertAdmin } from "./authz";

export interface UpdateSiteSettingsRequest {
  settings: SiteSettings;
}

// Updates site settings.
export const updateSiteSettings = api<UpdateSiteSettingsRequest, GetSiteSettingsResponse>(
  { expose: true, auth: true, method: "PUT", path: "/settings" },
  async (req) => {
    assertAdmin();

    await portfolioDB.begin(async (tx) => {
      for (const [key, value] of Object.entries(req.settings)) {
        await tx.exec`
          INSERT INTO site_settings (key, value, updated_at)
          VALUES (${key}, ${value}, NOW())
          ON CONFLICT (key) 
          DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
        `;
      }
    });

    const rows = await portfolioDB.queryAll<{
      key: string;
      value: string;
    }>`
      SELECT key, value FROM site_settings
    `;

    const settings: SiteSettings = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    return { settings };
  }
);
