import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import prisma from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export async function activityLog(data: {
  action: string;
  details?: string;
  userId: string;
  projectId?: string;
  taskId?: string;
}) {
  await prisma.activity.create({
    data: {
      action: data.action,
      details: data.details,
      userId: data.userId,
      projectId: data.projectId,
      taskId: data.taskId,
    },
  });
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
    case "done":
      return "completed";
    case "in_progress":
      return "in-progress";
    case "planning":
      return "planning";
    default:
      return "archived";
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "high";
    case "medium":
      return "medium";
    default:
      return "low";
  }
};

export const getStatusOptions = [
  { value: "planning", label: "Planning" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" }
];

export const getColorOptions = [
  { value: "#6366F1", label: "Indigo", color: "bg-indigo-500" },
  { value: "#10B981", label: "Emerald", color: "bg-emerald-500" },
  { value: "#F59E0B", label: "Amber", color: "bg-amber-500" },
  { value: "#EF4444", label: "Red", color: "bg-red-500" },
  { value: "#8B5CF6", label: "Violet", color: "bg-violet-500" },
  { value: "#06B6D4", label: "Cyan", color: "bg-cyan-500" }
];