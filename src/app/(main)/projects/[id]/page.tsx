"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskModal } from "@/components/task-modal";
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Project, Task } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskFilter, setTaskFilter] = useState("all");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const completedTasks = tasks.filter((task) => task.status === "done");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const progress =
    tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "done":
        return "completed";
      case "in_progress":
        return "in-progress";
      case "planning":
      case "todo":
        return "planning";
      default:
        return "archived";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "high";
      case "medium":
        return "medium";
      default:
        return "low";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4" />;
      case "medium":
        return <Clock className="h-4 w-4" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const handleTaskStatusChange = (taskId: string, checked: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: checked ? "done" : "todo",
              updated_at: new Date().toISOString(),
            }
          : task
      )
    );
    toast({
      title: checked ? "Task completed" : "Task reopened",
      description: "Task status updated successfully.",
    });
  };

  const handleDeleteTask = (taskId: string, taskTitle: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: `"${taskTitle}" has been deleted successfully.`,
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      // Update existing task
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...taskData } : task
        )
      );
    } else {
      // Create new task
      const newTask = taskData as Task;
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
  };

  const handleDeleteProject = async () => {
    try {
      const projectName = project ? project.name : projectId;
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      router.push(`/projects`);

      toast({
        title: "Project deleted",
        description: `"${projectName}" has been deleted successfully.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateProject = async () => {
    try {
      const baseName = project!.name.replace(/\(\d+\)$/, "").trim();
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: baseName,
          description: project!.description,
          status: project!.status,
          color: project!.color,
          startDate: project!.startDate,
          endDate: project!.endDate,
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      toast({
        title: "Project duplicated",
        description: `"${baseName}" has been duplicated successfully.`,
      });
      const projectRes = await response.json();
      router.push(`/projects`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
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
      const responseProject = await fetch(`/api/projects/${projectId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!responseProject.ok)
        throw new Error(`HTTP error! status: ${responseProject.status}`);

      const project = await responseProject.json();

      setProject(project);
      const responseTask = await fetch(`/api/tasks`, {
        method: "GET",
        credentials: "include",
      });
      if (!responseTask.ok)
        throw new Error(`HTTP error! status: ${responseTask.status}`);

      const tasks = await responseTask.json();

      setTasks(tasks.filter((task: Task) => task.projectId === projectId));
      setIsLoading(false);
    } catch (error) {}
    setIsLoading(false);
  }, []);

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
      <div className="space-y-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Project Header skeleton */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-96" />
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-9 rounded" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tasks skeleton */}
        <Card className="border-border/50">
          <CardHeader className="flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-40 mt-2" />
            </div>
            <Skeleton className="h-9 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 border border-border/50 rounded-lg"
                >
                  <Skeleton className="h-4 w-4 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <Skeleton className="h-6 w-6 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleDuplicateProject}>
                <Plus className="mr-2 h-4 w-4" />
                Duplicate Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteProject}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(progress)}%</div>
            <Progress value={progress} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditTask(task)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteTask(task.id, task.title)
                              }
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
