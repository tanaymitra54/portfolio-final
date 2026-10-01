import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsAdmin } from "../components/admin/ProjectsAdmin";
import { SkillsAdmin } from "../components/admin/SkillsAdmin";
import { BlogAdmin } from "../components/admin/BlogAdmin";
import { SettingsAdmin } from "../components/admin/SettingsAdmin";
import { ContactAdmin } from "../components/admin/ContactAdmin";

export function AdminPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Manage your portfolio content and settings.
        </p>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <ProjectsAdmin />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsAdmin />
        </TabsContent>

        <TabsContent value="blog">
          <BlogAdmin />
        </TabsContent>

        <TabsContent value="contact">
          <ContactAdmin />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
}
