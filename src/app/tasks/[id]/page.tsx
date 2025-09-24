"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { mockTasks, mockProjects, mockUser } from "@/lib/mock-data"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Flag,
  FolderOpen,
  User,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function TaskDetailPage() {
  const params = useParams()
  const taskId = params.id as string

  // Find the task by ID (in a real app, this would be fetched from an API)
  const initialTask = mockTasks.find((task) => task.id === taskId) || mockTasks[0]
  const project = mockProjects.find((p) => p.id === initialTask.project_id)

  const [task, setTask] = useState(initialTask)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(initialTask)

  const handleSave = () => {
    setTask(editedTask)
    setIsEditing(false)
    console.log("Saving task:", editedTask)
    // Here you would typically save to your backend
  }

  const handleCancel = () => {
    setEditedTask(task)
    setIsEditing(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/tasks">Tasks</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{task.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/tasks">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Button>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Task
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Task Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  {isEditing ? (
                    <Input
                      value={editedTask.title}
                      onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                      className="text-2xl font-bold"
                    />
                  ) : (
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(task.status)}
                      <h1 className="text-2xl font-bold tracking-tight text-foreground">{task.title}</h1>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
                    <Badge className={getPriorityColor(task.priority)}>{task.priority} priority</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Description</Label>
                {isEditing ? (
                  <Textarea
                    value={editedTask.description || ""}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    rows={4}
                    placeholder="Add a description for this task..."
                  />
                ) : (
                  <p className="text-muted-foreground">{task.description || "No description provided."}</p>
                )}
              </div>

              <Separator />

              {/* Task Properties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedTask.status}
                      onValueChange={(value) => setEditedTask({ ...editedTask, status: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(task.status)}
                      <span className="capitalize">{task.status.replace("_", " ")}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  {isEditing ? (
                    <Select
                      value={editedTask.priority}
                      onValueChange={(value) => setEditedTask({ ...editedTask, priority: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
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
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  {isEditing ? (
                    <Input
                      type="datetime-local"
                      value={editedTask.due_date ? new Date(editedTask.due_date).toISOString().slice(0, 16) : ""}
                      onChange={(e) =>
                        setEditedTask({
                          ...editedTask,
                          due_date: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                        })
                      }
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {task.due_date
                          ? new Date(task.due_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "No due date set"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={mockUser.avatar_url || "/placeholder.svg"} alt={mockUser.name} />
                      <AvatarFallback className="text-xs">
                        {mockUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{mockUser.name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                <span>Project</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project && (
                <div className="space-y-3">
                  <Link
                    href={`/projects/${project.id}`}
                    className="block hover:bg-muted/50 p-2 rounded-md transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                    </div>
                  </Link>
                  <Badge className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Task Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(task.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{new Date(task.updated_at).toLocaleDateString()}</span>
                </div>
                {task.due_date && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Due Date</span>
                    <span
                      className={
                        new Date(task.due_date) < new Date() && task.status !== "done" ? "text-red-600 font-medium" : ""
                      }
                    >
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <User className="h-4 w-4 mr-2" />
                Assign to Someone
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                Set Due Date
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <FolderOpen className="h-4 w-4 mr-2" />
                Move to Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
