"use client";

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
import {
  BarChart3,
  CheckCircle,
  Clock,
  Plus,
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Activity as ActivityType, Project, Task } from "@prisma/client";
import { useSessionUser } from "@/hooks/useSessionUser";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTask] = useState<Task[]>([]);
  const [activity, setActivity] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useSessionUser();

  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;
  const inProgressProjects = projects.filter(
    (p) => p.status === "in_progress"
  ).length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in_progress"
  ).length;

  const upcomingTasks = tasks
    .filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return dueDate >= now && dueDate <= weekFromNow;
    })
    .sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    )
    .slice(0, 5);

  const recentActivity = activity
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "done":
        return "completed";
      case "in_progress":
        return "in-progress";
      case "planning":
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

  const getProjects = useCallback(async () => {
    setIsLoading(true);
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
      const responseActivity = await fetch("/api/activities", {
        method: "GET",

        credentials: "include",
      });
      if (!responseActivity.ok)
        throw new Error(`HTTP error! status: ${responseActivity.status}`);

      const activity = await responseActivity.json();
      setActivity(activity);
      setIsLoading(false);
    } catch (error) {}
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user && user.name}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-12 mb-1" />
              <Skeleton className="h-3 w-20" />
            </Card>
          ))
        ) : (
          <>
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Projects
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-secondary font-medium">+2</span> from
                  last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedProjects}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-secondary font-medium">+1</span> from
                  last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressProjects}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary font-medium">
                    {inProgressTasks}
                  </span>{" "}
                  active tasks
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Task Completion
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((completedTasks / totalTasks) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {completedTasks} of {totalTasks} tasks completed
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest project updates and milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            ) : (
              <>
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-foreground">
                        {activity.details}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(
                          new Date(activity.createdAt),
                          "MMM d, yyyy at h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center"
              >
                View all activity
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>Tasks due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))
            ) : (
              <>
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => {
                    const project = projects.find(
                      (p) => p.id === task.projectId
                    );
                    return (
                      <div
                        key={task.id}
                        className="flex items-center justify-between space-x-3"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">
                              {task.title}
                            </p>
                            <Badge
                              variant={getPriorityColor(task.priority)}
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{project?.name}</span>
                            <span>•</span>
                            <span>
                              Due {format(new Date(task.dueDate!), "MMM d")}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={getStatusColor(task.status)}
                          className="text-xs"
                        >
                          {task.status.replace("_", " ")}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">
                      No upcoming tasks
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="pt-2">
              <Link href="/projects">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center"
                >
                  View all tasks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Overview */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>
              Your current projects and their progress
            </CardDescription>
          </div>
          <Link href="/projects">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-2 w-full" />
                </Card>
              ))
            ) : (
              <>
                {projects
                  .filter((project) => project.status !== "archived")
                  .slice(0, 6)
                  .map((project) => {
                    const projectTasks = tasks.filter(
                      (task) => task.projectId === project.id
                    );
                    const completedProjectTasks = projectTasks.filter(
                      (task) => task.status === "done"
                    );
                    const progress =
                      projectTasks.length > 0
                        ? (completedProjectTasks.length / projectTasks.length) *
                          100
                        : 0;

                    return (
                      <Link key={project.id} href={`/projects/${project.id}`}>
                        <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">
                                {project.name}
                              </CardTitle>
                              <Badge
                                variant={getStatusColor(project.status)}
                                className="text-xs"
                              >
                                {project.status.replace("_", " ")}
                              </Badge>
                            </div>
                            <CardDescription className="text-sm line-clamp-2">
                              {project.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Progress
                                </span>
                                <span className="font-medium">
                                  {Math.round(progress)}%
                                </span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{projectTasks.length} tasks</span>
                                {project.endDate && (
                                  <span>
                                    Due{" "}
                                    {format(new Date(project.endDate), "MMM d")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
              </>
            )}
          </div>
          {projects.filter((p) => p.status !== "archived").length > 6 && (
            <div className="mt-6 text-center">
              <Link href="/projects">
                <Button variant="outline">
                  View All Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/projects/new">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 w-full bg-transparent"
              >
                <Plus className="h-6 w-6" />
                <span>Create Project</span>
              </Button>
            </Link>
            <Link href="/projects">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 w-full bg-transparent"
              >
                <BarChart3 className="h-6 w-6" />
                <span>View Projects</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 w-full bg-transparent"
              >
                <Users className="h-6 w-6" />
                <span>Team Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
