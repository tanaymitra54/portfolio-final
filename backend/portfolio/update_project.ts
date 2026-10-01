import { api, APIError } from "encore.dev/api";
import { portfolioDB } from "./db";
import type { Project } from "./list_projects";
import { assertAdmin } from "./authz";

export interface UpdateProjectRequest {
  id: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  technologies?: string[];
  featured?: boolean;
}

// Updates an existing project.
export const updateProject = api<UpdateProjectRequest, Project>(
  { expose: true, auth: true, method: "PUT", path: "/projects/:id" },
  async (req) => {
    assertAdmin();

    const existing = await portfolioDB.queryRow`
      SELECT id FROM projects WHERE id = ${req.id}
    `;

    if (!existing) {
      throw APIError.notFound("project not found");
    }

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
      UPDATE projects 
      SET title = COALESCE(${req.title}, title),
          description = COALESCE(${req.description}, description),
          image_url = COALESCE(${req.imageUrl}, image_url),
          demo_url = COALESCE(${req.demoUrl}, demo_url),
          github_url = COALESCE(${req.githubUrl}, github_url),
          technologies = COALESCE(${req.technologies}, technologies),
          featured = COALESCE(${req.featured}, featured),
          updated_at = NOW()
      WHERE id = ${req.id}
      RETURNING id, title, description, image_url, demo_url, github_url, 
                technologies, featured, created_at, updated_at
    `;

    if (!row) {
      throw APIError.notFound("project not found");
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
