import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import backend from "~backend/client";

export function SkillsSection() {
  const { data: skillsData } = useQuery({
    queryKey: ["skills"],
    queryFn: () => backend.portfolio.listSkills(),
  });

  const skills = skillsData?.skills || [];
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  if (skills.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-primary">Skills & Technologies</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I work with to bring ideas to life
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <Card key={category} className="card">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {categorySkills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-foreground">{skill.name}</span>
                      <span className="text-sm text-muted-foreground font-semibold">
                        {skill.proficiency}/5
                      </span>
                    </div>
                    <Progress 
                      value={(skill.proficiency / 5) * 100} 
                      className="h-3 bg-muted"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
