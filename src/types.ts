export const SORT_TYPE = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

export interface FormType {
  map(arg0: (item: FormType) => JSX.Element): import("react").ReactNode;
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  reference: Array<number>;
}
