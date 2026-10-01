import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface Project {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  technologies: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListProjectsResponse {
  projects: Project[];
}

// Retrieves all projects, ordered by creation date (latest first).
export const listProjects = api<void, ListProjectsResponse>(
  { expose: true, method: "GET", path: "/projects" },
  async () => {
    const rows = await portfolioDB.queryAll<{
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
      SELECT id, title, description, image_url, demo_url, github_url, 
             technologies, featured, created_at, updated_at
      FROM projects 
      ORDER BY created_at DESC
    `;

    const projects = rows.map(row => ({
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
    }));

    return { projects };
  }
);
