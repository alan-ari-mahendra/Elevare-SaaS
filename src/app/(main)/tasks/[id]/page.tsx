"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Flag,
  FolderOpen,
  User,
  Edit3,
  CheckCircle2,
  Circle,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { TaskModal } from "@/components/task/task-modal"
import { useTask } from "@/hooks/useTask"
import { useProject } from "@/hooks/useProject"
import React, { useEffect } from "react"
import { getPriorityColor, getStatusColor } from "@/lib/utils";
import { Status } from "@/app/(main)/tasks/page";
import { Priority } from "@/components/task/sortable-task-card";

export default function TaskDetailPage() {
  const { data: session } = useSession()

  const {
    task,
    isLoading,
    isDeleting,
    isTaskModalOpen,
    setIsTaskModalOpen,
    editingTask,
    handleTaskUpdate,
    handleTaskDelete,
    handleEditTask
  } = useTask()

  const {
    project,
    isLoading: isProjectLoading,
    getProject
  } = useProject()

  useEffect(() => {
    if (task?.projectId) {
      getProject()
    }
  }, [task, getProject])

  const handleTaskUpdateWithProject = async (taskData: any) => {
    await handleTaskUpdate(taskData)

    // Refresh project data if project has changed
    if (taskData.projectId && taskData.projectId !== task?.projectId) {
      getProject()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-green-600"/>
      case "in_progress":
        return <AlertCircle className="h-4 w-4 text-yellow-600"/>
      default:
        return <Circle className="h-4 w-4 text-gray-400"/>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin"/>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Task not found</p>
        <Link href="/tasks">
          <Button className="mt-4">Back to Tasks</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/tasks">Tasks</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator/>
          <BreadcrumbItem>
            <BreadcrumbPage>{task.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/tasks">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2"/>
              Back to Tasks
            </Button>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleTaskDelete} disabled={isDeleting}>
            {isDeleting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
            ) : (
              <Trash2 className="h-4 w-4 mr-2"/>
            )}
            Delete
          </Button>
          <Button onClick={handleEditTask}>
            <Edit3 className="h-4 w-4 mr-2"/>
            Edit Task
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(task.status)}
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">{task.title}</h1>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={getStatusColor(task.status as Status)}
                      className="text-xs"
                    >
                      {task.status.replace("_", " ")}
                    </Badge>
                    <Badge
                      variant={getPriorityColor(task.priority as Priority)}
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-muted-foreground">{task.description || "No description provided."}</p>
              </div>

              <Separator/>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Status</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status)}
                    <span className="capitalize">{task.status.replace("_", " ")}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Priority</h3>
                  <div className="flex items-center space-x-2">
                    <Flag
                      className={`h-4 w-4 ${
                        task.priority === "high"
                          ? "text-red-500"
                          : task.priority === "medium"
                            ? "text-yellow-500"
                            : "text-blue-500"
                      }`}
                    />
                    <span className="capitalize">{task.priority}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Due Date</h3>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground"/>
                    <span>
                      {task.dueDate ? formatDateTime(task.dueDate) : "No due date set"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Project</h3>
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="h-4 w-4 text-muted-foreground"/>
                    <span>{project?.name || "No project assigned"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Assignee</h3>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={session?.user?.image || "/placeholder.svg"}
                                   alt={session?.user?.name || ""}/>
                      <AvatarFallback className="text-xs">
                        {session?.user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{session?.user?.name || "Unknown"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {project && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FolderOpen className="h-5 w-5 text-primary"/>
                  <span>Project</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link
                    href={`/projects/${project.id}`}
                    className="block hover:bg-muted/50 p-2 rounded-md transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full"
                           style={{backgroundColor: project.color || "#6b7280"}}/>
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                    </div>
                  </Link>
                  <Badge
                    className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary"/>
                <span>Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDate(task.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{formatDate(task.updatedAt)}</span>
                </div>
                {task.dueDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Due Date</span>
                    <span
                      className={
                        new Date(task.dueDate) < new Date() && task.status !== "done"
                          ? "text-red-600 font-medium"
                          : ""
                      }
                    >
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TaskModal
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        task={editingTask}
        projectId={task.projectId || ""}
        onSave={handleTaskUpdateWithProject}
      />
    </div>
  )
}