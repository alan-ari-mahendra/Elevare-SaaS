"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Project, Task } from "@prisma/client";
import { getStatusColor } from "@/lib/utils";

type Props = {
  isLoading: boolean;
  projects: Project[];
  tasks: Task[];
};

/**
 * Opsi B — List/row layout instead of card grid, more compact and scannable
 */
export function DashboardProjectOverview({ isLoading, projects, tasks }: Props) {
  function getProgressColor(pct: number) {
    if (pct >= 80) return "bg-emerald-500";
    if (pct < 30 && pct > 0) return "bg-amber-500";
    return "bg-primary";
  }

  const activeProjects = projects.filter((p) => p.status !== "archived").slice(0, 6);

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>Your current projects and their progress</CardDescription>
        </div>
        <Link href="/projects/new">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-border/50">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-2 w-24 ml-auto" />
              </div>
            ))}
          </div>
        ) : activeProjects.length > 0 ? (
          <div className="space-y-2">
            {activeProjects.map((project) => {
              const projectTasks = tasks.filter((t) => t.projectId === project.id);
              const completedCount = projectTasks.filter((t) => t.status === "done").length;
              const progress = projectTasks.length > 0
                ? Math.round((completedCount / projectTasks.length) * 100)
                : 0;

              return (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="flex items-center gap-4 rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer group -mx-1">
                    {/* Color indicator */}
                    <div className={`h-8 w-1 rounded-full shrink-0 ${getProgressColor(progress)}`} />

                    {/* Project info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {project.name}
                        </h3>
                        <Badge variant={getStatusColor(project.status)} className="text-[10px] shrink-0">
                          {project.status.replace("_", " ")}
                        </Badge>
                      </div>
                      {project.endDate && (
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(project.endDate), "MMM d, yyyy")}
                        </p>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="w-28 shrink-0 hidden sm:block">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                        <span>{completedCount}/{projectTasks.length}</span>
                        <span className="font-medium text-foreground">{progress}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getProgressColor(progress)}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No active projects</p>
          </div>
        )}

        {projects.filter((p) => p.status !== "archived").length > 6 && (
          <div className="mt-4 text-center">
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
