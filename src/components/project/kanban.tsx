"use client";
import { KanbanBoard, KanbanCard, KanbanCards, KanbanHeader, KanbanProvider } from "@/components/ui/shadcn-io/kanban";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { KanbanColumn, KanbanProps } from "@/types/kanban";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState, useMemo } from "react";


const Kanban = ({ tasks, users, onTaskUpdate, onCreateTask }: KanbanProps) => {
  const [localTasks, setLocalTasks] = useState(tasks);
  console.log("localTasks", localTasks);
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const columns: KanbanColumn[] = [
    { id: "todo", name: "To Do", color: "#6B7280", status: "todo" },
    { id: "in_progress", name: "In Progress", color: "#F59E0B", status: "in_progress" },
    { id: "done", name: "Done", color: "#10B981", status: "done" }
  ];

  const usersArray = Array.isArray(users) ? users : [];

  const kanbanTasks = useMemo(() => {
    return localTasks.map(task => ({
      id: task.id,
      name: task.title,
      description: task.description,
      column: task.status,
      owner: usersArray.find(user => user.id === task.userId),
      dueDate: task.dueDate,
      priority: task.priority,
      position: task.position,
      originalTask: task
    }));
  }, [localTasks, usersArray]);

  const handleTaskUpdate = (taskId: string, newColumnId: string) => {
    const column = columns.find(col => col.id === newColumnId);
    if (column) {
      setLocalTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? { ...task, status: column.status as any }
            : task
        )
      );

      if (onTaskUpdate) {
        onTaskUpdate(taskId, { status: column.status as any });
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return format(new Date(dateString), "MMM d");
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">High</span>;
      case "medium":
        return <span className="px-1.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Medium</span>;
      case "low":
        return <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">Low</span>;
      default:
        return null;
    }
  };

  return (
    <Card className="px-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Manage and track project tasks</CardDescription>
        </div>
        <Button onClick={onCreateTask}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </CardHeader>
      <KanbanProvider
        columns={columns}
        data={kanbanTasks}
        onDataChange={(updatedTasks) => {
          updatedTasks.forEach(updatedTask => {
            const originalTask = localTasks.find(task => task.id === updatedTask.id);
            if (originalTask && originalTask.status !== updatedTask.column) {
              handleTaskUpdate(updatedTask.id, updatedTask.column);
            }
          });
        }}
      >
        {(column) => (
          <KanbanBoard id={column.id} key={column.id}>
            <KanbanHeader>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <span>{column.name}</span>
              </div>
            </KanbanHeader>
            <KanbanCards id={column.id}>
              {(task: typeof kanbanTasks[0]) => (
                <KanbanCard
                  column={column.id}
                  id={task.id}
                  key={task.id}
                  name={task.name}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-1">
                        <p className="m-0 flex-1 font-medium text-sm">
                          {task.name}
                        </p>
                        {task.description && (
                          <p className="m-0 text-muted-foreground text-xs line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                      {task.owner && (
                        <Avatar className="h-6 w-6 shrink-0">
                          <AvatarImage src={task.owner.image} />
                          <AvatarFallback className="text-xs">
                            {task.owner.name?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <div>
                        {task.priority && getPriorityBadge(task.priority)}
                      </div>
                      {task.dueDate && (
                        <p className="m-0 text-muted-foreground text-xs">
                          Due: {formatDate(task.dueDate)}
                        </p>
                      )}
                    </div>
                  </div>
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </Card>
  );
};

export default Kanban;