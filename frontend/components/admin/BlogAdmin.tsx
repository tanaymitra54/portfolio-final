import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogForm } from "./BlogForm";
import type { BlogPost } from "~backend/portfolio/list_blog_posts";
import { useBackend } from "../../lib/useBackend";

export function BlogAdmin() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const api = useBackend();

  const { data: blogData, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: () => api.portfolio.listBlogPosts(),
  });

  const posts = blogData?.posts || [];

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  if (isLoading) {
    return <div>Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Blog Posts</h2>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No blog posts found. Create your first post!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {post.title}
                      {post.published ? (
                        <Badge variant="default">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Created: {new Date(post.createdAt).toLocaleDateString()}
                      {post.updatedAt !== post.createdAt && (
                        <span> • Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    {post.published && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {post.excerpt || post.content.substring(0, 200) + "..."}
                </p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && (
        <BlogForm
          post={editingPost}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
