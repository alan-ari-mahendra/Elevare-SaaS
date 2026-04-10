import { Task } from "@prisma/client";

export interface KanbanColumn {
  id: string;
  name: string;
  color: string;
  status: string;
}

export interface KanbanUser {
  id: string;
  name: string;
  image?: string;
}

export interface KanbanProps {
  tasks: Task[];
  users: KanbanUser[] | null;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onCreateTask?:any;
}