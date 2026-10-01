import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string;
  published: boolean;
  featuredImageUrl: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ListBlogPostsResponse {
  posts: BlogPost[];
}

// Retrieves all blog posts, ordered by creation date (latest first).
export const listBlogPosts = api<void, ListBlogPostsResponse>(
  { expose: true, method: "GET", path: "/blog" },
  async () => {
    const rows = await portfolioDB.queryAll<{
      id: number;
      title: string;
      content: string;
      excerpt: string | null;
      slug: string;
      published: boolean;
      featured_image_url: string | null;
      tags: string[];
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, title, content, excerpt, slug, published, featured_image_url, 
             tags, created_at, updated_at
      FROM blog_posts 
      WHERE published = true
      ORDER BY created_at DESC
    `;

    const posts = rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      excerpt: row.excerpt,
      slug: row.slug,
      published: row.published,
      featuredImageUrl: row.featured_image_url,
      tags: row.tags || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { posts };
  }
);
