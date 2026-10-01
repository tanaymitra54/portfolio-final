import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  iconName: string | null;
  createdAt: Date;
}

export interface ListSkillsResponse {
  skills: Skill[];
}

// Retrieves all skills, grouped by category.
export const listSkills = api<void, ListSkillsResponse>(
  { expose: true, method: "GET", path: "/skills" },
  async () => {
    const rows = await portfolioDB.queryAll<{
      id: number;
      name: string;
      category: string;
      proficiency: number;
      icon_name: string | null;
      created_at: Date;
    }>`
      SELECT id, name, category, proficiency, icon_name, created_at
      FROM skills 
      ORDER BY category, proficiency DESC, name
    `;

    const skills = rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      proficiency: row.proficiency,
      iconName: row.icon_name,
      createdAt: row.created_at,
    }));

    return { skills };
  }
);
