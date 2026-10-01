import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useBackend } from "../../lib/useBackend";

export function SettingsAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const api = useBackend();

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => api.portfolio.getSiteSettings(),
  });

  const [formData, setFormData] = useState<Record<string, string>>(settingsData?.settings || {});

  // Update form data when settings load
  useEffect(() => {
    if (settingsData?.settings) {
      setFormData(settingsData.settings);
    }
  }, [settingsData]);

  const updateMutation = useMutation({
    mutationFn: (settings: Record<string, string>) => 
      api.portfolio.updateSiteSettings({ settings }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast({
        title: "Settings updated",
        description: "Your site settings have been successfully updated.",
      });
    },
    onError: (error) => {
      console.error("Failed to update settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <p className="text-muted-foreground">Customize your portfolio appearance and content</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic site information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="site_title">Site Title</Label>
              <Input
                id="site_title"
                name="site_title"
                value={formData.site_title || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="site_description">Site Description</Label>
              <Textarea
                id="site_description"
                name="site_description"
                value={formData.site_description || ""}
                onChange={handleChange}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="owner_name">Owner Name</Label>
              <Input
                id="owner_name"
                name="owner_name"
                value={formData.owner_name || ""}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Homepage hero content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input
                id="hero_title"
                name="hero_title"
                value={formData.hero_title || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
              <Input
                id="hero_subtitle"
                name="hero_subtitle"
                value={formData.hero_subtitle || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="about_text">About Text</Label>
              <Textarea
                id="about_text"
                name="about_text"
                value={formData.about_text || ""}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Your contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email || ""}
                onChange={handleChange}
                placeholder="tanaymitra9@gmail.com"
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                value={formData.contact_phone || ""}
                onChange={handleChange}
                placeholder="e.g., 8761985584"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                name="github_url"
                type="url"
                value={formData.github_url || ""}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                name="linkedin_url"
                type="url"
                value={formData.linkedin_url || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="twitter_url">Twitter URL</Label>
              <Input
                id="twitter_url"
                name="twitter_url"
                type="url"
                value={formData.twitter_url || ""}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Customize the appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme_color">Theme Color</Label>
              <Input
                id="theme_color"
                name="theme_color"
                type="color"
                value={formData.theme_color || "#22c55e"}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={updateMutation.isPending} className="btn-primary glow-green">
          {updateMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
