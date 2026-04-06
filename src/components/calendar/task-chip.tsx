"use client";

import { Task } from "@prisma/client";
import { cn } from "@/lib/utils";

const priorityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900",
  medium: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900",
  low: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900",
};

interface TaskChipProps {
  task: Task;
  onClick: (task: Task) => void;
}

export function TaskChip({ task, onClick }: TaskChipProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(task);
      }}
      className={cn(
        "w-full text-left text-xs px-1.5 py-0.5 rounded border truncate transition-opacity hover:opacity-75",
        priorityStyles[task.priority] ?? priorityStyles.medium,
        task.status === "done" && "opacity-50 line-through"
      )}
    >
      {task.title}
    </button>
  );
}
