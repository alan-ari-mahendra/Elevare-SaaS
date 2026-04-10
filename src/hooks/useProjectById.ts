import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getProjectById } from '@/services/projects';
import { Project } from "@prisma/client";

export function useProjectById(projectId?: string) {
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getProject = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const projectData = await getProjectById(projectId);
      setProject(projectData);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load project data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, toast]);

  useEffect(() => {
    getProject();
  }, [getProject]);

  return {
    project,
    isLoading,
    getProject
  };
}