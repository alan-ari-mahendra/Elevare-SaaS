"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {CalendarIcon, Sparkles, Loader2} from "lucide-react"
import {format} from "date-fns"
import {cn} from "@/lib/utils"
import type {Project} from "@/lib/types"

interface TaskFormProps {
    formData: {
        title: string
        description: string
        status: string
        priority: string
        dueDate?: Date
        projectId: string
    }
    projects: Project[]
    onChange: (field: string, value: string | Date | undefined) => void
}

interface PrioritySuggestion {
    priority: "high" | "medium" | "low"
    reason: string
}

const priorityBadgeStyle: Record<string, string> = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
}

export function TaskForm({formData, projects, onChange}: TaskFormProps) {
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const [isSuggesting, setIsSuggesting] = useState(false)
    const [suggestion, setSuggestion] = useState<PrioritySuggestion | null>(null)

    const statusOptions = [
        {value: "todo", label: "To Do"},
        {value: "in_progress", label: "In Progress"},
        {value: "done", label: "Done"},
    ]

    const priorityOptions = [
        {value: "low", label: "Low"},
        {value: "medium", label: "Medium"},
        {value: "high", label: "High"},
    ]

    const handleSuggestPriority = async () => {
        if (!formData.title.trim()) return
        setIsSuggesting(true)
        setSuggestion(null)
        try {
            const res = await fetch("/api/ai/priority", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                }),
            })
            if (!res.ok) throw new Error("Failed")
            const data: PrioritySuggestion = await res.json()
            setSuggestion(data)
        } catch {
            // silently fail — non-critical feature
        } finally {
            setIsSuggesting(false)
        }
    }

    const handleApplySuggestion = () => {
        if (!suggestion) return
        onChange("priority", suggestion.priority)
        setSuggestion(null)
    }

    return (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                    id="title"
                    placeholder="Enter task title"
                    value={formData.title || ""}
                    onChange={(e) => onChange("title", e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Describe the task details"
                    value={formData.description || ""}
                    onChange={(e) => onChange("description", e.target.value)}
                    rows={3}
                />
            </div>

            <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                        value={formData.status || "todo"}
                        onValueChange={(value) => onChange("status", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status"/>
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Priority</Label>
                        <button
                            type="button"
                            onClick={handleSuggestPriority}
                            disabled={!formData.title.trim() || isSuggesting}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isSuggesting ? (
                                <Loader2 className="h-3 w-3 animate-spin"/>
                            ) : (
                                <Sparkles className="h-3 w-3"/>
                            )}
                            {isSuggesting ? "Thinking..." : "AI Suggest"}
                        </button>
                    </div>
                    <Select
                        value={formData.priority || "medium"}
                        onValueChange={(value) => onChange("priority", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select priority"/>
                        </SelectTrigger>
                        <SelectContent>
                            {priorityOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Suggestion hint */}
                    {suggestion && (
                        <div className="flex items-start gap-2 rounded-md border border-border/50 bg-muted/30 p-2 text-xs">
                            <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0"/>
                            <div className="flex-1 space-y-1.5">
                                <p className="text-muted-foreground leading-relaxed">
                                    {suggestion.reason}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "px-1.5 py-0.5 rounded border font-medium",
                                            priorityBadgeStyle[suggestion.priority]
                                        )}
                                    >
                                        {suggestion.priority}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleApplySuggestion}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Apply
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSuggestion(null)}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Project</Label>
                <Select
                    value={formData.projectId || (projects.length > 0 ? projects[0].id : "")}
                    onValueChange={(value) => onChange("projectId", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select project"/>
                    </SelectTrigger>
                    <SelectContent>
                        {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                                {project.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Due Date (Optional)</Label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setDatePickerOpen(true)
                            }}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.dueDate && "text-muted-foreground",
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4"/>
                            {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto p-0 z-[9999]"
                        align="start"
                        side="bottom"
                        sideOffset={4}
                    >
                        <Calendar
                            mode="single"
                            selected={formData.dueDate}
                            onSelect={(date) => onChange("dueDate", date)}
                            initialFocus
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}
