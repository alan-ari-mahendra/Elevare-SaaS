"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity as ActivityType, Project, Task } from "@prisma/client";
import { useSessionUser } from "@/hooks/useSessionUser";
import { getProjects } from "@/services/projects";
import { getTasks } from "@/services/tasks";
import { getActivities } from "@/services/activities";
import { StatisticsSection } from "@/components/sections/dashboard-statistics";
import { DashboardQuickActions } from "@/components/sections/dashboard-quick-actions";
import { DashboardProjectOverview } from "@/components/sections/dashboard-project-overview";
import { DashboardRecentActivity } from "@/components/sections/dashboard-recent-activity";
import { DashboardUpcomingTasks } from "@/components/sections/dashboard-upcoming-tasks";

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
        getActivities()
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
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user && user.name}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Statistics Cards */}
      <StatisticsSection
        isLoading={isLoading}
        projects={projects}
        tasks={tasks}
      />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Activity */}
        <DashboardRecentActivity
          isLoading={isLoading}
          activity={activity}
        />
        {/* Upcoming Tasks */}
        <DashboardUpcomingTasks
          isLoading={isLoading}
          projects={projects}
          tasks={tasks}
        />
      </div>

      {/* Projects Overview */}
      <DashboardProjectOverview
        isLoading={isLoading}
        projects={projects}
        tasks={tasks}
      />
      {/* Quick Actions */}
      <DashboardQuickActions />
    </div>
  );
}
