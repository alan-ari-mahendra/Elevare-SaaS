import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { Task } from "@prisma/client";

type Props = {
  tasks: Task[];
  completedTasks: any[];
  inProgressTasks: any[];
  progress: number;
};

export function ProjectStats({
  tasks,
  completedTasks,
  inProgressTasks,
  progress,
}: Props) {
  const stats = [
    {
      label: "Total Tasks",
      value: tasks.length,
      icon: BarChart3,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Completed",
      value: completedTasks.length,
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      label: "In Progress",
      value: inProgressTasks.length,
      icon: Clock,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
    {
      label: "Progress",
      value: `${Math.round(progress)}%`,
      icon: TrendingUp,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
      bar: progress,
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <Card key={i} className="border-border/50">
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg ${s.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-4 w-4 ${s.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-bold leading-tight">{s.value}</p>
                </div>
              </div>
              {"bar" in s && s.bar !== undefined && (
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all"
                    style={{ width: `${s.bar}%` }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
