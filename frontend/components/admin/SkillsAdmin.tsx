import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useBackend } from "../../lib/useBackend";

export function SkillsAdmin() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    proficiency: 1,
    iconName: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const api = useBackend();

  const { data: skillsData, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: () => api.portfolio.listSkills(),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => api.portfolio.createSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast({
        title: "Skill added",
        description: "The skill has been successfully added.",
      });
      setFormData({ name: "", category: "", proficiency: 1, iconName: "" });
    },
    onError: (error) => {
      console.error("Failed to create skill:", error);
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      });
    },
  });

  const skills = skillsData?.skills || [];
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "proficiency" ? parseInt(value) : value,
    }));
  };

  if (isLoading) {
    return <div>Loading skills...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Skills</h2>
        <p className="text-muted-foreground">Manage your technical skills</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Skill</CardTitle>
          <CardDescription>Add a new skill to your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Skill Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Frontend, Backend, Database"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proficiency">Proficiency (1-5)</Label>
                <Select
                  value={formData.proficiency.toString()}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, proficiency: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Beginner</SelectItem>
                    <SelectItem value="2">2 - Novice</SelectItem>
                    <SelectItem value="3">3 - Intermediate</SelectItem>
                    <SelectItem value="4">4 - Advanced</SelectItem>
                    <SelectItem value="5">5 - Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="iconName">Icon Name (optional)</Label>
                <Input
                  id="iconName"
                  name="iconName"
                  value={formData.iconName}
                  onChange={handleChange}
                  placeholder="Lucide icon name"
                />
              </div>
            </div>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Adding..." : "Add Skill"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {Object.keys(skillsByCategory).length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No skills found. Add your first skill!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({skill.proficiency}/5)
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
