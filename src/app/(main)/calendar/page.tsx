"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, Project } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProjects } from "@/services/projects";
import { getTasks } from "@/services/tasks";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { TaskModal } from "@/components/task/task-modal";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectFilter, setProjectFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [proj, task] = await Promise.all([getProjects(), getTasks()]);
      setProjects(proj);
      setTasks(task);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTasks =
    projectFilter === "all"
      ? tasks
      : tasks.filter((t) => t.projectId === projectFilter);

  const handlePrevMonth = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));

  const handleNextMonth = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const handleToday = () => setCurrentDate(new Date());

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setSelectedDate(undefined);
    setIsModalOpen(true);
  };

  const handleDayClick = (date: Date) => {
    setSelectedTask(undefined);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const monthLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
        <p className="text-muted-foreground">
          View your tasks and project timelines
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold text-foreground ml-2">
            {monthLabel}
          </span>
        </div>

        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-red-400" />
          <span>High priority</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-amber-400" />
          <span>Medium priority</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-blue-400" />
          <span>Low priority</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-5 rounded-full bg-indigo-400" />
          <span>Project span</span>
        </div>
      </div>

      {/* Calendar */}
      <CalendarGrid
        currentDate={currentDate}
        tasks={filteredTasks}
        projects={projects}
        isLoading={isLoading}
        onTaskClick={handleTaskClick}
        onDayClick={handleDayClick}
      />

      {/* Task Modal */}
      <TaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        task={selectedTask}
        projectId={projects[0]?.id || ""}
        defaultDueDate={selectedDate}
        saveOnSuccess={fetchData}
      />
    </div>
  );
}
