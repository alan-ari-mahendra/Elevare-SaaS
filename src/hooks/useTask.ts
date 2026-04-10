import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { getTaskById, updateTask, deleteTask } from '@/services/tasks';
import { Task } from "@prisma/client";

export function useTask() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const getTask = useCallback(async () => {
    setIsLoading(true);
    try {
      const taskData = await getTaskById(taskId);
      setTask(taskData);
      console.log("Task data:", taskData);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load task data.",
        variant: "destructive"
      });
      router.push("/tasks");
    } finally {
      setIsLoading(false);
    }
  }, [taskId, toast, router]);

  const handleTaskUpdate = useCallback(async (taskData: Partial<Task>) => {
    try {
      if (!task) return;

      const updatedTask = await updateTask(task.id, taskData);
      setTask(updatedTask);
      toast({
        title: "Task updated",
        description: "Task has been updated successfully."
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive"
      });
    }
  }, [task, toast]);

  const handleTaskDelete = useCallback(async () => {
    if (!task) return;

    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      setIsDeleting(true);
      await deleteTask(task.id);
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been deleted successfully.`
      });
      router.push("/tasks");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  }, [task, router, toast]);

  const handleEditTask = useCallback(() => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }, [task]);

  useEffect(() => {
    getTask();
  }, [getTask]);

  return {
    task,
    isLoading,
    isDeleting,
    isTaskModalOpen,
    setIsTaskModalOpen,
    editingTask,
    getTask,
    handleTaskUpdate,
    handleTaskDelete,
    handleEditTask
  };
}