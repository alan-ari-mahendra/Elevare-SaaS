// components/task-item.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskActionDropdown } from "@/components/task/task-action-dropdown";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Task } from "@prisma/client";
import { getPriorityColor, getStatusColor } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, checked: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string, taskTitle: string) => void;
}

export function TaskItem({ task, onStatusChange, onEdit, onDelete }: TaskItemProps) {
  return (
    <div className="flex items-center space-x-4 p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors">
      <Checkbox
        checked={task.status === "done"}
        onCheckedChange={(checked) =>
          onStatusChange(task.id, checked as boolean)
        }
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-center space-x-2">
          <Link href={`/tasks/${task.id}`} className="hover:underline">
            <h4
              className={`font-medium ${
                task.status === "done"
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {task.title}
            </h4>
          </Link>
          <Badge
            variant={getPriorityColor(task.priority)}
            className="text-xs"
          >
            {task.priority}
          </Badge>
          <Badge
            variant={getStatusColor(task.status)}
            className="text-xs"
          >
            {task.status.replace("_", " ")}
          </Badge>
        </div>
        {task.description && (
          <p className="text-sm text-muted-foreground">
            {task.description}
          </p>
        )}
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span>
            Created {format(new Date(task.createdAt), "MMM d")}
          </span>
          {task.dueDate && (
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              Due {format(new Date(task.dueDate), "MMM d")}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Link href={`/tasks/${task.id}`}>
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
        <TaskActionDropdown
          task={task}
          onTaskEdit={onEdit}
          onTaskDelete={onDelete}
        />
      </div>
    </div>
  );
}