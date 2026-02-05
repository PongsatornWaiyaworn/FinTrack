const {
  getExpensesService,
  getExpenseByIdService,
  createExpenseService,
  updateExpenseService,
  deleteExpenseService,
} = require("./expense.service");

async function getExpenses(req, res, next) {
  try {
    const expenses = await getExpensesService(req.user.id, {
      startDate: req.query.startDate
        ? String(req.query.startDate)
        : undefined,
      endDate: req.query.endDate
        ? String(req.query.endDate)
        : undefined,
      sortField: req.query.sortField
        ? String(req.query.sortField)
        : undefined,
      sortDirection: req.query.sortDirection === "desc" ? "desc" : "asc",
    });

    res.json(expenses);
  } catch (err) {
    next(err);
  }
}

async function getExpenseById(req, res, next) {
  try {
    const expenseId = String(req.params.id);

    const expense = await getExpenseByIdService(
      req.user.id,
      expenseId
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (err) {
    next(err);
  }
}

async function createExpense(req, res, next) {
  try {
    const expense = await createExpenseService(
      req.user.id,
      req.body
    );

    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
}

async function updateExpense(req, res, next) {
  try {
    const expenseId = String(req.params.id);

    const expense = await updateExpenseService(
      req.user.id,
      expenseId,
      req.body
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (err) {
    next(err);
  }
}

async function deleteExpense(req, res, next) {
  try {
    const expenseId = String(req.params.id);

    await deleteExpenseService(req.user.id, expenseId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
