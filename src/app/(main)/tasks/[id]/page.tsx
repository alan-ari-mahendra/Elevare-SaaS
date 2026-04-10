"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { CommentSection } from "@/components/task/comment-section";

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
      getProject(task.projectId) // Perbaikan: Sertakan projectId sebagai parameter
    }
  }, [task, getProject])

  const handleTaskUpdateWithProject = async (taskData: any) => {
    await handleTaskUpdate(taskData)

    // Refresh project data if project has changed
    if (taskData.projectId && taskData.projectId !== task?.projectId) {
      getProject(taskData.projectId) // Perbaikan: Sertakan projectId sebagai parameter
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/tasks">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4"/>
            </Button>
          </Link>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/tasks" className="text-muted-foreground/70">Tasks</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-muted-foreground/40"/>
              <BreadcrumbItem>
                <BreadcrumbPage>{task.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleTaskDelete} disabled={isDeleting}>
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin"/>
            ) : (
              <Trash2 className="h-3.5 w-3.5 mr-1.5"/>
            )}
            Delete
          </Button>
          <Button size="sm" onClick={handleEditTask}>
            <Edit3 className="h-3.5 w-3.5 mr-1.5"/>
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50">
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{task.title}</h1>
                <Badge
                  variant={getStatusColor(task.status as Status)}
                  className="text-[10px]"
                >
                  {task.status.replace("_", " ")}
                </Badge>
                <Badge
                  variant={getPriorityColor(task.priority as Priority)}
                  className="text-[10px]"
                >
                  {task.priority}
                </Badge>
              </div>

              <p className="text-muted-foreground text-sm">{task.description || "No description provided."}</p>

              <Separator/>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    {getStatusIcon(task.status)}
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Status</p>
                    <p className="text-sm font-medium capitalize">{task.status.replace("_", " ")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                    task.priority === "high" ? "bg-red-500/10" : task.priority === "medium" ? "bg-amber-500/10" : "bg-blue-500/10"
                  }`}>
                    <Flag className={`h-4 w-4 ${
                      task.priority === "high" ? "text-red-500" : task.priority === "medium" ? "text-amber-500" : "text-blue-500"
                    }`} />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Priority</p>
                    <p className="text-sm font-medium capitalize">{task.priority}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="h-4 w-4 text-primary"/>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Due Date</p>
                    <p className="text-sm font-medium">
                      {task.dueDate ? formatDateTime(task.dueDate) : "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                    <FolderOpen className="h-4 w-4 text-violet-500"/>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Project</p>
                    <p className="text-sm font-medium">{project?.name || "No project"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session?.user?.image || "/placeholder.svg"} alt={session?.user?.name || ""}/>
                    <AvatarFallback className="text-xs">
                      {session?.user?.name?.split(" ").map((n) => n[0]).join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Assignee</p>
                    <p className="text-sm font-medium">{session?.user?.name || "Unknown"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {project && (
            <Card className="border-border/50">
              <CardContent className="pt-4 pb-4 px-4">
                <p className="text-[11px] text-muted-foreground mb-2">Project</p>
                <Link
                  href={`/projects/${project.id}`}
                  className="block hover:bg-muted/50 p-2 -mx-2 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0"
                         style={{backgroundColor: project.color || "#6b7280"}}/>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{project.name}</p>
                      {project.description && (
                        <p className="text-xs text-muted-foreground truncate">{project.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
                <Badge
                  className={`mt-2 text-[10px] ${getStatusColor(project.status)}`}>{project.status.replace("_", " ")}</Badge>
              </CardContent>
            </Card>
          )}

          <Card className="border-border/50">
            <CardContent className="pt-4 pb-4 px-4">
              <p className="text-[11px] text-muted-foreground mb-3">Timeline</p>
              <div className="relative pl-5 space-y-4">
                <div className="absolute left-[5px] top-1 bottom-1 w-px bg-border" />

                <div className="relative">
                  <div className="absolute -left-5 top-1 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span className="text-xs">{formatDate(task.createdAt)}</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-5 top-1 h-2.5 w-2.5 rounded-full border-2 border-muted-foreground/30 bg-background" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Updated</span>
                    <span className="text-xs">{formatDate(task.updatedAt)}</span>
                  </div>
                </div>

                {task.dueDate && (
                  <div className="relative">
                    <div className={`absolute -left-5 top-1 h-2.5 w-2.5 rounded-full border-2 bg-background ${
                      new Date(task.dueDate) < new Date() && task.status !== "done"
                        ? "border-red-500"
                        : "border-muted-foreground/30"
                    }`} />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Due</span>
                      <span className={`text-xs ${
                        new Date(task.dueDate) < new Date() && task.status !== "done"
                          ? "text-red-600 font-medium"
                          : ""
                      }`}>
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <CommentSection taskId={task.id} />
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