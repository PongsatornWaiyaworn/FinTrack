export const EXPENSE_CATEGORIES = [
  "Food",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  expense_date: string;
  note: string | null;
  created_at: string;
}

export interface ExpenseFormData {
  amount: number;
  category: ExpenseCategory;
  expense_date: Date;
  note?: string;
}

export type SortField = "expense_date" | "amount";
export type SortDirection = "asc" | "desc";

export interface ExpenseFilters {
  startDate?: Date;
  endDate?: Date;
  sortField: SortField;
  sortDirection: SortDirection;
}
