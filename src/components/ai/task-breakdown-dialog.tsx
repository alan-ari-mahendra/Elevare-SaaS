"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AITask {
  title: string;
  priority: "high" | "medium" | "low";
  description: string;
}

interface TaskBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
  onTasksAdded: () => void;
}

const priorityBadgeVariant: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
};

export function TaskBreakdownDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
  onTasksAdded,
}: TaskBreakdownDialogProps) {
  const [goal, setGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<AITask[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setIsGenerating(true);
    setGeneratedTasks([]);
    setSelectedIds(new Set());

    try {
      const res = await fetch("/api/ai/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ projectName, goal }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();
      setGeneratedTasks(data.tasks);
      // Select all by default
      setSelectedIds(new Set(data.tasks.map((_: AITask, i: number) => i)));
    } catch {
      toast({
        title: "Generation failed",
        description: "Could not generate tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTask = (index: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const handleAddSelected = async () => {
    const toAdd = generatedTasks.filter((_, i) => selectedIds.has(i));
    if (toAdd.length === 0) return;

    setIsAdding(true);
    try {
      await Promise.all(
        toAdd.map((task) =>
          fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              title: task.title,
              description: task.description,
              priority: task.priority,
              status: "todo",
              projectId,
            }),
          })
        )
      );

      toast({
        title: `${toAdd.length} task${toAdd.length > 1 ? "s" : ""} added`,
        description: "Tasks have been added to your project.",
      });

      onTasksAdded();
      handleClose();
    } catch {
      toast({
        title: "Failed to add tasks",
        description: "Some tasks could not be created. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    setGoal("");
    setGeneratedTasks([]);
    setSelectedIds(new Set());
    onOpenChange(false);
  };

  const selectedCount = selectedIds.size;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate Tasks with AI
          </DialogTitle>
          <DialogDescription>
            Describe what you want to accomplish in{" "}
            <span className="font-medium text-foreground">{projectName}</span>.
            Gemini will break it down into actionable tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          {/* Goal input */}
          <div className="space-y-2">
            <Label htmlFor="goal">What do you want to achieve?</Label>
            <Textarea
              id="goal"
              placeholder="e.g. Build a user authentication system with login, registration, password reset, and email verification"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              disabled={isGenerating}
            />
          </div>

          <Button
            type="button"
            onClick={handleGenerate}
            disabled={!goal.trim() || isGenerating}
            className="w-full"
            variant="secondary"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating tasks...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Tasks
              </>
            )}
          </Button>

          {/* Generated task list */}
          {generatedTasks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  Generated Tasks{" "}
                  <span className="text-muted-foreground font-normal">
                    ({selectedCount} of {generatedTasks.length} selected)
                  </span>
                </Label>
                <button
                  type="button"
                  onClick={() =>
                    selectedCount === generatedTasks.length
                      ? setSelectedIds(new Set())
                      : setSelectedIds(
                          new Set(generatedTasks.map((_, i) => i))
                        )
                  }
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {selectedCount === generatedTasks.length
                    ? "Deselect all"
                    : "Select all"}
                </button>
              </div>

              <div className="space-y-2 rounded-lg border border-border/50 p-2">
                {generatedTasks.map((task, i) => (
                  <div
                    key={i}
                    onClick={() => toggleTask(i)}
                    className={cn(
                      "flex items-start gap-3 p-2.5 rounded-md cursor-pointer transition-colors",
                      selectedIds.has(i)
                        ? "bg-primary/5 border border-primary/20"
                        : "hover:bg-muted/50 border border-transparent"
                    )}
                  >
                    <Checkbox
                      checked={selectedIds.has(i)}
                      onCheckedChange={() => toggleTask(i)}
                      className="mt-0.5"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">
                          {task.title}
                        </span>
                        <span
                          className={cn(
                            "text-xs px-1.5 py-0.5 rounded border font-medium",
                            priorityBadgeVariant[task.priority]
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {task.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 border-t border-border/40">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAddSelected}
            disabled={selectedCount === 0 || isAdding}
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add {selectedCount > 0 ? `${selectedCount} ` : ""}
                Task{selectedCount !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
