"use client";

import { useState } from "react";
import { Task, Project } from "@prisma/client";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Skeleton } from "@/components/ui/skeleton";
import { DayCell } from "./day-cell";
import { priorityStyles } from "./task-chip";
import { cn } from "@/lib/utils";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
  currentDate: Date;
  tasks: Task[];
  projects: Project[];
  isLoading: boolean;
  onTaskClick: (task: Task) => void;
  onDayClick: (date: Date) => void;
  onTaskDrop: (taskId: string, newDate: Date) => void;
}

export function CalendarGrid({
  currentDate,
  tasks,
  projects,
  isLoading,
  onTaskClick,
  onDayClick,
  onTaskDrop,
}: CalendarGridProps) {
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const startDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current?.task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const task = active.data.current?.task as Task;
    const newDate = over.data.current?.date as Date;
    if (!task || !newDate) return;

    const currentDueDate = task.dueDate ? new Date(task.dueDate) : null;
    if (currentDueDate?.toDateString() === newDate.toDateString()) return;

    onTaskDrop(task.id, newDate);
  };

  if (isLoading) {
    return (
      <div className="border border-border/40 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7">
          {WEEK_DAYS.map((d) => (
            <div
              key={d}
              className="p-3 text-center text-xs font-medium text-muted-foreground bg-muted/30 border-b border-border/40"
            >
              {d}
            </div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton
              key={i}
              className="min-h-[110px] rounded-none border-b border-r border-border/20"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="border border-border/40 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7">
          {/* Day-of-week headers */}
          {WEEK_DAYS.map((d) => (
            <div
              key={d}
              className="p-3 text-center text-xs font-medium text-muted-foreground bg-muted/30 border-b border-border/40"
            >
              {d}
            </div>
          ))}

          {/* Day cells */}
          {cells.map((date, i) => (
            <DayCell
              key={i}
              date={date}
              cellIndex={i}
              today={today}
              currentMonth={month}
              tasks={tasks}
              projects={projects}
              onTaskClick={onTaskClick}
              onDayClick={onDayClick}
            />
          ))}
        </div>
      </div>

      {/* Drag overlay — floats with the cursor */}
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div
            className={cn(
              "flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded border shadow-lg cursor-grabbing w-32 truncate",
              priorityStyles[activeTask.priority] ?? priorityStyles.medium
            )}
          >
            {activeTask.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
