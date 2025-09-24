"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart3, CheckCircle, Clock, Plus, TrendingUp, Users, Calendar, ArrowRight, Activity } from "lucide-react"
import Link from "next/link"
import { mockUser, mockProjects, mockTasks, mockActivityLogs } from "@/lib/mock-data"
import { format } from "date-fns"

export default function DashboardPage() {
  // Calculate statistics
  const totalProjects = mockProjects.length
  const completedProjects = mockProjects.filter((p) => p.status === "completed").length
  const inProgressProjects = mockProjects.filter((p) => p.status === "in_progress").length
  const totalTasks = mockTasks.length
  const completedTasks = mockTasks.filter((t) => t.status === "done").length
  const inProgressTasks = mockTasks.filter((t) => t.status === "in_progress").length

  // Get upcoming tasks (due within next 7 days)
  const upcomingTasks = mockTasks
    .filter((task) => {
      if (!task.due_date) return false
      const dueDate = new Date(task.due_date)
      const now = new Date()
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      return dueDate >= now && dueDate <= weekFromNow
    })
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5)

  // Get recent activity
  const recentActivity = mockActivityLogs
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "done":
        return "completed"
      case "in_progress":
        return "in-progress"
      case "planning":
        return "planning"
      default:
        return "archived"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "high"
      case "medium":
        return "medium"
      default:
        return "low"
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {mockUser.name}</h1>
        <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-secondary font-medium">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-secondary font-medium">+1</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressProjects}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-medium">{inProgressTasks}</span> active tasks
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((completedTasks / totalTasks) * 100)}%</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest project updates and milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-foreground">{activity.details}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.timestamp), "MMM d, yyyy at h:mm a")}
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Button variant="ghost" size="sm" className="w-full justify-center">
                View all activity
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>Tasks due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => {
                const project = mockProjects.find((p) => p.id === task.project_id)
                return (
                  <div key={task.id} className="flex items-center justify-between space-x-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{task.title}</p>
                        <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{project?.name}</span>
                        <span>•</span>
                        <span>Due {format(new Date(task.due_date!), "MMM d")}</span>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(task.status)} className="text-xs">
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No upcoming tasks</p>
              </div>
            )}
            <div className="pt-2">
              <Link href="/projects">
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  View all tasks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Overview */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Your current projects and their progress</CardDescription>
          </div>
          <Link href="/projects">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockProjects
              .filter((project) => project.status !== "archived")
              .slice(0, 6)
              .map((project) => {
                const projectTasks = mockTasks.filter((task) => task.project_id === project.id)
                const completedProjectTasks = projectTasks.filter((task) => task.status === "done")
                const progress =
                  projectTasks.length > 0 ? (completedProjectTasks.length / projectTasks.length) * 100 : 0

                return (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{project.name}</CardTitle>
                          <Badge variant={getStatusColor(project.status)} className="text-xs">
                            {project.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm line-clamp-2">{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{projectTasks.length} tasks</span>
                            {project.due_date && <span>Due {format(new Date(project.due_date), "MMM d")}</span>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
          </div>
          {mockProjects.filter((p) => p.status !== "archived").length > 6 && (
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

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/projects/new">
              <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent">
                <Plus className="h-6 w-6" />
                <span>Create Project</span>
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent">
                <BarChart3 className="h-6 w-6" />
                <span>View Projects</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent">
                <Users className="h-6 w-6" />
                <span>Team Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
