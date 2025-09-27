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
