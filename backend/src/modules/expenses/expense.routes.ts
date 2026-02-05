import { Router } from "express";
import { authMiddleware } from "@/middlewares/auth.middleware";
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./expense.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getExpenses);
router.get("/:id", getExpenseById);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
