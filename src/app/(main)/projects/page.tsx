"use client";

import { useCallback, useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Project, Task } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated");
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTask] = useState<Task[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "completed";
      case "in_progress":
        return "in-progress";
      case "planning":
        return "planning";
      default:
        return "archived";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "planning":
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const handleDeleteProject = async (
    projectId: string,
    projectName: string
  ) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      setProjects((prev) => prev.filter((p) => p.id !== projectId));

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

  const handleDuplicateProject = async (project: Project) => {
    try {
      const baseName = project.name.replace(/\(\d+\)$/, "").trim();

      const duplicates = projects.filter((p) => p.name.startsWith(baseName));

      let maxSuffix = 0;
      duplicates.forEach((p) => {
        const match = p.name.match(/\((\d+)\)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxSuffix) maxSuffix = num;
        }
      });

      const projectName =
        maxSuffix === 0 ? `${baseName} (1)` : `${baseName} (${maxSuffix + 1})`;

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: projectName,
          description: project.description,
          status: project.status,
          color: project.color,
          startDate: project.startDate,
          endDate: project.endDate,
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      toast({
        title: "Project duplicated",
        description: `"${projectName}" has been duplicated successfully.`,
      });
      const projectRes = await response.json();
      setProjects((prev) => [...prev, projectRes]);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter and sort projects
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
        default: // updated
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });

  const getProjects = useCallback(async () => {
    try {
      const responseProjects = await fetch("/api/projects", {
        method: "GET",
        credentials: "include",
      });
      if (!responseProjects.ok)
        throw new Error(`HTTP error! status: ${responseProjects.status}`);

      const projects = await responseProjects.json();
      setProjects(projects);
      const responseTasks = await fetch("/api/tasks", {
        method: "GET",
        credentials: "include",
      });
      if (!responseTasks.ok)
        throw new Error(`HTTP error! status: ${responseTasks.status}`);

      const task = await responseTasks.json();
      setTask(task);
    } catch (error) {}
  }, []);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all your projects in one place
          </p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const projectTasks = tasks.filter(
              (task) => task.projectId === project.id
            );
            const completedTasks = projectTasks.filter(
              (task) => task.status === "done"
            );
            const progress =
              projectTasks.length > 0
                ? (completedTasks.length / projectTasks.length) * 100
                : 0;

            return (
              <Card
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="border-border/50 hover:border-primary/50 transition-colors group cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(project.status)}
                        <CardTitle className="text-lg line-clamp-1">
                          <Link
                            href={`/projects/${project.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {project.name}
                          </Link>
                        </CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={getStatusColor(project.status)}
                          className="text-xs"
                        >
                          {project.status.replace("_", " ")}
                        </Badge>
                        <div className="flex flex-row items-center justify-between w-full">
                          {project.startDate && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" />
                              Start{" "}
                              {format(new Date(project.startDate), "MMM d")}
                            </div>
                          )}
                          {project.endDate && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" />
                              End {format(new Date(project.endDate), "MMM d")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Project
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicateProject(project)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteProject(project.id, project.name)
                          }
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="text-sm line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span>{projectTasks.length} tasks</span>
                        <span>{completedTasks.length} completed</span>
                      </div>
                      <span>
                        Updated {format(new Date(project.updatedAt), "MMM d")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first project."}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Link href="/projects/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
