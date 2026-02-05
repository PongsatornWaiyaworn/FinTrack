export const ExpenseSQL = {
  getByUser: `
    SELECT e.*
    FROM expenses e
    WHERE e.user_id = $1
  `,

  getById: `
    SELECT e.*
    FROM expenses e
    WHERE e.id = $1
      AND e.user_id = $2
  `,

  create: `
    INSERT INTO expenses
      (user_id, category_id, amount, expense_date, note)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `,

  update: `
    UPDATE expenses
    SET
      amount = COALESCE($1, amount),
      category_id = COALESCE($2, category_id),
      expense_date = COALESCE($3, expense_date),
      note = COALESCE($4, note),
      updated_at = NOW()
    WHERE id = $5
      AND user_id = $6
    RETURNING *
  `,

  delete: `
    DELETE FROM expenses
    WHERE id = $1
      AND user_id = $2
  `,
};
