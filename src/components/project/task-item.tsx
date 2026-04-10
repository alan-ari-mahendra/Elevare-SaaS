// components/task-item.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskActionDropdown } from "@/components/task/task-action-dropdown";
import { ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";
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
    <div className="group flex items-center gap-3 px-4 py-3 border border-border/50 rounded-lg hover:border-primary/30 hover:bg-muted/30 transition-all">
      <Checkbox
        checked={task.status === "done"}
        onCheckedChange={(checked) =>
          onStatusChange(task.id, checked as boolean)
        }
        className="shrink-0"
      />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link href={`/tasks/${task.id}`} className="hover:underline min-w-0">
            <h4
              className={`text-sm font-medium truncate ${
                task.status === "done"
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {task.title}
            </h4>
          </Link>
          <Badge variant={getPriorityColor(task.priority)} className="text-[10px] shrink-0">
            {task.priority}
          </Badge>
          <Badge variant={getStatusColor(task.status)} className="text-[10px] shrink-0">
            {task.status.replace("_", " ")}
          </Badge>
        </div>
        {task.dueDate && (
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
            <Calendar className="h-3 w-3" />
            Due {format(new Date(task.dueDate), "MMM d")}
          </p>
        )}
      </div>

      {/* Actions — visible on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Link href={`/tasks/${task.id}`}>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ExternalLink className="h-3.5 w-3.5" />
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
