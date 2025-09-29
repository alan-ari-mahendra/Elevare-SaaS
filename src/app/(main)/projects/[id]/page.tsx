"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskModal } from "@/components/task-modal";
import { ArrowLeft, Calendar, CheckCircle2, Edit, ExternalLink, Plus } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Project, Task } from "@prisma/client";
import { getPriorityColor, getStatusColor } from "@/lib/utils";
import { deleteProject, duplicateProject, getProjectById } from "@/services/projects";
import { deleteTask, getTasks, postTask, updateTask } from "@/services/tasks";
import { ProjectViewSkeleton } from "@/components/project-view-skeleton";
import { ProjectStats } from "@/components/sections/project-stats";
import { TaskInput } from "@/types/task";
import { TaskActionDropdown } from "@/components/task-action-dropdown";
import { ProjectActionDropdown } from "@/components/project-action-dropdown";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskFilter, setTaskFilter] = useState("all");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const completedTasks = tasks.filter((task) => task.status === "done");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const progress =
    tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  const handleTaskStatusChange = async (taskId: string, checked: boolean) => {
    try {
      await updateTask(taskId, { status: checked ? "done" : "todo" });
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

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      let savedTask: Task;

      if (editingTask) {
        const updateData: Partial<TaskInput> = {
          title: taskData.title,
          description: taskData.description || undefined,
          status: (taskData.status as "todo" | "in_progress" | "done") ?? "todo",
          priority: (taskData.priority as "low" | "medium" | "high") ?? "medium",
          projectId: projectId,
          dueDate: taskData.dueDate || undefined
        };

        savedTask = await updateTask(editingTask.id, updateData);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingTask.id ? savedTask : task
          )
        );
      } else {
        const newTaskData: TaskInput = {
          title: taskData.title || "",
          description: taskData.description || undefined,
          status: taskData.status as "todo" | "in_progress" | "done" || "todo",
          priority: taskData.priority as "low" | "medium" | "high" || "medium",
          projectId: projectId,
          dueDate: taskData.dueDate || undefined
        };

        savedTask = await postTask(newTaskData);
        setTasks((prevTasks) => [...prevTasks, savedTask]);
      }

      setIsTaskModalOpen(false);
      toast({
        title: editingTask ? "Task updated" : "Task created",
        description: `"${savedTask.title}" has been ${editingTask ? "updated" : "created"} successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingTask ? "update" : "create"} task.`,
        variant: "destructive"
      });
    }
  };

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

  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === "all") return true;
    return task.status === taskFilter;
  });

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
      <ProjectStats tasks={tasks} completedTasks={completedTasks} inProgressTasks={inProgressTasks}
                    progress={progress} />

      {/* Project Content */}
      <Card className="border-border/50 bg-pink-400">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Manage and track project tasks</CardDescription>
          </div>
          <Button onClick={handleCreateTask}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs
            value={taskFilter}
            onValueChange={setTaskFilter}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
              <TabsTrigger value="todo">To Do ({todoTasks.length})</TabsTrigger>
              <TabsTrigger value="in_progress">
                In Progress ({inProgressTasks.length})
              </TabsTrigger>
              <TabsTrigger value="done">
                Done ({completedTasks.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value={taskFilter} className="mt-6">
              {filteredTasks.length > 0 ? (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center space-x-4 p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <Checkbox
                        checked={task.status === "done"}
                        onCheckedChange={(checked) =>
                          handleTaskStatusChange(task.id, checked as boolean)
                        }
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/tasks/${task.id}`}
                            className="hover:underline"
                          >
                            <h4
                              className={`font-medium ${
                                task.status === "done"
                                  ? "line-through text-muted-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              {task.title}
                            </h4>
                          </Link>
                          <Badge
                            variant={getPriorityColor(task.priority)}
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>
                          <Badge
                            variant={getStatusColor(task.status)}
                            className="text-xs"
                          >
                            {task.status.replace("_", " ")}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>
                            Created {format(new Date(task.createdAt), "MMM d")}
                          </span>
                          {task.dueDate && (
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              Due {format(new Date(task.dueDate), "MMM d")}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/tasks/${task.id}`}>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <TaskActionDropdown
                          task={task}
                          onTaskEdit={handleEditTask}
                          onTaskDelete={handleDeleteTask}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No tasks found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {taskFilter === "all"
                      ? "Get started by adding your first task."
                      : `No tasks with status "${taskFilter.replace(
                        "_",
                        " "
                      )}" found.`}
                  </p>
                  <Button onClick={handleCreateTask}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <TaskModal
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        task={editingTask}
        projectId={projectId}
        onSave={handleSaveTask}
      />
    </div>
  );
}
