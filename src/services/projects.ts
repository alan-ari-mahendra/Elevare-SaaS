import { Project } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";

export const getProjects = () => fetcher<Project[]>("/api/projects");

export const deleteProject = async (id: string): Promise<void> => {
  const res = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
};

export const duplicateProject = async (project: Project): Promise<Project> => {
  const baseName = project.name.replace(/\(\d+\)$/, "").trim();

  const res = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: baseName,
      description: project.description,
      status: project.status,
      color: project.color,
      startDate: project.startDate,
      endDate: project.endDate,
    }),
  });

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
};