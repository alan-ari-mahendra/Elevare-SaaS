import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Project, Task } from "@prisma/client";
import { getStatusColor } from "@/lib/utils";
type Props = {
  isLoading: boolean;
  projects: Project[];
  tasks: Task[];
}
export function DashboardProjectOverview({
  isLoading,
  projects,
  tasks,
                                         }:Props) {

  return(
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>
            Your current projects and their progress
          </CardDescription>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-2 w-full" />
              </Card>
            ))
          ) : (
            <>
              {projects
                .filter((project) => project.status !== "archived")
                .slice(0, 6)
                .map((project) => {
                  const projectTasks = tasks.filter(
                    (task) => task.projectId === project.id
                  );
                  const completedProjectTasks = projectTasks.filter(
                    (task) => task.status === "done"
                  );
                  const progress =
                    projectTasks.length > 0
                      ? (completedProjectTasks.length / projectTasks.length) *
                      100
                      : 0;

                  return (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              {project.name}
                            </CardTitle>
                            <Badge
                              variant={getStatusColor(project.status)}
                              className="text-xs"
                            >
                              {project.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <CardDescription className="text-sm line-clamp-2">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Progress
                                </span>
                              <span className="font-medium">
                                  {Math.round(progress)}%
                                </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{projectTasks.length} tasks</span>
                              {project.endDate && (
                                <span>
                                    Due{" "}
                                  {format(new Date(project.endDate), "MMM d")}
                                  </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
            </>
          )}
        </div>
        {projects.filter((p) => p.status !== "archived").length > 6 && (
          <div className="mt-6 text-center">
            <Link href="/projects">
              <Button variant="outline">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>

  )
}