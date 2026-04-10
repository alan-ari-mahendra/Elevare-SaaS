import { Project } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";
import { ProjectInput } from "@/types/project";

export const getProjects = () => fetcher<Project[]>("/api/projects");

export const getProjectById = (id: string) => fetcher<Project>(`/api/projects/${id}`);

export const postProject = async (project: ProjectInput): Promise<Project> => {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(project),
  });

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
};

export const updateProject = async (
  id: string,
  project: ProjectInput
): Promise<Project> => {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(project),
  });

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
};

export const deleteProject = async (id: string): Promise<void> => {
  const res = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
};

export const duplicateProject = async (project: Project): Promise<Project> => {
  const baseName = project.name.replace(/\(\d+\)$/, "").trim();

  return postProject({
    name: baseName,
    description: project.description,
    status: project.status,
    color: project.color,
    startDate: project.startDate,
    endDate: project.endDate,
  });
};