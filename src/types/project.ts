export type ProjectInput = {
  name: string;
  description?: string | null;
  status: string;
  color?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
};
