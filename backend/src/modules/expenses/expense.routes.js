const express = require("express");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("./expense.controller");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getExpenses);
router.get("/:id", getExpenseById);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
