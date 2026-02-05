const express = require("express");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkUpdateCategory,
} = require("./category.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/bulk", bulkUpdateCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
