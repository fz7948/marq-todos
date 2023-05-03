export const SORT_TYPE = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

export interface FormType {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  reference: Array<number>;
}
