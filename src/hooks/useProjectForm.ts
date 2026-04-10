import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { updateProject, postProject } from '@/services/projects';
import { ProjectInput } from "@/types/project";
import { Project } from "@prisma/client";

interface ProjectFormProps {
  mode?: "create" | "edit";
  initialData?: Partial<Project>;
  isLoading?: boolean;
}

export function useProjectForm({ mode = "create", initialData }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectInput>({
    name: "",
    description: "",
    status: "planning",
    color: "#6366F1",
    startDate: undefined,
    endDate: undefined
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

  const handleInputChange = (field: keyof ProjectInput, value: string | Date) => {
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

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleSubmit
  };
}