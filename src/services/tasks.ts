import { fetcher } from "@/lib/fetcher";
import { Task } from "@prisma/client";
import { TaskInput } from "@/types/task";

export const getTasks = () => fetcher<Task[]>("/api/tasks");

export const getTaskById = (id: string) => fetcher<Task>(`/api/tasks/${id}`);

export const postTask = async (task: TaskInput): Promise<Task> => {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(task),
  });

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
};

export const updateTask = async (
  id: string,
  task: Partial<TaskInput>
): Promise<Task> => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(task),
  });

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
};

export const deleteTask = async (id: string): Promise<void> => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
};