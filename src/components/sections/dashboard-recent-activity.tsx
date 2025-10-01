import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Activity as ActivityPrisma } from "@prisma/client";
type Props = {
  isLoading: boolean;
  activity: ActivityPrisma[];
}
export function DashboardRecentActivity({
  isLoading,
  activity,
                                        }:Props) {

  const recentActivity = activity
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Your latest project updates and milestones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))
        ) : (
          <>
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-foreground">
                    {activity.details}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(
                      new Date(activity.createdAt),
                      "MMM d, yyyy at h:mm a"
                    )}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}

        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
          >
            View all activity
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>

  )
}