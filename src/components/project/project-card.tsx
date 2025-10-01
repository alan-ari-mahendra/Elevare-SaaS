"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { BarChart3, Calendar, CheckCircle2, Clock, Edit, MoreHorizontal, Plus, Trash2, Users } from "lucide-react";
import { Project, Task } from "@prisma/client";
import { getStatusColor } from "@/lib/utils";

type Props = {
  project: Project;
  tasks: Task[];
  onDelete: (id: string, name: string) => void;
  onDuplicate: (project: Project) => void;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4" />;
    case "in_progress":
      return <Clock className="h-4 w-4" />;
    case "planning":
      return <BarChart3 className="h-4 w-4" />;
    default:
      return <Users className="h-4 w-4" />;
  }
};

export default function ProjectCard({
                                      project,
                                      tasks,
                                      onDelete,
                                      onDuplicate
                                    }: Props) {
  const projectTasks = tasks.filter(
    (task) => task.projectId === project.id
  );
  const completedTasks = projectTasks.filter(
    (task) => task.status === "done"
  );
  const progress =
    projectTasks.length > 0
      ? (completedTasks.length / projectTasks.length) * 100
      : 0;

  return (
    <Card
      key={project.id}
      className={`border-border/50 hover:border-primary/50 transition-colors group cursor-pointer `}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              {getStatusIcon(project.status)}
              <CardTitle className="text-lg line-clamp-1">
                <Link
                  href={`/projects/${project.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {project.name}
                </Link>
              </CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={getStatusColor(project.status)}
                className="text-xs whitespace-nowrap"
              >
                {project.status.replace("_", " ")}
              </Badge>
              <div className="flex flex-row items-center justify-between w-full">
                {project.startDate && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    Start{" "}
                    {format(new Date(project.startDate), "MMM d")}
                  </div>
                )}
                {project.endDate && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    End {format(new Date(project.endDate), "MMM d")}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
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
              <DropdownMenuItem
                onClick={() => onDuplicate(project)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  onDelete(project.id, project.name)
                }
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-sm line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className={`h-2`} />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>{projectTasks.length} tasks</span>
              <span>{completedTasks.length} completed</span>
            </div>
            <span>
              Updated {format(new Date(project.updatedAt), "MMM d")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
