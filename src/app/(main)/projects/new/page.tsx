"use client";

import type React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "@/components/project-form";

export default function NewProjectPage() {

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
        <span className="text-foreground">New Project</span>
      </div>

      {/* Header */}
      <div className="flex items-center space-x-3">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Create New Project
          </h1>
          <p className="text-muted-foreground">
            Set up a new project to start organizing your work
          </p>
        </div>
      </div>

      {/* Form */}
      <ProjectForm />
    </div>
  );
}
