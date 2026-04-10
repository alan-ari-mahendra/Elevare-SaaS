"use client";

import Link from "next/link";
import { Task } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle2, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  tasks: Task[];
  isLoading: boolean;
}

export function DashboardDeadlineReminder({ tasks, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/50 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
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

  // All clear
  if (overdueTasks.length === 0 && dueTodayTasks.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border-l-4 border-l-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-200/40 dark:border-emerald-800/40 px-4 py-3">
        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          <span className="font-medium">All caught up!</span>
          <span className="text-emerald-600/70 dark:text-emerald-400/70"> — No tasks due today or overdue.</span>
        </p>
      </div>
    );
  }

  const hasOverdue = overdueTasks.length > 0;
  const previewTasks = [...overdueTasks, ...dueTodayTasks].slice(0, 3);
  const moreCount =
    dueTodayTasks.length + overdueTasks.length - previewTasks.length;

  const accentBorder = hasOverdue ? "border-l-red-500" : "border-l-amber-500";
  const accentBg = hasOverdue
    ? "bg-red-500/5 dark:bg-red-500/10 border-red-200/40 dark:border-red-800/40"
    : "bg-amber-500/5 dark:bg-amber-500/10 border-amber-200/40 dark:border-amber-800/40";
  const accentIcon = hasOverdue
    ? "text-red-500"
    : "text-amber-500";
  const accentTitle = hasOverdue
    ? "text-red-700 dark:text-red-300"
    : "text-amber-700 dark:text-amber-300";
  const accentText = hasOverdue
    ? "text-red-600/70 dark:text-red-400/70"
    : "text-amber-600/70 dark:text-amber-400/70";
  const accentLink = hasOverdue
    ? "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
    : "text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300";

  return (
    <div className={cn("rounded-xl border-l-4 border px-4 py-3", accentBorder, accentBg)}>
      {/* Header line */}
      <div className="flex items-center gap-2.5">
        <AlertTriangle className={cn("h-4.5 w-4.5 shrink-0", accentIcon)} />
        <p className={cn("text-sm font-medium", accentTitle)}>
          {dueTodayTasks.length > 0 && (
            <>
              {dueTodayTasks.length} task{dueTodayTasks.length > 1 ? "s" : ""} due today
            </>
          )}
          {dueTodayTasks.length > 0 && overdueTasks.length > 0 && " · "}
          {overdueTasks.length > 0 && (
            <span className="text-red-600 dark:text-red-400">
              {overdueTasks.length} overdue
            </span>
          )}
        </p>
      </div>

      {/* Task list */}
      <div className="mt-2 ml-7 flex flex-col gap-1">
        {previewTasks.map((task) => {
          const isOverdue = new Date(task.dueDate!) < startOfToday;
          return (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className={cn("group flex items-center gap-2 text-xs hover:underline", accentText)}
            >
              <Clock className="h-3 w-3 shrink-0 opacity-50" />
              <span className="truncate">{task.title}</span>
              {isOverdue && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-red-500 dark:text-red-400 shrink-0">
                  overdue
                </span>
              )}
            </Link>
          );
        })}
        {moreCount > 0 && (
          <span className={cn("text-xs opacity-60 ml-5", accentText)}>
            and {moreCount} more...
          </span>
        )}
      </div>

      {/* View all link */}
      <div className="mt-2 ml-7">
        <Link
          href="/tasks?filter=due-today"
          className={cn("inline-flex items-center gap-1 text-xs font-medium hover:underline", accentLink)}
        >
          View all tasks
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
