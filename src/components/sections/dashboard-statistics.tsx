"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen, ListTodo, CheckCircle2 } from "lucide-react";
import { Project, Task } from "@prisma/client";

type Props = {
  isLoading: boolean;
  projects: Project[];
  tasks: Task[];
};

export function StatisticsSection({ isLoading, tasks, projects }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:row-span-2 p-6">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </Card>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-7 w-14 mb-1" />
            <Skeleton className="h-3 w-24" />
          </Card>
        ))}
      </div>
    );
  }

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status !== "archived").length;
  const archivedProjects = totalProjects - activeProjects;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const activeTasks = tasks.filter((t) => t.status !== "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekFromNow = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dueThisWeek = tasks.filter((t) => {
    if (!t.dueDate || t.status === "done") return false;
    const due = new Date(t.dueDate);
    return due >= startOfToday && due < weekFromNow;
  }).length;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Donut SVG params
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
      {/* Highlight: Completion Rate — large donut */}
      <Card className="border-border/50 lg:row-span-2">
        <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center h-full">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-5">Overall Progress</p>
          <div className="relative">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle
                cx="70" cy="70" r={radius}
                fill="none"
                className="stroke-muted"
                strokeWidth="10"
              />
              <circle
                cx="70" cy="70" r={radius}
                fill="none"
                className="stroke-primary"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{completionRate}%</span>
              <span className="text-[11px] text-muted-foreground">complete</span>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              {completedTasks} done
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              {activeTasks} remaining
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Smaller stat: Projects */}
      <Card className="border-border/50">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Projects</p>
              <p className="text-xl font-bold">{totalProjects}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span><span className="font-medium text-primary">{activeProjects}</span> active</span>
            {archivedProjects > 0 && (
              <span>{archivedProjects} archived</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Smaller stat: Active Tasks */}
      <Card className="border-border/50">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <ListTodo className="h-5 w-5 text-amber-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Active Tasks</p>
              <p className="text-xl font-bold">{activeTasks}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span><span className="font-medium text-amber-500">{inProgressTasks}</span> in progress</span>
            <span>{dueThisWeek} due this week</span>
          </div>
        </CardContent>
      </Card>

      {/* Smaller stat: Completed */}
      <Card className="border-border/50 lg:col-span-2">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Completed Tasks</p>
              <p className="text-xl font-bold">{completedTasks}<span className="text-sm font-normal text-muted-foreground"> / {totalTasks}</span></p>
            </div>
            {/* Inline progress bar */}
            <div className="w-32 shrink-0 hidden sm:block">
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
