import { ExternalLink, Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "~backend/portfolio/list_projects";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="card group overflow-hidden">
      {project.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="group-hover:text-primary transition-colors">{project.title}</span>
          {project.featured && (
            <Badge variant="secondary" className="badge bg-primary/20 text-primary border-primary/40">
              Featured
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="leading-relaxed">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="outline" className="badge border-primary/30">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex gap-3">
          {project.demoUrl && (
            <Button variant="outline" size="sm" asChild className="flex-1 border-primary/30 hover:border-primary">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Demo
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button variant="outline" size="sm" asChild className="flex-1 border-primary/30 hover:border-primary">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                Code
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
