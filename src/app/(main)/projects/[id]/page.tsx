"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskModal } from "@/components/task/task-modal";
import { ArrowLeft, Calendar, Edit, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { getStatusColor } from "@/lib/utils";
import { ProjectViewSkeleton } from "@/components/project/project-view-skeleton";
import { ProjectStats } from "@/components/sections/project-stats";
import { ProjectActionDropdown } from "@/components/project/project-action-dropdown";
import { TaskList } from "@/components/project/task-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Kanban from "@/components/project/kanban";
import { useProject } from "@/hooks/useProject";
import { updateTask } from "@/services/tasks";
import { useTaskOperations } from "@/hooks/useTaskOperations";
import { TaskBreakdownDialog } from "@/components/ai/task-breakdown-dialog";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { toast } = useToast();
  const {
    project,
    isLoading,
    tasks,
    users,
    isTaskModalOpen,
    setIsTaskModalOpen,
    editingTask,
    completedTasks,
    inProgressTasks,
    progress,
    handleTaskStatusChange,
    handleDeleteTask,
    handleEditTask,
    handleCreateTask,
    handleTaskSaved,
    handleDeleteProject,
    handleDuplicateProject,
    refreshTasks
  } = useProject();
  console.log("1",params.id)
  console.log("2",projectId)
const {
  handleTaskUpdate
} = useTaskOperations()

  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  if (!project && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Project not found
        </h1>
        <p className="text-muted-foreground mb-6">
          The project you're looking for doesn't exist.
        </p>
        <Link href="/projects">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <ProjectViewSkeleton />
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span className="text-muted-foreground/40">/</span>
        <Link href="/projects" className="hover:text-foreground transition-colors">
          Projects
        </Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground font-medium truncate">{project!.name}</span>
      </div>

      {/* Project Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <Link href="/projects">
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground truncate">
              {project!.name}
            </h1>
            <Badge variant={getStatusColor(project!.status)} className="shrink-0">
              {project!.status.replace("_", " ")}
            </Badge>
          </div>
          {project!.description && (
            <p className="text-sm text-muted-foreground max-w-2xl ml-10">
              {project!.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground ml-10">
            {project!.startDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(project!.startDate), "MMM d")}
              </span>
            )}
            {project!.startDate && project!.endDate && (
              <span className="text-muted-foreground/40">→</span>
            )}
            {project!.endDate && (
              <span>{format(new Date(project!.endDate), "MMM d")}</span>
            )}
            <span className="text-muted-foreground/30">·</span>
            <span>Updated {format(new Date(project!.updatedAt), "MMM d")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => setIsBreakdownOpen(true)}>
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Generate Tasks
          </Button>
          <Link href={`/projects/${project!.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
          </Link>
          <ProjectActionDropdown
            project={project!}
            onProjectDuplicate={handleDuplicateProject}
            onProjectDelete={handleDeleteProject}
          />
        </div>
      </div>

      {/* Project Stats */}
      <ProjectStats
        tasks={tasks}
        completedTasks={completedTasks}
        inProgressTasks={inProgressTasks}
        progress={progress}
      />

      {/* Project Content */}
      <Tabs defaultValue="task-list">
        <TabsList>
          <TabsTrigger value="task-list">TaskList</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>
        <TabsContent value="task-list">
          <TaskList
            tasks={tasks}
            onStatusChange={handleTaskStatusChange}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onCreateTask={handleCreateTask}
          />
        </TabsContent>
        <TabsContent value="kanban">
          <Kanban
            tasks={tasks}
            users={users}
            onTaskUpdate={handleTaskUpdate}
            onCreateTask={handleCreateTask}
          />
        </TabsContent>
      </Tabs>

      <TaskModal
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        task={editingTask}
        projectId={projectId}
        saveOnSuccess={handleTaskSaved}
      />

      <TaskBreakdownDialog
        open={isBreakdownOpen}
        onOpenChange={setIsBreakdownOpen}
        projectId={projectId}
        projectName={project!.name}
        onTasksAdded={handleTaskSaved}
      />
    </div>
  );
}