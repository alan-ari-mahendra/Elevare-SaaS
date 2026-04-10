"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity as ActivityType, Project, Task } from "@prisma/client";
import { useSessionUser } from "@/hooks/useSessionUser";
import { getProjects } from "@/services/projects";
import { getTasks } from "@/services/tasks";
import { getActivities } from "@/services/activities";
import { StatisticsSection } from "@/components/sections/dashboard-statistics";
import { DashboardProjectOverview } from "@/components/sections/dashboard-project-overview";
import { DashboardRecentActivity } from "@/components/sections/dashboard-recent-activity";
import { DashboardUpcomingTasks } from "@/components/sections/dashboard-upcoming-tasks";
import { DashboardDeadlineReminder } from "@/components/sections/dashboard-deadline-reminder";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, Settings } from "lucide-react";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTask] = useState<Task[]>([]);
  const [activity, setActivity] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useSessionUser();

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [proj, task, act] = await Promise.all([
        getProjects(),
        getTasks(),
        getActivities(),
      ]);
      setProjects(proj);
      setTask(task);
      setActivity(act);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const activeProjects = projects.filter((p) => p.status !== "archived").length;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekFromNow = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dueThisWeek = tasks.filter((t) => {
    if (!t.dueDate || t.status === "done") return false;
    const due = new Date(t.dueDate);
    return due >= startOfToday && due < weekFromNow;
  }).length;

  return (
    <div className="space-y-8">
      {/* Welcome Section + Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user && user.name}
          </h1>
          <p className="text-muted-foreground">
            {!isLoading && projects.length > 0 ? (
              <>
                You have <span className="font-medium text-foreground">{activeProjects}</span> active project{activeProjects !== 1 ? "s" : ""}
                {dueThisWeek > 0 && (
                  <> and <span className="font-medium text-foreground">{dueThisWeek}</span> task{dueThisWeek !== 1 ? "s" : ""} due this week</>
                )}
              </>
            ) : (
              <>Here&apos;s what&apos;s happening with your projects today.</>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/projects/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
          <Link href="/projects">
            <Button variant="outline" size="sm" className="gap-1.5">
              <FolderOpen className="h-4 w-4" />
              Projects
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Deadline Reminder */}
      <DashboardDeadlineReminder tasks={tasks} isLoading={isLoading} />

      {/* Statistics Cards */}
      <StatisticsSection
        isLoading={isLoading}
        projects={projects}
        tasks={tasks}
      />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Activity */}
        <DashboardRecentActivity isLoading={isLoading} activity={activity} />
        {/* Upcoming Tasks */}
        <DashboardUpcomingTasks isLoading={isLoading} projects={projects} tasks={tasks} />
      </div>

      {/* Projects Overview */}
      <DashboardProjectOverview isLoading={isLoading} projects={projects} tasks={tasks} />
    </div>
  );
}
