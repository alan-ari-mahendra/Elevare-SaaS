"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Plus } from "lucide-react";
import ProjectsFilters from "@/components/sections/projects-filters";
import ProjectCard from "@/components/project/project-card";
import { useProjects } from "@/hooks/useProjects";
import { ProjectModal } from "@/components/project/project-modal";

export default function ProjectsPage() {
  const {
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    filteredProjects,
    tasks,
    handleDeleteProject,
    handleDuplicateProject,
    fetchProjectsData,
  } = useProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all your projects in one place
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Filters and Search */}
      <ProjectsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="border-border/50 animate-pulse">
              <CardHeader className="pb-3 space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted rounded" />
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-5/6 bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              tasks={tasks}
              onDelete={handleDeleteProject}
              onDuplicate={handleDuplicateProject}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-6">
            <div className="h-20 w-20 rounded-2xl bg-muted/50 flex items-center justify-center">
              <FolderOpen className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-muted flex items-center justify-center">
              <Plus className="h-3.5 w-3.5 text-muted-foreground/60" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {searchQuery || statusFilter !== "all"
              ? "No projects match your filters"
              : "No projects yet"}
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Create your first project to start organizing your work."}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          )}
        </div>
      )}

      <ProjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={fetchProjectsData}
      />
    </div>
  );
}
