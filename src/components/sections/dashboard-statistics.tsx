"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen, ListTodo, CheckCircle2, TrendingUp } from "lucide-react";
import { Project, Task } from "@prisma/client";

type Props = {
  isLoading: boolean;
  projects: Project[];
  tasks: Task[];
};

export function StatisticsSection({ isLoading, tasks, projects }: Props) {
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

  // Project stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status !== "archived").length;
  const archivedProjects = totalProjects - activeProjects;

  // Task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const activeTasks = tasks.filter((t) => t.status !== "done").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in_progress"
  ).length;

  // Due this week
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const weekFromNow = new Date(
    startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000
  );
  const dueThisWeek = tasks.filter((t) => {
    if (!t.dueDate || t.status === "done") return false;
    const due = new Date(t.dueDate);
    return due >= startOfToday && due < weekFromNow;
  }).length;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Projects */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-medium">{activeProjects}</span>{" "}
            active
            {archivedProjects > 0 && (
              <>
                {" "}
                · <span>{archivedProjects} archived</span>
              </>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Active Tasks */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeTasks}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-medium">{inProgressTasks}</span>{" "}
            in progress · {dueThisWeek} due this week
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Completed Tasks */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Completed Tasks
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTasks}</div>
          <p className="text-xs text-muted-foreground">
            out of {totalTasks} total task{totalTasks !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Completion Rate */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
