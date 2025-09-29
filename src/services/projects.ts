import { Project } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";

export const getProjects = () => fetcher<Project[]>("/api/projects");