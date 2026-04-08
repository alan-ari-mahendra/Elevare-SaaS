"use client";

import Link from "next/link";
import { Task } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  tasks: Task[];
  isLoading: boolean;
}

export function DashboardDeadlineReminder({ tasks, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      </Card>
    );
  }

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

  const activeTasks = tasks.filter((t) => t.status !== "done" && t.dueDate);

  const overdueTasks = activeTasks.filter(
    (t) => new Date(t.dueDate!) < startOfToday
  );
  const dueTodayTasks = activeTasks.filter((t) => {
    const d = new Date(t.dueDate!);
    return d >= startOfToday && d < endOfToday;
  });

  // All clear state
  if (overdueTasks.length === 0 && dueTodayTasks.length === 0) {
    return (
      <Card className="border-emerald-200/60 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20 p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
              You&apos;re all caught up!
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              No tasks due today or overdue. Great work.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const hasOverdue = overdueTasks.length > 0;
  const previewTasks = [...dueTodayTasks, ...overdueTasks].slice(0, 3);
  const moreCount =
    dueTodayTasks.length + overdueTasks.length - previewTasks.length;

  return (
    <Card
      className={cn(
        "p-4 border",
        hasOverdue
          ? "border-red-200/60 bg-red-50/50 dark:border-red-900/60 dark:bg-red-950/20"
          : "border-amber-200/60 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0",
            hasOverdue
              ? "bg-red-100 dark:bg-red-900/50"
              : "bg-amber-100 dark:bg-amber-900/50"
          )}
        >
          <AlertTriangle
            className={cn(
              "h-5 w-5",
              hasOverdue
                ? "text-red-600 dark:text-red-400"
                : "text-amber-600 dark:text-amber-400"
            )}
          />
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className={cn(
                "text-sm font-semibold",
                hasOverdue
                  ? "text-red-900 dark:text-red-100"
                  : "text-amber-900 dark:text-amber-100"
              )}
            >
              {dueTodayTasks.length > 0 && (
                <>
                  {dueTodayTasks.length} task
                  {dueTodayTasks.length > 1 ? "s" : ""} due today
                </>
              )}
              {dueTodayTasks.length > 0 && overdueTasks.length > 0 && (
                <span className="text-muted-foreground font-normal">
                  {" "}
                  ·{" "}
                </span>
              )}
              {overdueTasks.length > 0 && (
                <span className="text-red-700 dark:text-red-300">
                  {overdueTasks.length} overdue
                </span>
              )}
            </p>
          </div>

          {/* Task preview list */}
          <ul
            className={cn(
              "space-y-0.5 text-xs",
              hasOverdue
                ? "text-red-800/80 dark:text-red-200/80"
                : "text-amber-800/80 dark:text-amber-200/80"
            )}
          >
            {previewTasks.map((task) => {
              const isOverdue = new Date(task.dueDate!) < startOfToday;
              return (
                <li key={task.id}>
                  <Link
                    href={`/tasks/${task.id}`}
                    className="hover:underline inline-flex items-center gap-1.5"
                  >
                    <span className="opacity-60">•</span>
                    <span className="truncate">{task.title}</span>
                    {isOverdue && (
                      <span className="text-[10px] font-medium uppercase tracking-wide text-red-600 dark:text-red-400">
                        overdue
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
            {moreCount > 0 && (
              <li className="opacity-70">
                and {moreCount} more...
              </li>
            )}
          </ul>

          <Link
            href="/tasks?filter=due-today"
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium hover:underline pt-1",
              hasOverdue
                ? "text-red-700 dark:text-red-400"
                : "text-amber-700 dark:text-amber-400"
            )}
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
