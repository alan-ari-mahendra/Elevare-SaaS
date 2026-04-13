"use client";

import React, {useState, useEffect} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {TaskModal} from "@/components/task/task-modal";
import {
    Plus,
    Search,
    BarChart3,
    CheckCircle2,
    Clock,
    AlertCircle,
    Filter,
    ArrowUpDown,
} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
import {Task} from "@prisma/client";
import {
    DragEndEvent,
    DragStartEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
} from "@dnd-kit/sortable";
import {TaskList} from "@/components/task/task-list";
export type Status = "todo" | "in_progress" | "done";
export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [projectFilter, setProjectFilter] = useState("all");
    const [sortBy, setSortBy] = useState("position");
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [isReorderMode, setIsReorderMode] = useState(false);
    const {toast} = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

    const fetchProjects = async () => {
        try {
            setLoadingProjects(true);
            const res = await fetch("/api/projects", {method: "GET", credentials: "include"});
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setProjects(data);
        } catch (err) {
            console.error("Error fetching projects:", err);
            toast({
                title: "Error",
                description: "Failed to load projects.",
                variant: "destructive",
            });
        } finally {
            setLoadingProjects(false);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchProjects();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/api/tasks", {method: "GET", credentials: "include"});
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            const transformedTasks = data.map((task: any) => ({
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate,
                projectId: task.projectId,
                user_id: task.userId,
                position: task.position,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
            }));

            setTasks(transformedTasks);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch tasks");
            toast({
                title: "Error",
                description: "Failed to load tasks. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        if (!isReorderMode) return;
    };

    const handleDragEnd = (event: DragEndEvent) => {
        if (!isReorderMode) return;

        const {active, over} = event;

        if (!over || active.id === over.id) {
            return;
        }

        const activeIndex = tasks.findIndex((task) => task.id === active.id);
        const overIndex = tasks.findIndex((task) => task.id === over.id);

        if (activeIndex !== -1 && overIndex !== -1) {
            const reorderedTasks = arrayMove(tasks, activeIndex, overIndex);

            const tasksWithNewPositions = reorderedTasks.map((task, index) => ({
                ...task,
                position: index + 1,
            }));

            setTasks(tasksWithNewPositions);

            handleReorderTasks(tasksWithNewPositions);
        }
    };

    const handleTaskStatusChange = async (taskId: string, checked: boolean | "indeterminate") => {
        try {
            const newStatus: Status = checked === true ? "done" : "todo";

            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    status: newStatus,
                    title: tasks.find((t) => t.id === taskId)?.title || "",
                    description: tasks.find((t) => t.id === taskId)?.description || "",
                    priority: tasks.find((t) => t.id === taskId)?.priority || "medium",
                    dueDate: tasks.find((t) => t.id === taskId)?.dueDate,
                    projectId: tasks.find((t) => t.id === taskId)?.projectId || "",
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId
                        ? {...task, status: newStatus, updatedAt: new Date()}
                        : task,
                ),
            );

            toast({
                title: checked ? "Task completed" : "Task reopened",
                description: "Task status updated successfully.",
            });
        } catch (error) {
            console.error("Error updating task status:", error);
            toast({
                title: "Error",
                description: "Failed to update task status. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteTask = async (taskId: string, taskTitle: string) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

            toast({
                title: "Task deleted",
                description: `"${taskTitle}" has been deleted successfully.`,
            });
        } catch (error) {
            console.error("Error deleting task:", error);
            toast({
                title: "Error",
                description: "Failed to delete task. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const handleCreateTask = () => {
        setEditingTask(undefined);
        setIsTaskModalOpen(true);
    };

    const handleReorderTasks = async (reorderedTasks: Task[]) => {
        try {
            const updates = reorderedTasks.map((task, index) => ({
                taskId: task.id,
                newPosition: index + 1,
                projectId: task.projectId,
            }));

            const response = await fetch("/api/tasks/reorder-batch", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({updates}),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            setTasks(reorderedTasks.map((task, index) => ({
                ...task,
                position: index + 1,
            })));
        } catch (error) {
            console.error("Error reordering tasks:", error);
            toast({
                title: "Error",
                description: "Failed to reorder tasks. Please try again.",
                variant: "destructive",
            });
            fetchTasks();
        }
    };

    const filteredTasks = tasks
        .filter((task) => {
            const matchesSearch =
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesStatus = statusFilter === "all" || task.status === statusFilter;
            const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
            const matchesProject = projectFilter === "all" || task.projectId === projectFilter;
            return matchesSearch && matchesStatus && matchesPriority && matchesProject;
        })
        .sort((a, b) => {
            if (isReorderMode) {
                return (a.position || 0) - (b.position || 0);
            }

            switch (sortBy) {
                case "title":
                    return a.title.localeCompare(b.title);
                case "status":
                    return a.status.localeCompare(b.status);
                case "priority":
                    const priorityOrder = {high: 3, medium: 2, low: 1};
                    return (
                        priorityOrder[b.priority as keyof typeof priorityOrder] -
                        priorityOrder[a.priority as keyof typeof priorityOrder]
                    );
                case "dueDate":
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                case "created":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "position":
                    return (a.position || 0) - (b.position || 0);
                default:
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            }
        });

    const completedTasks = tasks.filter((task) => task.status === "done");
    const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
    const todoTasks = tasks.filter((task) => task.status === "todo");

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">Loading tasks...</div>
            </div>
        );
    }
    if (loadingProjects) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">Loading project...</div>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">All Tasks</h1>
                    <p className="text-muted-foreground">Manage all your tasks across projects</p>
                </div>
                <Button onClick={handleCreateTask}>
                    <Plus className="mr-2 h-4 w-4"/>
                    New Task
                </Button>
            </div>

            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                {[
                    { label: "Total Tasks", value: tasks.length, icon: BarChart3, iconBg: "bg-primary/10", iconColor: "text-primary" },
                    { label: "To Do", value: todoTasks.length, icon: Clock, iconBg: "bg-slate-500/10", iconColor: "text-slate-500" },
                    { label: "In Progress", value: inProgressTasks.length, icon: AlertCircle, iconBg: "bg-amber-500/10", iconColor: "text-amber-500" },
                    { label: "Completed", value: completedTasks.length, icon: CheckCircle2, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500" },
                ].map((s, i) => {
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
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="flex flex-col gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-9"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[140px] h-9">
                            <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            <SelectValue placeholder="Status"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-full sm:w-[140px] h-9">
                            <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            <SelectValue placeholder="Priority"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={projectFilter} onValueChange={setProjectFilter}>
                        <SelectTrigger className="w-full sm:w-[160px] h-9">
                            <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            <SelectValue placeholder="Project"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Projects</SelectItem>
                            {projects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                    {project.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy} disabled={isReorderMode}>
                        <SelectTrigger className="w-full sm:w-[150px] h-9">
                            <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            <SelectValue placeholder="Sort by"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="position">Position</SelectItem>
                            <SelectItem value="updated">Last Updated</SelectItem>
                            <SelectItem value="created">Date Created</SelectItem>
                            <SelectItem value="dueDate">Due Date</SelectItem>
                            <SelectItem value="priority">Priority</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2 ml-auto">
                        <Switch
                            id="reorder-mode"
                            checked={isReorderMode}
                            onCheckedChange={setIsReorderMode}
                        />
                        <Label htmlFor="reorder-mode" className="text-sm">Reorder</Label>
                    </div>
                </div>
            </div>

            <TaskList
                tasks={filteredTasks}
                isReorderMode={isReorderMode}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onStatusChange={handleTaskStatusChange}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
            />

            <TaskModal
                open={isTaskModalOpen}
                onOpenChange={setIsTaskModalOpen}
                task={editingTask}
                projectId={projects[0]?.id || ""}
                saveOnSuccess={fetchTasks}
            />
        </div>
    );
}