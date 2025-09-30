"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskModal } from "@/components/task/task-modal";
import { ArrowLeft, Calendar, Edit } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Project, Task } from "@prisma/client";
import { getStatusColor } from "@/lib/utils";
import { deleteProject, duplicateProject, getProjectById } from "@/services/projects";
import { deleteTask, getTasks, updateTask } from "@/services/tasks";
import { ProjectViewSkeleton } from "@/components/project/project-view-skeleton";
import { ProjectStats } from "@/components/sections/project-stats";
import { ProjectActionDropdown } from "@/components/project/project-action-dropdown";
import { TaskList } from "@/components/project/task-list";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const completedTasks = tasks.filter((task) => task.status === "done");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const progress =
    tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  const handleTaskStatusChange = async (taskId: string, checked: boolean) => {
    try {
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
  };

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    try {
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
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsTaskModalOpen(true);
  };

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

  const handleTaskSaved = useCallback(async () => {
    await refreshTasks();
  }, [refreshTasks]);

  const handleDeleteProject = async () => {
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
  };

  const handleDuplicateProject = async () => {
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
  };

  const getProject = useCallback(async () => {
    setIsLoading(true);
    try {
      const projectData = await getProjectById(projectId);
      setProject(projectData);
      console.log("projectData", projectData);
      const allTasks = await getTasks();
      setTasks(allTasks.filter((task: Task) => task.projectId === projectId));
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

  if (!project && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Project not found
        </h1>
        <p className="text-muted-foreground mb-6">
          The project you're looking for doesn't exist.
        </p>
        <Link href="/projects">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }
  if (isLoading) {
    return (
      <ProjectViewSkeleton />
    );
  }

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
        <span className="text-foreground">{project!.name}</span>
      </div>

      {/* Project Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              {project!.name}
            </h1>
            <Badge variant={getStatusColor(project!.status)}>
              {project!.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {project!.description}
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>
              Created {format(new Date(project!.createdAt), "MMM d, yyyy")}
            </span>
            <span>•</span>
            <span>
              Updated {format(new Date(project!.updatedAt), "MMM d, yyyy")}
            </span>
            {project!.startDate && (
              <>
                <span>•</span>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Start Date{" "}
                  {format(new Date(project!.startDate), "MMM d, yyyy")}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/projects/${project!.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <ProjectActionDropdown
            project={project!}
            onProjectDuplicate={handleDuplicateProject}
            onProjectDelete={handleDeleteProject}
          />
        </div>
      </div>

      {/* Project Stats */}
      <ProjectStats
        tasks={tasks}
        completedTasks={completedTasks}
        inProgressTasks={inProgressTasks}
        progress={progress}
      />

      {/* Project Content */}
      <TaskList
        tasks={tasks}
        onStatusChange={handleTaskStatusChange}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onCreateTask={handleCreateTask}
      />

      <TaskModal
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        task={editingTask}
        projectId={projectId}
        saveOnSuccess={handleTaskSaved}
      />
    </div>
  );
}
