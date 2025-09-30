import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  taskFilter: string;
  handleCreateTask: () => void;
}
export function TaskNotFound({
                               taskFilter,
                               handleCreateTask
}:Props) {
  return (
    <div className="text-center py-8">
      <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No tasks found
      </h3>
      <p className="text-muted-foreground mb-6">
        {taskFilter === "all"
          ? "Get started by adding your first task."
          : `No tasks with status "${taskFilter.replace(
            "_",
            " "
          )}" found.`}
      </p>
      <Button onClick={handleCreateTask}>
        <Plus className="mr-2 h-4 w-4" />
        Add Task
      </Button>
    </div>
  )
}