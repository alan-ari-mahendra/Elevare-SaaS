"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Project, Task } from "@prisma/client";
import { getStatusColor } from "@/lib/utils";

type Props = {
  project: Project;
  tasks: Task[];
  onDelete: (id: string, name: string) => void;
  onDuplicate: (project: Project) => void;
};

function getProgressColor(pct: number) {
  if (pct >= 80) return "bg-emerald-500";
  if (pct > 0 && pct < 30) return "bg-amber-500";
  return "bg-primary";
}

export default function ProjectCard({ project, tasks, onDelete, onDuplicate }: Props) {
  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const completedTasks = projectTasks.filter((task) => task.status === "done");
  const progress =
    projectTasks.length > 0
      ? Math.round((completedTasks.length / projectTasks.length) * 100)
      : 0;

  return (
    <Card className="border-border/50 hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer">
      <CardContent className="p-5">
        {/* Top: title + badge + menu */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link
            href={`/projects/${project.id}`}
            className="flex-1 min-w-0"
          >
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {project.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant={getStatusColor(project.status)} className="text-[10px]">
              {project.status.replace("_", " ")}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/projects/${project.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(project)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(project.id, project.name)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {project.description}
          </p>
        )}

        {/* Dates */}
        {(project.startDate || project.endDate) && (
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
            {project.startDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(project.startDate), "MMM d")}
              </span>
            )}
            {project.startDate && project.endDate && (
              <span className="text-muted-foreground/40">→</span>
            )}
            {project.endDate && (
              <span className="flex items-center gap-1">
                {!project.startDate && <Calendar className="h-3 w-3" />}
                {format(new Date(project.endDate), "MMM d")}
              </span>
            )}
          </div>
        )}

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {completedTasks.length}/{projectTasks.length} tasks
            </span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${getProgressColor(progress)}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-muted-foreground/60 mt-3">
          Updated {format(new Date(project.updatedAt), "MMM d")}
        </p>
      </CardContent>
    </Card>
  );
}
