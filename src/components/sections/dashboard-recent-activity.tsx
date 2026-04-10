"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity as ActivityPrisma } from "@prisma/client";

type Props = {
  isLoading: boolean;
  activity: ActivityPrisma[];
};

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Opsi A — Vertical timeline with connected dots and line
 */
export function DashboardRecentActivity({
  isLoading,
  activity,
}: Props) {
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
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-3 w-3 rounded-full mt-1 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />

            <div className="space-y-4">
              {recentActivity.map((act, i) => (
                <div key={act.id} className="relative flex items-start gap-3 pl-0">
                  {/* Timeline dot */}
                  <div className={`relative z-10 mt-1.5 h-[11px] w-[11px] rounded-full border-2 shrink-0 ${
                    i === 0
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30 bg-background"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">{act.details}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {timeAgo(new Date(act.createdAt))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No recent activity yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create a project or task to get started
            </p>
          </div>
        )}

        <div className="pt-4">
          <Link href="/tasks">
            <Button variant="ghost" size="sm" className="w-full justify-center">
              View all activity
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
