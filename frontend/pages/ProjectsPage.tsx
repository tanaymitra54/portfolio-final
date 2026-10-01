import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "../components/ProjectCard";
import backend from "~backend/client";

export function ProjectsPage() {
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => backend.portfolio.listProjects(),
  });

  const projects = projectsData?.projects || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="animate-pulse">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 text-primary">My Projects</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          A curated collection of projects I've worked on, showcasing different technologies, 
          creative approaches, and problem-solving methodologies.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
