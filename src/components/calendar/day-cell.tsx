"use client";

import { Task, Project } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { TaskChip } from "./task-chip";

interface DayCellProps {
  date: Date | null;
  today: Date;
  currentMonth: number;
  tasks: Task[];
  projects: Project[];
  onTaskClick: (task: Task) => void;
  onDayClick: (date: Date) => void;
}

export function DayCell({
  date,
  today,
  currentMonth,
  tasks,
  projects,
  onTaskClick,
  onDayClick,
}: DayCellProps) {
  if (!date) {
    return (
      <div className="min-h-[110px] bg-muted/10 border-b border-r border-border/20 last:border-r-0" />
    );
  }

  const isToday = date.toDateString() === today.toDateString();
  const isCurrentMonth = date.getMonth() === currentMonth;

  const dayTasks = tasks.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate).toDateString() === date.toDateString()
  );

  const dayProjects = projects.filter((p) => {
    if (!p.startDate || !p.endDate) return false;
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return date >= start && date <= end;
  });

  return (
    <div
      className={cn(
        "min-h-[110px] p-1.5 border-b border-r border-border/30 cursor-pointer group transition-colors hover:bg-muted/20",
        !isCurrentMonth && "opacity-40",
        isToday && "bg-primary/5"
      )}
      onClick={() => onDayClick(date)}
    >
      {/* Day number + add button */}
      <div className="flex items-center justify-between mb-1">
        <span
          className={cn(
            "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
            isToday
              ? "bg-primary text-primary-foreground font-bold"
              : "text-foreground"
          )}
        >
          {date.getDate()}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDayClick(date);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted"
          title="Add task"
        >
          <Plus className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>

      {/* Project span indicators */}
      {dayProjects.length > 0 && (
        <div className="flex gap-0.5 mb-1">
          {dayProjects.map((p) => (
            <div
              key={p.id}
              className="h-1 flex-1 min-w-[10px] rounded-full"
              style={{ backgroundColor: p.color || "#6366F1" }}
              title={p.name}
            />
          ))}
        </div>
      )}

      {/* Task chips */}
      <div className="space-y-0.5">
        {dayTasks.slice(0, 3).map((task) => (
          <TaskChip key={task.id} task={task} onClick={onTaskClick} />
        ))}
        {dayTasks.length > 3 && (
          <p className="text-xs text-muted-foreground px-1.5">
            +{dayTasks.length - 3} more
          </p>
        )}
      </div>
    </div>
  );
}
