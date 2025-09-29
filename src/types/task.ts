export interface TaskInput {
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  projectId: string;
  dueDate?: Date;
}