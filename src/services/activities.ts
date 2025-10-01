import { fetcher } from "@/lib/fetcher";
import { Activity } from "@prisma/client";

export const getActivities = () => fetcher<Activity[]>("/api/activities");