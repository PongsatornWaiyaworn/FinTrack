const { db } = require("../../config/db");
const { ExpenseSQL } = require("./expense.sql");

async function getExpensesService(userId, filters = {}) {
  let query = ExpenseSQL.getByUser;
  const values = [userId];
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
  ];

  const sortField = allowedSortFields.includes(filters.sortField)
    ? filters.sortField
    : "expense_date";

  const sortDirection =
    filters.sortDirection === "asc" ? "asc" : "desc";

  query += ` ORDER BY ${sortField} ${sortDirection}`;

  const { rows } = await db.query(query, values);
  return rows;
}


async function getExpenseByIdService(userId, expenseId) {
  const { rows } = await db.query(
    ExpenseSQL.getById,
    [expenseId, userId]
  );

  return rows[0];
}

async function createExpenseService(userId, data) {
  const { rows } = await db.query(
    ExpenseSQL.create,
    [
      userId,
      data.category_id,
      data.amount,
      data.expense_date,
      data.note || null,
    ]
  );

  return rows[0];
}

async function updateExpenseService(userId, expenseId, data) {
  const { rows } = await db.query(
    ExpenseSQL.update,
    [
      data.amount || null,
      data.category_id || null,
      data.expense_date || null,
      data.note || null,
      expenseId,
      userId,
    ]
  );

  return rows[0];
}

async function deleteExpenseService(userId, expenseId) {
  await db.query(
    ExpenseSQL.delete,
    [expenseId, userId]
  );
}

module.exports = {
  getExpensesService,
  getExpenseByIdService,
  createExpenseService,
  updateExpenseService,
  deleteExpenseService,
};
