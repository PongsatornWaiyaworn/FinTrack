import { db } from "@/config/db";
import { CreateExpenseDTO, UpdateExpenseDTO } from "./expense.types";
import { ExpenseSQL } from "./expense.sql";

/* =========================
   Get expenses (with filter)
========================= */
export async function getExpensesService(
  userId: string,
  filters: {
    startDate?: string;
    endDate?: string;
    sortField?: string;
    sortDirection?: "asc" | "desc";
  }
) {
  let query = ExpenseSQL.getByUser;
  const values: any[] = [userId];
  let idx = 2;

  if (filters.startDate) {
    query += ` AND expense_date >= $${idx++}`;
    values.push(filters.startDate);
  }

  if (filters.endDate) {
    query += ` AND expense_date <= $${idx++}`;
    values.push(filters.endDate);
  }

  const allowedSortFields = [
    "expense_date",
    "amount",
    "created_at",
  ] as const;

  const sortField = allowedSortFields.includes(
    filters.sortField as any
  )
    ? filters.sortField
    : "expense_date";

  const sortDirection =
    filters.sortDirection === "asc" ? "asc" : "desc";

  query += ` ORDER BY ${sortField} ${sortDirection}`;

  const { rows } = await db.query(query, values);
  return rows;
}

/* =========================
   Get expense by id
========================= */
export async function getExpenseByIdService(
  userId: string,
  expenseId: string
) {
  const { rows } = await db.query(
    ExpenseSQL.getById,
    [expenseId, userId]
  );

  return rows[0];
}

/* =========================
   Create expense
========================= */
export async function createExpenseService(
  userId: string,
  data: CreateExpenseDTO
) {
  const { rows } = await db.query(
    ExpenseSQL.create,
    [
      userId,
      data.category_id,
      data.amount,
      data.expense_date,
      data.note ?? null,
    ]
  );

  return rows[0];
}

/* =========================
   Update expense
========================= */
export async function updateExpenseService(
  userId: string,
  expenseId: string,
  data: UpdateExpenseDTO
) {
  const { rows } = await db.query(
    ExpenseSQL.update,
    [
      data.amount ?? null,
      data.category_id ?? null,
      data.expense_date ?? null,
      data.note ?? null,
      expenseId,
      userId,
    ]
  );

  return rows[0];
}

/* =========================
   Delete expense
========================= */
export async function deleteExpenseService(
  userId: string,
  expenseId: string
) {
  await db.query(
    ExpenseSQL.delete,
    [expenseId, userId]
  );
}
