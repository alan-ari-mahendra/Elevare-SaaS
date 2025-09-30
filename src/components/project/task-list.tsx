// components/task-list.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { TaskNotFound } from "@/components/task/task-not-found";
import { Task } from "@prisma/client";
import { TaskItem } from "@/components/project/task-item";

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, checked: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string, taskTitle: string) => void;
  onCreateTask: () => void;
}

export function TaskList({
                           tasks,
                           onStatusChange,
                           onEdit,
                           onDelete,
                           onCreateTask
                         }: TaskListProps) {
  const [taskFilter, setTaskFilter] = useState("all");

  const completedTasks = tasks.filter((task) => task.status === "done");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const todoTasks = tasks.filter((task) => task.status === "todo");

  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === "all") return true;
    return task.status === taskFilter;
  });

  return (
    <Card className="border-border/50">
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
      <CardContent>
        <Tabs
          value={taskFilter}
          onValueChange={setTaskFilter}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
            <TabsTrigger value="todo">To Do ({todoTasks.length})</TabsTrigger>
            <TabsTrigger value="in_progress">
              In Progress ({inProgressTasks.length})
            </TabsTrigger>
            <TabsTrigger value="done">
              Done ({completedTasks.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value={taskFilter} className="mt-6">
            {filteredTasks.length > 0 ? (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={onStatusChange}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            ) : (
              <TaskNotFound
                taskFilter={taskFilter}
                handleCreateTask={onCreateTask}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}