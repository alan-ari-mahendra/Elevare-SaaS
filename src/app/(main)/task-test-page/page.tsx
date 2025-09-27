"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    closestCenter,
    rectIntersection,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate: string;
    projectId: string;
    user_id: string;
    position: number;
    createdAt: string;
    updatedAt: string;
}

export default function TaskTestPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const mockTasks: Task[] = [
        {
            id: "1",
            title: "Test Task 1",
            description: "This is a test task for drag and drop functionality",
            status: "todo",
            priority: "high",
            dueDate: new Date().toISOString(),
            projectId: "project1",
            user_id: "user1",
            position: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: "2",
            title: "Test Task 2",
            description: "Another test task for testing drag and drop",
            status: "in_progress",
            priority: "medium",
            dueDate: new Date().toISOString(),
            projectId: "project1",
            user_id: "user1",
            position: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: "3",
            title: "Test Task 3",
            description: "Third test task for drag and drop testing",
            status: "done",
            priority: "low",
            dueDate: new Date().toISOString(),
            projectId: "project1",
            user_id: "user1",
            position: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    useEffect(() => {
        setTasks(mockTasks);
        setLoading(false);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        }),
        useSensor(KeyboardSensor)
    );

    const handleDragStart = (event: DragStartEvent) => {
        console.log('Drag started for task:', event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        console.log('Drag ended:', { activeId: active.id, overId: over?.id });

        if (!over || active.id === over.id) {
            console.log('No reordering needed: either dropped outside or dropped on itself.');
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

            console.log(`Task moved from position ${activeIndex + 1} to ${overIndex + 1}`);
        }
    };

    const handleTaskStatusChange = async (taskId: string, checked: boolean) => {
        const newStatus = checked ? "done" : "todo";

        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId
                    ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
                    : task,
            ),
        );

        console.log(checked ? "Task completed" : "Task reopened");
    };

    const handleDeleteTask = async (taskId: string, taskTitle: string) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        console.log(`"${taskTitle}" has been deleted successfully.`);
    };

    const handleEditTask = (task: Task) => {
        console.log(`Editing task: ${task.title}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "done":
                return "completed";
            case "in_progress":
                return "in-progress";
            case "todo":
                return "planning";
            default:
                return "archived";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "high";
            case "medium":
                return "medium";
            default:
                return "low";
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">Loading tasks...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Task Test Page - Drag & Drop
                </h1>
                <p className="text-gray-600">
                    Drag the cards using the grip handle to reorder tasks
                </p>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={tasks.map(task => task.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {tasks.map((task) => {
                            return <SortableTaskCard key={task.id} task={task} />;
                        })}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );

    function SortableTaskCard({ task }: { task: Task }) {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
            useSortable({ id: task.id });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.5 : 1,
            zIndex: isDragging ? 999 : 'auto',
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`mb-4 ${isDragging ? "opacity-50" : ""}`}
            >
                <Card
                    className={`border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md ${isDragging ? "shadow-lg border-blue-500 bg-blue-50" : ""}`}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <div
                                className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
                                {...attributes}
                                {...listeners}
                            >
                                <GripVertical className="h-5 w-5" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-2">
                                    <h3
                                        className={`font-semibold ${task.status === "done" ? "line-through text-gray-500" : "text-gray-900"}`}
                                    >
                                        {task.title}
                                    </h3>
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                        ID: {task.id}
                                    </span>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        Position: {task.position || 0}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        getPriorityColor(task.priority) === "high" ? "bg-red-100 text-red-800" :
                                            getPriorityColor(task.priority) === "medium" ? "bg-yellow-100 text-yellow-800" :
                                                "bg-green-100 text-green-800"
                                    }`}>
                                        Priority: {task.priority}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        getStatusColor(task.status) === "completed" ? "bg-green-100 text-green-800" :
                                            getStatusColor(task.status) === "in-progress" ? "bg-blue-100 text-blue-800" :
                                                "bg-gray-100 text-gray-800"
                                    }`}>
                                        Status: {task.status.replace("_", " ")}
                                    </span>
                                </div>
                                {task.description && (
                                    <p className="text-sm text-gray-600">{task.description}</p>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditTask(task)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteTask(task.id, task.title)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
}