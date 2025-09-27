import React from 'react';
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    rectIntersection,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CheckCircle2} from "lucide-react";
import {SortableTaskCard} from "@/components/sortable-task-card";
import {Card} from "@/components/ui/card";

export function TaskList({
                             tasks,
                             isReorderMode,
                             onDragEnd,
                             onDragStart,
                             onStatusChange,
                             onEdit,
                             onDelete,
                             projects
                         }) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        }),
        useSensor(KeyboardSensor)
    );
    console.log("projects task list",projects);

    return (
        <div className="space-y-4">
            {tasks.length === 0 ? (
                <Card className="border-border/50 rounded-lg border p-6">
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="mb-4 h-12 w-12 text-muted-foreground">
                            <CheckCircle2 className="h-12 w-12"/>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground">No tasks found</h3>
                        <p className="mb-6 max-w-sm text-center text-muted-foreground">
                            Try adjusting your search or filter criteria.
                        </p>
                    </div>
                </Card>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={rectIntersection}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                >
                    <SortableContext
                        items={tasks.map(task => task.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4">
                            {tasks.map((task) => (
                                <SortableTaskCard
                                    key={task.id}
                                    task={task}
                                    isReorderMode={isReorderMode}
                                    onStatusChange={onStatusChange}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    projects={projects}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}