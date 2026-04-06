"use client";

import { Task } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export const priorityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900",
  medium:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900",
  low: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900",
};

interface TaskChipProps {
  task: Task;
  onClick: (task: Task) => void;
}

export function TaskChip({ task, onClick }: TaskChipProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { task },
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center w-full text-xs rounded border",
        priorityStyles[task.priority] ?? priorityStyles.medium,
        task.status === "done" && "opacity-50",
        isDragging && "opacity-30"
      )}
    >
      {/* Drag handle */}
      <span
        {...listeners}
        {...attributes}
        className="px-0.5 py-0.5 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none opacity-50 hover:opacity-100"
        title="Drag to reschedule"
      >
        <GripVertical className="h-3 w-3" />
      </span>

      {/* Clickable title */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick(task);
        }}
        className={cn(
          "flex-1 text-left px-1 py-0.5 truncate hover:opacity-75 transition-opacity",
          task.status === "done" && "line-through"
        )}
      >
        {task.title}
      </button>
    </div>
  );
}
