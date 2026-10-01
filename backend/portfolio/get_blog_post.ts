import { api, APIError } from "encore.dev/api";
import { portfolioDB } from "./db";
import type { BlogPost } from "./list_blog_posts";

export interface GetBlogPostRequest {
  slug: string;
}

// Retrieves a blog post by its slug.
export const getBlogPost = api<GetBlogPostRequest, BlogPost>(
  { expose: true, method: "GET", path: "/blog/:slug" },
  async (req) => {
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
      SELECT id, title, content, excerpt, slug, published, featured_image_url, 
             tags, created_at, updated_at
      FROM blog_posts 
      WHERE slug = ${req.slug} AND published = true
    `;

    if (!row) {
      throw APIError.notFound("blog post not found");
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
