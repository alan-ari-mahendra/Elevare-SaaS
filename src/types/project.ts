export type ProjectInput = {
  name: string;
  description?: string | null;
  status: string;
  color?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
};
export type ProjectFormProps = {
  mode?: "create" | "edit";
  initialData?: {
    id?: string;
    name: string;
    description: string;
    status: string;
    color: string;
    startDate?: Date;
    endDate?: Date;
  };
  isLoading?: boolean;
};