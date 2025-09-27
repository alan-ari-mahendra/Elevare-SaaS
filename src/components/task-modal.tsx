"use client"

import React, {useEffect} from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Save } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import type { Project } from "@/lib/types"
import {TaskForm} from "@/components/task-form";
import {Task} from "@prisma/client";

interface TaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task
  projectId: string
  projects: Project[]
  onSave: (taskData: Partial<Task>) => void
}

export function TaskModal({ open, onOpenChange, task, projectId, projects, onSave }: TaskModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo",
    priority: task?.priority || "medium",
    dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
    projectId: task?.projectId || projectId,
  })
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        projectId: task.projectId,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: undefined,
        projectId: projectId,
      })
    }
  }, [task, projectId, open])
  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    handleInputChange("dueDate", date)
    setDatePickerOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Form submitted with data:", {formData})
    try {
      const apiUrl = task ? `/api/tasks/${task.id}` : "/api/tasks";
      const method = task ? "PUT" : "POST";

      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
          projectId: formData.projectId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const savedTask = await response.json();

      const taskData = {
        ...savedTask,
        dueDate: savedTask.dueDate,
        projectId: savedTask.projectId,
        user_id: savedTask.userId,
        created_at: savedTask.createdAt,
        updated_at: savedTask.updatedAt,
      };

      onSave(taskData);

      toast({
        title: task ? "Task updated" : "Task created",
        description: `"${formData.title}" has been ${task ? "updated" : "created"} successfully.`,
      });

      onOpenChange(false);

      if (!task) {
        setFormData({
          title: "",
          description: "",
          status: "todo",
          priority: "medium",
          dueDate: undefined,
          projectId: projectId,
        });
      }
    } catch (error) {
      console.error("Error saving task:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ]

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ]

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] overflow-visible">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
              <DialogDescription>
                {task ? "Update the task details below." : "Add a new task to your project."}
              </DialogDescription>
            </DialogHeader>

            <TaskForm formData={formData} projects={projects} onChange={handleInputChange} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !formData.title.trim()}>
                {isLoading ? (
                    task ? (
                        "Updating..."
                    ) : (
                        "Creating..."
                    )
                ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {task ? "Update Task" : "Create Task"}
                    </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}