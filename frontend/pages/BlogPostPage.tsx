import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import backend from "~backend/client";

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => backend.portfolio.getBlogPost({ slug: slug! }),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="animate-pulse">Loading blog post...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6 text-primary">Post Not Found</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            The blog post you're looking for doesn't exist.
          </p>
          <Link to="/blog">
            <Button className="btn-primary glow-green">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-4xl mx-auto">
        <Link to="/blog">
          <Button variant="ghost" className="mb-8 hover:bg-primary/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <article>
          {post.featuredImageUrl && (
            <div className="aspect-video overflow-hidden rounded-xl mb-12 shadow-lg">
              <img
                src={post.featuredImageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <header className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-primary leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">{readingTime} min read</span>
              </div>
            </div>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="badge text-sm px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-lg prose-primary max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-6 leading-relaxed text-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
