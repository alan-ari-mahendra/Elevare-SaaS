import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, CheckCircle2, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Task } from "@prisma/client";
type Props = {
  tasks: Task[];
  completedTasks: any[];
  inProgressTasks: any[];
  progress: number;
}
export function ProjectStats({
  tasks,
  completedTasks,
  inProgressTasks,
  progress,
                             }:Props ) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasks.length}</div>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTasks.length}</div>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressTasks.length}</div>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progress</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(progress)}%</div>
          <Progress value={progress} className="mt-2 h-2" />
        </CardContent>
      </Card>
    </div>
  )
}