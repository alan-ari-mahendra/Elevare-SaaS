export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  theme_preference: "light" | "dark" | "system";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "in_progress" | "completed" | "archived";
  color: string;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  userId: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  userId: string;
  timestamp: string;
}
