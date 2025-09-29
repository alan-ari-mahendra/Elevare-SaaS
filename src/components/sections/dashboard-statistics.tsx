"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Project, Task } from "@prisma/client";

type Props = {
  isLoading: boolean;
  projects: Project[];
  tasks: Task[];
};

export function StatisticsSection({
                                    isLoading,
                                    tasks,
                                    projects
                                  }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-12 mb-1" />
            <Skeleton className="h-3 w-20" />
          </Card>
        ))}
      </div>
    );
  }
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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                        <span className="text-primary font-medium">{inProgressTasks}
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
    </div>
  );
}