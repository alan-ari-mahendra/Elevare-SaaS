"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "@/components/project/project-form";
import { useEditProject } from "@/hooks/useEditProject";

export default function EditProjectPage() {
  const { project, isLoading } = useEditProject();

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link
          href="/dashboard"
          className="hover:text-foreground transition-colors"
        >
          Dashboard
        </Link>
        <span>/</span>
        <Link
          href="/projects"
          className="hover:text-foreground transition-colors"
        >
          Projects
        </Link>
        <span>/</span>
        <span className="text-foreground">Edit Project</span>
      </div>

      {/* Header */}
      <div className="flex items-center space-x-3">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Project</h1>
          <p className="text-muted-foreground">
            Update the details of your project
          </p>
        </div>
      </div>

      {/* Form */}
      <ProjectForm mode="edit" initialData={project} isLoading={isLoading} />
    </div>
  );
}