"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Save } from "lucide-react";
import { format } from "date-fns";
import { cn, getColorOptions, getStatusOptions } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { postProject, updateProject } from "@/services/projects";
import { ProjectFormProps } from "@/types/project";

export function ProjectForm({ mode = "create", initialData, isLoading= false }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning",
    color: "#6366F1",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        status: initialData.status ?? "planning",
        color: initialData.color ?? "#6366F1",
        startDate: initialData.startDate,
        endDate: initialData.endDate
      });
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "edit" && initialData?.id) {
        await updateProject(initialData.id, formData);
        toast({
          title: "Project updated",
          description: `"${formData.name}" has been updated successfully.`
        });
      } else {
        await postProject(formData);
        toast({
          title: "Project created",
          description: `"${formData.name}" has been created successfully.`
        });
      }
      router.push("/projects");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;
  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>
              {mode === "edit" ? "Edit Project" : "Project Details"}
            </CardTitle>
            <CardDescription>
              {mode === "edit"
                ? "Update your project details"
                : "Provide basic information about your project"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                disabled={isFormDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project goals and objectives"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                disabled={isFormDisabled}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleInputChange("status", value)
                  }
                  disabled={isFormDisabled}
                >
                  <SelectTrigger disabled={isFormDisabled}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Project Color</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) => handleInputChange("color", value)}
                  disabled={isFormDisabled}
                >
                  <SelectTrigger disabled={isFormDisabled}>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {getColorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-4 h-4 rounded-full ${option.color}`}
                          />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-row items-center gap-4">
              <div className="space-y-2 w-1/2">
                <Label>Start Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                      disabled={isFormDisabled}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate
                        ? format(formData.startDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, startDate: date }))
                      }
                      initialFocus
                      disabled={isFormDisabled}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2 w-1/2">
                <Label>End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                      disabled={isFormDisabled}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate
                        ? format(formData.endDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, endDate: date }))
                      }
                      initialFocus
                      disabled={isFormDisabled}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end space-x-4 mt-6">
          <Link href="/projects">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isFormDisabled || !formData.name.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "edit" ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {mode === "edit" ? "Update Project" : "Create Project"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
