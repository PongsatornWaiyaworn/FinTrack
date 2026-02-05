/* =======================
   Expense Entity
======================= */

export interface Expense {
  id: string;
  user_id: string;

  category_id: string;
  category_name?: string;
  category_color?: string;

  amount: number;
  expense_date: string;
  note: string | null;
  created_at: string;
}

/* =======================
   DTOs
======================= */

export interface CreateExpenseDTO {
  amount: number;
  category_id: string;
  expense_date: string;
  note?: string;
}

export interface UpdateExpenseDTO {
  amount?: number;
  category_id?: string;
  expense_date?: string;
  note?: string;
}
