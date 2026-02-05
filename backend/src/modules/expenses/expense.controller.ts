import { Request, Response, NextFunction } from "express";
import {
  getExpensesService,
  getExpenseByIdService,
  createExpenseService,
  updateExpenseService,
  deleteExpenseService,
} from "./expense.service";

export async function getExpenses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const expenses = await getExpensesService(req.user!.id, {
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

export async function getExpenseById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const expenseId = String(req.params.id);

    const expense = await getExpenseByIdService(
      req.user!.id,
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

export async function createExpense(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const expense = await createExpenseService(req.user!.id, req.body);
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
}

export async function updateExpense(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const expenseId = String(req.params.id);

    const expense = await updateExpenseService(
      req.user!.id,
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

export async function deleteExpense(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const expenseId = String(req.params.id);

    await deleteExpenseService(req.user!.id, expenseId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
