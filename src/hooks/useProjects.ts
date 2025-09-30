import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  getProjects,
  deleteProject,
  duplicateProject
} from '@/services/projects';
import { getTasks } from '@/services/tasks';
import { Project, Task } from "@prisma/client";

export function useProjects() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated");
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const fetchProjectsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [proj, task] = await Promise.all([getProjects(), getTasks()]);
      setProjects(proj);
      setTasks(task);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load projects data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleDeleteProject = useCallback(async (projectId: string, projectName: string) => {
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));

      toast({
        title: "Project deleted",
        description: `"${projectName}" has been deleted successfully.`
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleDuplicateProject = useCallback(async (project: Project) => {
    try {
      const newProject = await duplicateProject(project);
      setProjects((prev) => [...prev, newProject]);

      toast({
        title: "Project duplicated",
        description: `"${newProject.name}" has been duplicated successfully.`
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "status":
          return a.status.localeCompare(b.status);
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });

  useEffect(() => {
    fetchProjectsData();
  }, [fetchProjectsData]);

  return {
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    projects,
    tasks,
    filteredProjects,
    handleDeleteProject,
    handleDuplicateProject,
    fetchProjectsData
  };
}
