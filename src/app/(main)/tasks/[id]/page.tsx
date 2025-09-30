"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskModal } from "@/components/task/task-modal";
import { ArrowLeft, Calendar, Edit } from "lucide-react";
import { format } from "date-fns";
import { getStatusColor } from "@/lib/utils";
import { ProjectViewSkeleton } from "@/components/project/project-view-skeleton";
import { ProjectStats } from "@/components/sections/project-stats";
import { ProjectActionDropdown } from "@/components/project/project-action-dropdown";
import { TaskList } from "@/components/project/task-list";
import { useProject } from "@/hooks/useProject";

export default function ProjectDetailPage() {
    const {
        project,
        isLoading,
        tasks,
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
        handleDuplicateProject
    } = useProject();

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
        return <ProjectViewSkeleton />;
    }

    return (
      <div className="space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link
                href="/dashboard"
                className="hover:text-foreground transition-colors"
              >
                  Dashboard
              </Link>
              <span>/</span>
              <Link
                href="/projects"
                className="hover:text-foreground transition-colors"
              >
                  Projects
              </Link>
              <span>/</span>
              <span className="text-foreground">{project!.name}</span>
          </div>

          {/* Project Header */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
              <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                      <Link href="/projects">
                          <Button variant="ghost" size="sm">
                              <ArrowLeft className="h-4 w-4" />
                          </Button>
                      </Link>
                      <h1 className="text-3xl font-bold text-foreground">
                          {project!.name}
                      </h1>
                      <Badge variant={getStatusColor(project!.status)}>
                          {project!.status.replace("_", " ")}
                      </Badge>
                  </div>
                  <p className="text-muted-foreground max-w-2xl">
                      {project!.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>
              Created {format(new Date(project!.createdAt), "MMM d, yyyy")}
            </span>
                      <span>•</span>
                      <span>
              Updated {format(new Date(project!.updatedAt), "MMM d, yyyy")}
            </span>
                      {project!.startDate && (
                        <>
                            <span>•</span>
                            <div className="flex items-center">
                                <Calendar className="mr-1 h-4 w-4" />
                                Start Date{" "}
                                {format(new Date(project!.startDate), "MMM d, yyyy")}
                            </div>
                        </>
                      )}
                  </div>
              </div>
              <div className="flex items-center space-x-2">
                  <Link href={`/projects/${project!.id}/edit`}>
                      <Button variant="outline">
                          <Edit className="mr-2 h-4 w-4" />
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
          <TaskList
            tasks={tasks}
            onStatusChange={handleTaskStatusChange}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onCreateTask={handleCreateTask}
          />

          <TaskModal
            open={isTaskModalOpen}
            onOpenChange={setIsTaskModalOpen}
            task={editingTask}
            projectId={project!.id}
            saveOnSuccess={handleTaskSaved}
          />
      </div>
    );
}