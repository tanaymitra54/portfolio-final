import { api } from "encore.dev/api";
import { portfolioDB } from "./db";
import type { Skill } from "./list_skills";
import { assertAdmin } from "./authz";

export interface CreateSkillRequest {
  name: string;
  category: string;
  proficiency: number;
  iconName?: string;
}

// Creates a new skill.
export const createSkill = api<CreateSkillRequest, Skill>(
  { expose: true, auth: true, method: "POST", path: "/skills" },
  async (req) => {
    assertAdmin();

    const row = await portfolioDB.queryRow<{
      id: number;
      name: string;
      category: string;
      proficiency: number;
      icon_name: string | null;
      created_at: Date;
    }>`
      INSERT INTO skills (name, category, proficiency, icon_name)
      VALUES (${req.name}, ${req.category}, ${req.proficiency}, ${req.iconName || null})
      RETURNING id, name, category, proficiency, icon_name, created_at
    `;

    if (!row) {
      throw new Error("Failed to create skill");
    }

    return {
      id: row.id,
      name: row.name,
      category: row.category,
      proficiency: row.proficiency,
      iconName: row.icon_name,
      createdAt: row.created_at,
    };
  }
);
