import { fetcher } from "@/lib/fetcher";
import { Task } from "@prisma/client";

export const getTasks = () => fetcher<Task[]>("/api/tasks");