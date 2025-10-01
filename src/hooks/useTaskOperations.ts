import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { updateTask, deleteTask } from '@/services/tasks';
import { Task } from "@prisma/client";

export function useTaskOperations() {
  const { toast } = useToast();

  const handleTaskUpdate = useCallback(async (taskId: string, taskData: Partial<Task>) => {
    try {
      await updateTask(taskId, taskData);
      toast({
        title: "Task updated",
        description: "Task has been updated successfully."
      });
      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const handleTaskDelete = useCallback(async (taskId: string, taskTitle: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return false;

    try {
      await deleteTask(taskId);
      toast({
        title: "Task deleted",
        description: `"${taskTitle}" has been deleted successfully.`
      });
      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  return {
    handleTaskUpdate,
    handleTaskDelete
  };
}