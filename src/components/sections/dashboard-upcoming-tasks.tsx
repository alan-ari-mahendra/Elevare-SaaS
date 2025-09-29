import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getPriorityColor, getStatusColor } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Project, Task } from "@prisma/client";

type Props = {
  isLoading: boolean;
  tasks: Task[];
  projects: Project[];
}

export function DashboardUpcomingTasks({
                                         isLoading,
                                         tasks,
                                         projects
                                       }: Props) {
  const upcomingTasks = tasks
    .filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return dueDate >= now && dueDate <= weekFromNow;
    })
    .sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    )
    .slice(0, 5);

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Tasks
        </CardTitle>
        <CardDescription>Tasks due in the next 7 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))
        ) : (
          <>
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => {
                const project = projects.find(
                  (p) => p.id === task.projectId
                );
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between space-x-3"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {task.title}
                        </p>
                        <Badge
                          variant={getPriorityColor(task.priority)}
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{project?.name}</span>
                        <span>•</span>
                        <span>
                              Due {format(new Date(task.dueDate!), "MMM d")}
                            </span>
                      </div>
                    </div>
                    <Badge
                      variant={getStatusColor(task.status)}
                      className="text-xs"
                    >
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  No upcoming tasks
                </p>
              </div>
            )}
          </>
        )}

        <div className="pt-2">
          <Link href="/projects">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center"
            >
              View all tasks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>

  );
}