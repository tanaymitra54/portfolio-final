import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Download, Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "../components/ProjectCard";
import { SkillsSection } from "../components/SkillsSection";
import backend from "~backend/client";

export function HomePage() {
  const { data: settingsData } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => backend.portfolio.getSiteSettings(),
  });

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => backend.portfolio.listProjects(),
  });

  const { data: blogData } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: () => backend.portfolio.listBlogPosts(),
  });

  const settings = settingsData?.settings || {};
  const featuredProjects = projectsData?.projects.filter(p => p.featured).slice(0, 3) || [];
  const recentPosts = blogData?.posts.slice(0, 3) || [];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="algerian-like text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-8">
              {settings.hero_title || "Hi, I'm Tanay Mitra"}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              {settings.hero_subtitle || "Full Stack Developer"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/projects">
                <Button size="lg" className="w-full sm:w-auto btn-primary font-semibold px-8 py-3 glow-green">
                  View My Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="https://github.com/tanaymitra98" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold px-8 py-3 border-2 border-primary/30 hover:border-primary">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </Button>
              </a>
              <a href="https://www.linkedin.com/in/tanay-mitra-b23091174/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold px-8 py-3 border-2 border-primary/30 hover:border-primary">
                  <Linkedin className="mr-2 h-5 w-5" />
                  LinkedIn
                </Button>
              </a>
              <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold px-8 py-3 border-2 border-primary/30 hover:border-primary">
                <Download className="mr-2 h-5 w-5" />
                Download Resume
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-primary">About Me</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {settings.about_text || "I am a passionate developer with expertise in modern web technologies."}
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <SkillsSection />

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-primary">Featured Projects</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Some of my best work showcasing different technologies and creative solutions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <div className="text-center">
              <Link to="/projects">
                <Button variant="outline" size="lg" className="font-semibold px-8 py-3 border-2 border-primary/30 hover:border-primary">
                  View All Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-primary">Latest Blog Posts</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Thoughts and insights on web development, technology, and creative problem-solving
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {recentPosts.map((post) => (
                <Card key={post.id} className="card group cursor-pointer">
                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="font-medium">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                      {post.excerpt || post.content.substring(0, 150) + "..."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="badge">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Link to="/blog">
                <Button variant="outline" size="lg" className="font-semibold px-8 py-3 border-2 border-primary/30 hover:border-primary">
                  View All Posts
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
