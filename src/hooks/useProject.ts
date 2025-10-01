import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import {
  getProjectById,
  deleteProject,
  duplicateProject
} from '@/services/projects';
import { deleteTask, getTasks, updateTask } from "@/services/tasks";
import { Project, Task, User } from "@prisma/client";
import { fetchUsers } from "@/services/users";

export function useProject() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const completedTasks = tasks.filter((task) => task.status === "done");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const progress =
    tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  const getProject = useCallback(async (projectId: string) => {
    setIsLoading(true);
    try {
      const projectData = await getProjectById(projectId);
      setProject(projectData);
      console.log("Project data:", projectData);
      const [allTasks, allUsers] = await Promise.all([
        getTasks(),
        fetchUsers().catch(error => {
          console.error("Error fetching users:", error);
          return [];
        })
      ]);

      setTasks(allTasks.filter((task: Task) => task.projectId === projectId));
      setUsers(allUsers);
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

  const refreshTasks = useCallback(async () => {
    try {
      const allTasks = await getTasks();
      setTasks(allTasks.filter((task: Task) => task.projectId === projectId));
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to refresh tasks.",
        variant: "destructive"
      });
    }
  }, [projectId, toast]);

  const handleTaskStatusChange = useCallback(async (taskId: string, checked: boolean) => {
    try {
      // Asumsikan ada updateTask di service tasks
      await updateTask(taskId, { status: checked ? "done" : "todo" });
      await refreshTasks();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
              ...task,
              status: checked ? "done" : "todo",
              updated_at: new Date().toISOString()
            }
            : task
        )
      );
      toast({
        title: checked ? "Task completed" : "Task reopened",
        description: "Task status updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive"
      });
    }
  }, [refreshTasks, toast]);

  const handleDeleteTask = useCallback(async (taskId: string, taskTitle: string) => {
    try {
      // Asumsikan ada deleteTask di service tasks
      await deleteTask(taskId);
      await refreshTasks();
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast({
        title: "Task deleted",
        description: `"${taskTitle}" has been deleted successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive"
      });
    }
  }, [refreshTasks, toast]);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }, []);

  const handleCreateTask = useCallback(() => {
    setEditingTask(undefined);
    setIsTaskModalOpen(true);
  }, []);

  const handleTaskSaved = useCallback(async () => {
    await refreshTasks();
  }, [refreshTasks]);

  const handleDeleteProject = useCallback(async () => {
    try {
      const projectName = project ? project.name : projectId;
      await deleteProject(projectId);
      router.push(`/projects`);
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
  }, [project, projectId, router, toast]);

  const handleDuplicateProject = useCallback(async () => {
    try {
      if (!project) return;
      await duplicateProject(project);
      toast({
        title: "Project duplicated",
        description: `"${project.name}" has been duplicated successfully.`
      });
      router.push(`/projects`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to duplicate project. Please try again.",
        variant: "destructive"
      });
    }
  }, [project, router, toast]);

  useEffect(() => {
    getProject();
  }, [getProject]);

  return {
    project,
    isLoading,
    tasks,
    users,
    isTaskModalOpen,
    setIsTaskModalOpen,
    editingTask,
    completedTasks,
    inProgressTasks,
    progress,
    getProject,
    handleTaskStatusChange,
    handleDeleteTask,
    handleEditTask,
    handleCreateTask,
    handleTaskSaved,
    handleDeleteProject,
    handleDuplicateProject,
    refreshTasks
  };
}