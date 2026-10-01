import { api } from "encore.dev/api";
import { portfolioDB } from "./db";
import type { Project } from "./list_projects";
import { assertAdmin } from "./authz";

export interface CreateProjectRequest {
  title: string;
  description?: string;
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured?: boolean;
}

// Creates a new project.
export const createProject = api<CreateProjectRequest, Project>(
  { expose: true, auth: true, method: "POST", path: "/projects" },
  async (req) => {
    assertAdmin();

    const row = await portfolioDB.queryRow<{
      id: number;
      title: string;
      description: string | null;
      image_url: string | null;
      demo_url: string | null;
      github_url: string | null;
      technologies: string[];
      featured: boolean;
      created_at: Date;
      updated_at: Date;
    }>`
      INSERT INTO projects (title, description, image_url, demo_url, github_url, technologies, featured)
      VALUES (${req.title}, ${req.description || null}, ${req.imageUrl || null}, 
              ${req.demoUrl || null}, ${req.githubUrl || null}, ${req.technologies}, ${req.featured || false})
      RETURNING id, title, description, image_url, demo_url, github_url, 
                technologies, featured, created_at, updated_at
    `;

    if (!row) {
      throw new Error("Failed to create project");
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      imageUrl: row.image_url,
      demoUrl: row.demo_url,
      githubUrl: row.github_url,
      technologies: row.technologies || [],
      featured: row.featured,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);
