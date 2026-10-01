import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface SiteSettings {
  [key: string]: string;
}

export interface GetSiteSettingsResponse {
  settings: SiteSettings;
}

// Retrieves all site settings.
export const getSiteSettings = api<void, GetSiteSettingsResponse>(
  { expose: true, method: "GET", path: "/settings" },
  async () => {
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
