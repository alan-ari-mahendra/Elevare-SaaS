import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, GripVertical } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { TaskActionDropdown } from "@/components/task/task-action-dropdown";
import { Task } from "@prisma/client";
import { getPriorityColor, getStatusColor } from "@/lib/utils";

type Props = {
  task: Task;
  isReorderMode: boolean;
  onStatusChange: (taskId: string, newStatus: Checked) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string, taskTitle: string) => void;
};

export type Priority = "high" | "medium" | "low";
export type Status = "todo" | "in_progress" | "done";
export type Checked = "done" | "todo";
export type BadgeVariant = "destructive" | "default" | "secondary" | "outline" | "completed";

export function SortableTaskCard({
                                   task,
                                   isReorderMode,
                                   onStatusChange,
                                   onEdit,
                                   onDelete
                                 }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto"
  };

  const handleTaskStatusChange = (checked: boolean | "indeterminate") => {
    onStatusChange(task.id, checked ? "done" : "todo");
  };

  return (
    <div ref={setNodeRef} style={style} className={`${isDragging ? "opacity-50" : ""}`}>
      <Card className="border-border/50 hover:border-primary/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {isReorderMode ? (
              <div
                className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-5 w-5" />
              </div>
            ) : (
              <Checkbox
                checked={task.status === "done"}
                onCheckedChange={handleTaskStatusChange}
              />
            )}
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <Link href={`/tasks/${task.id}`} className="hover:underline bg-pink-600">
                  <h3
                    className={`font-semibold ${
                      task.status === "done"
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {task.title}
                  </h3>
                </Link>
                <Badge
                  variant={getPriorityColor(task.priority as Priority)}
                  className="text-xs"
                >
                  {task.priority}
                </Badge>
                <Badge variant={"completed"}>Position: {task.position || 0}</Badge>
                <Badge
                  variant={getStatusColor(task.status as Status)}
                  className="text-xs"
                >
                  {task.status.replace("_", " ")}
                </Badge>
              </div>
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>Updated {format(new Date(task.updatedAt), "MMM d")}</span>
                {task.dueDate && (
                  <>
                    <span>•</span>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      Due {format(new Date(task.dueDate), "MMM d")}
                    </div>
                  </>
                )}
              </div>
            </div>
            {!isReorderMode && (
              <TaskActionDropdown task={task} onTaskEdit={onEdit} onTaskDelete={onDelete} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
