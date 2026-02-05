import { Category } from "./category";

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export type ExpenseFormData = {
  amount: number;
  category_id: string;
  expense_date: Date;
  note?: string;
};

export type Expense = {
  category: any;
  id: string;
  amount: number;
  category_id: string;
  expense_date: string;
  note?: string;
};

export type SortField = "expense_date" | "amount";
export type SortDirection = "asc" | "desc";

export interface ExpenseFilters {
  startDate?: Date;
  endDate?: Date;
  sortField: SortField;
  sortDirection: SortDirection;
}

export type ExpenseWithCategory = Expense & {
  category?: Category | null;
};
