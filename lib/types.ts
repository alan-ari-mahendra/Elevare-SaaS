export interface User {
  id: string
  name: string
  email: string
  avatar_url?: string
  theme_preference: "light" | "dark" | "system"
}

export interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "in_progress" | "completed" | "archived"
  color: string
  created_at: string
  updated_at: string
  due_date?: string
  user_id: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "done"
  priority: "low" | "medium" | "high"
  due_date?: string
  project_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  action: string
  details: string
  user_id: string
  timestamp: string
}
