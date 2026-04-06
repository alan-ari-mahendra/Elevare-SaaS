"use client";

import { Task, Project } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { DayCell } from "./day-cell";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
  currentDate: Date;
  tasks: Task[];
  projects: Project[];
  isLoading: boolean;
  onTaskClick: (task: Task) => void;
  onDayClick: (date: Date) => void;
}

export function CalendarGrid({
  currentDate,
  tasks,
  projects,
  isLoading,
  onTaskClick,
  onDayClick,
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
            <Skeleton key={i} className="min-h-[110px] rounded-none border-b border-r border-border/20" />
          ))}
        </div>
      </div>
    );
  }

  return (
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
  );
}
