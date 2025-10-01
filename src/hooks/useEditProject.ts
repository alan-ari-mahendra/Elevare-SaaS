import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { getProjectById } from '@/services/projects';
import { Project } from "@prisma/client";

export function useEditProject() {
  const params = useParams();
  const { toast } = useToast();
  const projectId = params.id as string;
  const [project, setProject] = useState<Partial<Project> | null>(null);
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

  return {
    project,
    isLoading
  };
}