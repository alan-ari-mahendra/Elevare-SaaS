"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProjectForm } from "@/components/project-form";
import { getProjectById } from "@/services/projects";

export default function EditProjectPage() {
  const params = useParams();
  const { toast } = useToast();
  const projectId = params.id as string;
  const [project, setProject] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const data = await getProjectById(projectId);
        setProject({
          id: data.id,
          name: data.name,
          description: data.description,
          status: data.status,
          color: data.color,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to load project.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [projectId, toast]);
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
