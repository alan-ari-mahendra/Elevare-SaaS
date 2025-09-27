import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {GripVertical, MoreHorizontal, Edit, Trash2, Calendar} from "lucide-react";
import {format} from "date-fns";
import Link from "next/link";

export function SortableTaskCard({task, isReorderMode, onStatusChange, onEdit, onDelete}) {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
        useSortable({id: task.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 'auto',
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high":
                return "destructive";
            case "medium":
                return "default";
            case "low":
                return "secondary";
            default:
                return "outline";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "todo":
                return "outline";
            case "in_progress":
                return "default";
            case "done":
                return "secondary";
            default:
                return "outline";
        }
    };

    const handleTaskStatusChange = (checked) => {
        onStatusChange(task.id, checked ? "done" : "todo");
    };

    return (
        <div ref={setNodeRef} style={style} className={`${isDragging ? "opacity-50" : ""}`}>
            <Card className="border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        {isReorderMode ? (
                            <div
                                className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing" {...attributes} {...listeners}>
                                <GripVertical className="h-5 w-5"/>
                            </div>
                        ) : (
                            <Checkbox
                                checked={task.status === "done"}
                                onCheckedChange={handleTaskStatusChange}
                            />
                        )}
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                                <Link href={`/tasks/${task.id}`} className="hover:underline">
                                    <h3
                                        className={`font-semibold ${
                                            task.status === "done"
                                                ? "line-through text-muted-foreground"
                                                : "text-foreground"
                                        }`}
                                    >
                                        {task.title}
                                    </h3>
                                </Link>
                                <Badge
                                    variant={getPriorityColor(task.priority)}
                                    className="text-xs"
                                >
                                    {task.priority}
                                </Badge>
                                <Badge variant={"completed"}>
                                    Position: {task.position || 0}
                                </Badge>
                                <Badge
                                    variant={getStatusColor(task.status)}
                                    className="text-xs"
                                >
                                    {task.status.replace("_", " ")}
                                </Badge>
                            </div>
                            {task.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {task.description}
                                </p>
                            )}
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span>
                                    Updated {format(new Date(task.updatedAt), "MMM d")}
                                </span>
                                {task.dueDate && (
                                    <>
                                        <span>•</span>
                                        <div className="flex items-center">
                                            <Calendar className="mr-1 h-3 w-3"/>
                                            Due {format(new Date(task.dueDate), "MMM d")}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        {!isReorderMode && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => onEdit(task)}>
                                        <Edit className="mr-2 h-4 w-4"/>
                                        Edit Task
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem
                                        onClick={() => onDelete(task.id, task.title)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4"/>
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}