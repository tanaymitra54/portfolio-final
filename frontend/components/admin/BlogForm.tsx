import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import type { BlogPost } from "~backend/portfolio/list_blog_posts";
import { useBackend } from "../../lib/useBackend";

interface BlogFormProps {
  post?: BlogPost | null;
  onClose: () => void;
}

export function BlogForm({ post, onClose }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    slug: post?.slug || "",
    published: post?.published || false,
    featuredImageUrl: post?.featuredImageUrl || "",
    tags: post?.tags.join(", ") || "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const api = useBackend();

  const createMutation = useMutation({
    mutationFn: (data: any) => api.portfolio.createBlogPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast({
        title: "Blog post created",
        description: "The blog post has been successfully created.",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Failed to create blog post:", error);
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
    };

    createMutation.mutate(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData(prev => ({ ...prev, slug }));
  };

  const isLoading = createMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {post ? "Edit Blog Post" : "Create Blog Post"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Generate
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                placeholder="Brief description of the post"
              />
            </div>
            
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={12}
                required
              />
            </div>

            <div>
              <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
              <Input
                id="featuredImageUrl"
                name="featuredImageUrl"
                type="url"
                value={formData.featuredImageUrl}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="react, typescript, tutorial"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, published: !!checked }))
                }
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : post ? "Update" : "Create"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
