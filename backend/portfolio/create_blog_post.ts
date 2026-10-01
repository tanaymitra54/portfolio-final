import { api } from "encore.dev/api";
import { portfolioDB } from "./db";
import type { BlogPost } from "./list_blog_posts";
import { assertAdmin } from "./authz";

export interface CreateBlogPostRequest {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  published?: boolean;
  featuredImageUrl?: string;
  tags?: string[];
}

// Creates a new blog post.
export const createBlogPost = api<CreateBlogPostRequest, BlogPost>(
  { expose: true, auth: true, method: "POST", path: "/blog" },
  async (req) => {
    assertAdmin();

    const row = await portfolioDB.queryRow<{
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
      INSERT INTO blog_posts (title, content, excerpt, slug, published, featured_image_url, tags)
      VALUES (${req.title}, ${req.content}, ${req.excerpt || null}, ${req.slug}, 
              ${req.published || false}, ${req.featuredImageUrl || null}, ${req.tags || []})
      RETURNING id, title, content, excerpt, slug, published, featured_image_url, 
                tags, created_at, updated_at
    `;

    if (!row) {
      throw new Error("Failed to create blog post");
    }

    return {
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
    };
  }
);
